import { BigNumber } from 'ethers'
import { computed } from 'vue'
import { swapParamsType, routeResultType, swapResultType } from '@/hooks'
import { default as instance, apiRequestUrl } from '@/services/customApi'
import { useGlobalConfigStore, useSwapStore } from '@/stores'
import { erc20Contract } from '@/utils/contract'

const NAME = '1inch'
const supportChainIds = [1, 10, 56, 100, 137, 250, 42161, 43114]
let routerContract = ''

export default function (initParams: swapParamsType, chainId: number) {
  const globalStore = useGlobalConfigStore()
  const swapStore = useSwapStore()

  const apiBaseUrl = computed(() => 'https://api.1inch.io/v5.0/' + chainId)
  const swapParams = Object.assign(
    {
      fromTokenAddress:
        initParams.fromTokenAddress === '0x0000000000000000000000000000000000000000'
          ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
          : initParams.fromTokenAddress,
      toTokenAddress:
        initParams.toTokenAddress === '0x0000000000000000000000000000000000000000'
          ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
          : initParams.toTokenAddress,
      amount: initParams.amount,
      fromAddress: initParams.fromAddress,
      slippage: initParams.slippage,
      referrerAddress: initParams.referrer,
      fee: initParams.referrerFee
    },
    initParams.gasPrice ? { gasPrice: initParams.gasPrice } : {}
  )

  const checkAllowance = async () => {
    if (swapParams.fromAddress) {
      if (swapParams.fromTokenAddress === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE') {
        return Infinity
      } else {
        return await instance
          .get(
            apiRequestUrl(apiBaseUrl.value + '/approve/allowance', {
              tokenAddress: swapParams.fromTokenAddress,
              walletAddress: swapParams.fromAddress
            })
          )
          .then(res => {
            return Number(res.data.allowance)
          })
      }
    } else {
      return 0
    }
  }

  // requestAllowance
  const requestAllowance = async (approveType: 1 | 2) => {
    if (!routerContract) {
      routerContract = await instance
        .get(apiRequestUrl(apiBaseUrl.value + '/approve/spender'))
        .then(res => {
          return res.data.address
        })
    }

    console.log('route address=', routerContract)
    const contract = await erc20Contract(swapParams.fromTokenAddress)
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

  const fetchRoute: () => Promise<routeResultType> = () => {
    return instance.get(apiRequestUrl(apiBaseUrl.value + '/quote', swapParams)).then(res => {
      return catchRouteResult(res?.data)
    })
  }

  const catchRouteResult: (res: any) => routeResultType = (res: any) => {
    return res
      ? {
          ...res,
          dex: {
            name: NAME,
            routerContract
          }
        }
      : undefined
  }

  const doExchange = () => {
    let finnalGasPrice = swapStore.feeData.formatted.gasPrice
    switch (globalStore.swapSetting.speed) {
      case 'Normal':
        finnalGasPrice = String(
          swapStore.feeData.formatted.maxFeePerGas -
            swapStore.feeData.formatted.maxPriorityFeePerGas
        )
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
    swapParams.gasPrice = finnalGasPrice
    swapParams.slippage = globalStore.swapSetting.slippage

    return instance.get(apiRequestUrl(apiBaseUrl.value + '/swap', swapParams)).then(res => {
      return catchSwapResult(res?.data)
    })
  }

  const catchSwapResult: (res: any) => swapResultType | undefined = (res: any) => {
    return res
      ? {
          data: res.tx.data,
          from: res.tx.from,
          gasPrice: res.tx.gasPrice,
          to: res.tx.to,
          value: res.tx.value
        }
      : undefined
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
