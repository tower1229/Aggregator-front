import { BigNumber } from 'ethers'
import { computed } from 'vue'
import { swapParamsType, routeResultType } from '@/hooks'
import { default as instance, apiRequestUrl } from '@/services/customApi'
import { useGlobalConfigStore, useSwapStore } from '@/stores'
import { erc20Contract } from '@/utils/contract'

const NAME = 'Matcha/0x'
const supportChainIds = [1, 5, 137, 80001, 56, 10, 250, 42220, 43114, 42161]
let routerContract = ''
const HeaderSet = {
  '0x-api-key': '14892b5e-bc07-4559-a6e5-90e91be90b68'
}

export default function (initParams: swapParamsType, chainId: number) {
  const globalStore = useGlobalConfigStore()
  const swapStore = useSwapStore()

  const apiBaseUrl = computed(() => {
    return {
      1: 'https://api.0x.org/swap/v1',
      5: 'https://goerli.api.0x.org/swap/v1',
      137: 'https://polygon.api.0x.org/swap/v1',
      80001: 'https://mumbai.api.0x.org/swap/v1',
      56: 'https://bsc.api.0x.org/swap/v1',
      10: 'https://optimism.api.0x.org/swap/v1',
      250: 'https://fantom.api.0x.org/swap/v1',
      42220: 'https://celo.api.0x.org/swap/v1',
      43114: 'https://avalanche.api.0x.org/swap/v1',
      42161: 'https://arbitrum.api.0x.org/swap/v1'
    }[chainId]
  })

  const swapParams = Object.assign(
    {
      sellToken:
        initParams.fromTokenAddress === '0x0000000000000000000000000000000000000000'
          ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
          : initParams.fromTokenAddress,
      buyToken:
        initParams.toTokenAddress === '0x0000000000000000000000000000000000000000'
          ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
          : initParams.toTokenAddress,
      sellAmount: initParams.amount,
      slippagePercentage: initParams.slippage,
      gasPrice: initParams.gasPrice,
      feeRecipient: initParams.referrer,
      buyTokenPercentageFee: (initParams.referrerFee || 0) / 100,
      affiliateAddress: initParams.referrer
    },
    initParams.fromAddress
      ? {
          takerAddress: initParams.fromAddress
        }
      : {}
  )

  const checkAllowance = async () => {
    if (swapParams.takerAddress) {
      if (swapParams.sellToken === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE') {
        return Infinity
      } else if (routerContract) {
        const contract = await erc20Contract(swapParams.sellToken)
        const result = await contract.allowance(swapParams.takerAddress, routerContract)
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

    const contract = await erc20Contract(swapParams.sellToken)
    let approveCount = swapParams.sellAmount
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
    swapParams.slippagePercentage = globalStore.swapSetting.slippage / 100
    swapParams.gasPrice = swapStore.feeData.formatted.gasPrice
    return instance
      .get(apiRequestUrl(apiBaseUrl.value + '/price', swapParams), {
        headers: HeaderSet
      })
      .then(res => {
        return catchRouteResult(res?.data)
      })
  }

  const catchRouteResult: (res: any) => routeResultType | undefined = (res: any) => {
    if (res) {
      routerContract = res.allowanceTarget
      console.warn(`${NAME} set routerContract = ${routerContract}`)
    }

    return res
      ? ({
          dex: {
            name: NAME,
            routerContract
          },
          estimatedGas: res.gas,
          fromToken: swapStore.getTokenByAddress(res.sellTokenAddress),
          fromTokenAmount: res.sellAmount,
          toToken: swapStore.getTokenByAddress(res.buyTokenAddress),
          toTokenAmount: res.buyAmount
        } as routeResultType)
      : undefined
  }

  const doExchange = () => {
    if (!swapParams.takerAddress) {
      return Promise.reject('no takerAddress')
    }
    swapParams.slippagePercentage = globalStore.swapSetting.slippage / 100
    // console.warn(`${NAME} Apply slippage=`, swapParams.slippagePercentage)
    return instance
      .get(apiRequestUrl(apiBaseUrl.value + '/quote', swapParams), {
        headers: HeaderSet
      })
      .then(res => {
        const data = res?.data
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

          return {
            data: data.data,
            from: swapParams.takerAddress,
            gasPrice: finnalGasPrice,
            to: data.to,
            value: data.value,
            gasLimit: data.gas
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
