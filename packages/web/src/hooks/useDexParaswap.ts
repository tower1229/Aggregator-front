import { BigNumber } from 'ethers'
import { computed, ref } from 'vue'
import { swapParamsType, routeResultType, swapTransactionConfigType } from '@/hooks'
import { default as instance, apiRequestUrl } from '@/services/customApi'
import { useGlobalConfigStore, useSwapStore } from '@/stores'
import { erc20Contract } from '@/utils/contract'

const NAME = 'Paraswap'
const supportChainIds = [1, 10, 56, 137, 250, 42161, 43114]
let routerContract = ''

const PartnerString = 'wedex.finance'

export default function (initParams: swapParamsType, chainId: number) {
  const globalStore = useGlobalConfigStore()
  const swapStore = useSwapStore()

  const apiBaseUrl = computed(() => 'https://apiv5.paraswap.io')

  const swapParams = Object.assign(
    {
      network: chainId,
      srcToken:
        initParams.fromTokenAddress === '0x0000000000000000000000000000000000000000'
          ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
          : initParams.fromTokenAddress,
      destToken:
        initParams.toTokenAddress === '0x0000000000000000000000000000000000000000'
          ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
          : initParams.toTokenAddress,
      amount: initParams.amount,
      side: 'SELL',
      srcDecimals: swapStore.getTokenByAddress(initParams.fromTokenAddress)?.decimals,
      destDecimals: swapStore.getTokenByAddress(initParams.toTokenAddress)?.decimals,
      partner: PartnerString
    },
    initParams.fromAddress
      ? {
          userAddress: initParams.fromAddress
        }
      : {}
  )

  const checkAllowance = async () => {
    if (swapParams.userAddress) {
      if (swapParams.srcToken === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE') {
        return Infinity
      } else if (routerContract) {
        const contract = await erc20Contract(swapParams.srcToken)
        const result = await contract.allowance(swapParams.userAddress, routerContract)
        return result.toString()
      } else {
        console.warn(`${NAME} checkAllowance fail: with out routerContract`)
        return 0
      }
    } else {
      console.warn(`${NAME} checkAllowance fail: with out swapParams.userAddress`)
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
    const contract = await erc20Contract(swapParams.srcToken)
    let approveCount = swapParams.amount
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
    return instance.get(apiRequestUrl(apiBaseUrl.value + '/prices', swapParams)).then(res => {
      return catchRouteResult(res?.data)
    })
  }

  const swapTransactionConfig = ref<swapTransactionConfigType>({
    data: '',
    from: '',
    gasPrice: '',
    to: '',
    value: ''
  })

  const transformPostData = {
    srcToken: swapParams.srcToken,
    destToken: swapParams.destToken,
    srcAmount: swapParams.amount,
    srcDecimals: undefined,
    destDecimals: undefined,
    slippage: initParams.slippage,
    userAddress: swapParams.userAddress,
    positiveSlippageToUser: false,
    priceRoute: undefined,
    partner: PartnerString,
    partnerAddress: initParams.referrer,
    partnerFeeBps: Math.floor((initParams.referrerFee || 0) * 100)
  }

  const catchRouteResult: (res: any) => routeResultType | undefined = (res: any) => {
    if (res) {
      routerContract = res.priceRoute.tokenTransferProxy
      console.warn(`${NAME} set routerContract = ${routerContract}`)
      transformPostData.srcDecimals = res.priceRoute.srcDecimals
      transformPostData.destDecimals = res.priceRoute.destDecimals
      transformPostData.priceRoute = res.priceRoute
    }

    return res
      ? ({
          dex: {
            name: NAME,
            routerContract
          },
          estimatedGas: res.priceRoute.gasCost,
          fromToken: swapStore.getTokenByAddress(initParams.fromTokenAddress),
          fromTokenAmount: res.priceRoute.srcAmount,
          toToken: swapStore.getTokenByAddress(initParams.toTokenAddress),
          toTokenAmount: res.priceRoute.destAmount
        } as routeResultType)
      : undefined
  }

  const doExchange = () => {
    if (!transformPostData.userAddress) {
      console.warn(`${NAME} doExchange fail: with out userAddress`)
      return undefined
    }
    transformPostData.slippage = globalStore.swapSetting.slippage
    // console.warn(`${NAME} Apply slippage=`, transformPostData.slippage)
    return instance
      .post(apiRequestUrl(apiBaseUrl.value + `/transactions/${chainId}`), transformPostData)
      .then(res => {
        if (res) {
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
          swapTransactionConfig.value.gasPrice = finnalGasPrice
          swapTransactionConfig.value.from = res.data.from
          swapTransactionConfig.value.to = res.data.to
          swapTransactionConfig.value.data = res.data.data
          swapTransactionConfig.value.value = res.data.value
          swapTransactionConfig.value.gasLimit = res.data.gas
          return swapTransactionConfig.value
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
