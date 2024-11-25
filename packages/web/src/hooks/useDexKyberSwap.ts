import { BigNumber } from 'ethers'
import { computed } from 'vue'
import { swapParamsType, routeResultType } from '@/hooks'
import { default as instance, apiRequestUrl } from '@/services/customApi'
import { useGlobalConfigStore, useSwapStore } from '@/stores'
import { erc20Contract } from '@/utils/contract'

const NAME = 'KyberSwap'
const supportChainIds = [1, 1313161554, 42161, 43114, 56, 199, 25, 250, 42262, 137, 106, 10]
let routerContract = ''

export default function (initParams: swapParamsType, chainId: number) {
  const globalStore = useGlobalConfigStore()
  const swapStore = useSwapStore()

  const apiBaseUrl = computed(() => {
    return `https://aggregator-api.kyberswap.com/${
      {
        1: 'ethereum',
        42161: 'arbitrum',
        1313161554: 'aurora',
        43114: 'avalanche',
        56: 'bsc',
        199: 'bttc',
        25: 'cronos',
        250: 'fantom',
        42262: 'oasis',
        137: 'polygon',
        106: 'velas',
        10: 'optimism'
      }[chainId]
    }`
  })

  const swapParams = Object.assign(
    {
      tokenIn:
        initParams.fromTokenAddress === '0x0000000000000000000000000000000000000000'
          ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
          : initParams.fromTokenAddress,
      tokenOut:
        initParams.toTokenAddress === '0x0000000000000000000000000000000000000000'
          ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
          : initParams.toTokenAddress,
      amountIn: initParams.amount,
      gasPrice: initParams.gasPrice,
      source: 'wedex',
      chargeFeeBy: initParams.referrerFee,
      feeReceiver: initParams.referrer
    },
    initParams.fromAddress
      ? {
          sender: initParams.fromAddress,
          recipient: initParams.fromAddress
        }
      : {}
  )

  const checkAllowance = async () => {
    if (swapParams.sender) {
      if (swapParams.tokenIn === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE') {
        return Infinity
      } else if (routerContract) {
        const contract = await erc20Contract(swapParams.tokenIn)
        const result = await contract.allowance(swapParams.sender, routerContract)
        return result.toString()
      } else {
        console.warn(`${NAME} checkAllowance fail: with out routerContract`)
        return 0
      }
    } else {
      return 0
    }
  }

  // requestAllowance
  const requestAllowance = async (approveType: 1 | 2) => {
    console.log('route address=', routerContract)
    if (!routerContract) {
      console.warn(`${NAME} requestAllowance fail: with out routerContract`)
      return undefined
    }

    const contract = await erc20Contract(swapParams.tokenIn)
    let approveCount = swapParams.amountIn
    if (approveType === 2) {
      approveCount = await contract.totalSupply()
    }
    const approveRes = await contract
      .approve(routerContract, BigNumber.from(approveCount))
      .catch((err: any) => null)
    console.log('approveRes=', approveRes)
    approveRes && (await approveRes.wait())
    return approveRes
  }

  const fetchRoute: () => Promise<routeResultType | undefined> = () => {
    swapParams.gasPrice = swapStore.feeData.formatted.gasPrice
    return instance
      .get(apiRequestUrl(apiBaseUrl.value + '/api/v1/routes', swapParams))
      .then(res => {
        return catchRouteResult(res?.data?.data)
      })
  }

  const catchRouteResult: (res: any) => routeResultType | undefined = (res: any) => {
    if (res) {
      routerContract = res.routerAddress
      console.warn(`${NAME} set routerContract = ${routerContract}`)
      exchangeData.routeSummary = res.routeSummary
    }

    return res
      ? ({
          dex: {
            name: NAME,
            routerContract
          },
          estimatedGas: res.routeSummary.gas,
          fromToken: swapStore.getTokenByAddress(res.routeSummary.tokenIn),
          fromTokenAmount: res.routeSummary.amountIn,
          toToken: swapStore.getTokenByAddress(res.routeSummary.tokenOut),
          toTokenAmount: res.routeSummary.amountOut
        } as routeResultType)
      : undefined
  }

  const exchangeData = {
    routeSummary: null,
    deadline: 0,
    slippageTolerance: globalStore.swapSetting.slippage * 100,
    sender: swapParams.sender,
    recipient: swapParams.recipient,
    source: 'wedex'
  }

  const doExchange = () => {
    if (!swapParams.sender) {
      return Promise.reject('no sender')
    }
    exchangeData.deadline = globalStore.swapSetting.deadline * 6e4 + new Date().getTime()
    exchangeData.slippageTolerance = globalStore.swapSetting.slippage * 100
    // console.warn(`${NAME} Apply slippage=`, globalStore.swapSetting.slippage)
    return instance
      .post(apiRequestUrl(apiBaseUrl.value + '/api/v1/route/build'), exchangeData)
      .then(res => {
        const data = res?.data?.data
        if (data) {
          let finnalGasPrice = swapStore.feeData.formatted.gasPrice
          switch (globalStore.swapSetting.speed) {
            case 'Normal':
              finnalGasPrice =
                swapStore.feeData.formatted.maxFeePerGas -
                swapStore.feeData.formatted.maxPriorityFeePerGas +
                1000000000
              break
            case 'Fast':
              // default
              break
            case 'Instant':
              finnalGasPrice = swapStore.feeData.formatted.maxFeePerGas
              break
            default:
          }

          // console.warn(
          //   `${NAME} Apply gasPrice with ${globalStore.swapSetting.speed}, value=`,
          //   finnalGasPrice
          // )

          console.warn(
            `${NAME} Apply gasLimit with String(Number(data.gas) * 3), value=`,
            String(Number(data.gas) * 3)
          )

          return {
            data: data.data,
            from: swapParams.sender,
            gasPrice: finnalGasPrice,
            to: data.routerAddress,
            value:
              swapParams.tokenIn === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
                ? data.amountIn
                : 0,
            gasLimit: String(Number(data.gas) * 3)
          }
        } else {
          return undefined
        }
      })
  }

  return {
    name: NAME,
    supportChainIds,
    checkAllowance,
    requestAllowance,
    fetchRoute,
    doExchange
  }
}
