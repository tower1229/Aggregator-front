import { BigNumber, utils } from 'ethers'
import { computed } from 'vue'
import { swapParamsType, routeResultType } from '@/hooks'
import { default as instance, apiRequestUrl } from '@/services/customApi'
import { useGlobalConfigStore, useSwapStore } from '@/stores'
import { erc20Contract } from '@/utils/contract'

const NAME = 'OpenOcean'
const supportChainIds = [
  1, 56, 66, 137, 100, 128, 250, 288, 43114, 42161, 10, 1285, 1313161554, 25, 1666600000
]
const routerContract = '0x6352a56caadc4f1e25cd6c75970fa768a3304e64'

export default function (initParams: swapParamsType, chainId: number) {
  const globalStore = useGlobalConfigStore()
  const swapStore = useSwapStore()

  const chainMap: Record<number, string> = {
    1: 'eth',
    56: 'bsc',
    66: 'okex',
    137: 'polygon',
    100: 'xdai',
    128: 'heco',
    250: 'fantom',
    288: 'boba',
    43114: 'avax',
    42161: 'arbitrum',
    10: 'optimism',
    1285: 'moonriver',
    1313161554: 'aurora',
    25: 'cronos',
    1666600000: 'harmony'
  }
  const apiBaseUrl = computed(() => {
    return `https://open-api.openocean.finance/v3/${chainMap[chainId]}`
  })

  const swapParams = Object.assign(
    {
      inTokenAddress:
        initParams.fromTokenAddress === '0x0000000000000000000000000000000000000000'
          ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
          : initParams.fromTokenAddress,
      outTokenAddress:
        initParams.toTokenAddress === '0x0000000000000000000000000000000000000000'
          ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
          : initParams.toTokenAddress,
      amount: swapStore.sellAmount,
      slippage: initParams.slippage,
      gasPrice: initParams.gasPrice,
      referrer: initParams.referrer,
      referrerFee: initParams.referrerFee
    },
    initParams.fromAddress
      ? {
          account: initParams.fromAddress
        }
      : {}
  )

  const checkAllowance = async () => {
    if (swapParams.account) {
      if (swapParams.inTokenAddress === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE') {
        return Infinity
      } else if (routerContract) {
        const contract = await erc20Contract(swapParams.inTokenAddress)
        const result = await contract.allowance(swapParams.account, routerContract)
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

    const contract = await erc20Contract(swapParams.inTokenAddress)
    let approveCount = initParams.amount
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
    if (!apiBaseUrl.value) {
      return Promise.reject(`${NAME}: no apiBaseUrl`)
    }
    swapParams.slippage = globalStore.swapSetting.slippage
    swapParams.gasPrice = utils.formatUnits(swapStore.feeData.formatted.gasPrice, 'gwei')
    return instance.get(apiRequestUrl(apiBaseUrl.value + '/quote', swapParams)).then(res => {
      return catchRouteResult(res?.data?.data)
    })
  }

  const catchRouteResult: (res: any) => routeResultType | undefined = (res: any) => {
    return res
      ? ({
          dex: {
            name: NAME,
            routerContract
          },
          estimatedGas: res.estimatedGas,
          fromToken: swapStore.getTokenByAddress(initParams.fromTokenAddress),
          fromTokenAmount: res.inAmount,
          toToken: swapStore.getTokenByAddress(initParams.toTokenAddress),
          toTokenAmount: res.outAmount
        } as routeResultType)
      : undefined
  }

  const doExchange = () => {
    if (!swapParams.account) {
      return Promise.reject('no account')
    }
    swapParams.slippage = globalStore.swapSetting.slippage
    // console.warn(`${NAME} Apply slippage=`, swapParams.slippage)
    return instance.get(apiRequestUrl(apiBaseUrl.value + '/swap_quote', swapParams)).then(res => {
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

        return {
          data: data.data,
          from: swapParams.account,
          gasPrice: finnalGasPrice,
          to: routerContract,
          value: data.value,
          gasLimit: data.estimatedGas
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
