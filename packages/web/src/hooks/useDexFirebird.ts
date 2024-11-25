import { BigNumber } from 'ethers'
import { computed, ref } from 'vue'
import { swapParamsType, routeResultType, swapTransactionConfigType } from '@/hooks'
import { default as instance, apiRequestUrl } from '@/services/customApi'
import { useGlobalConfigStore, useSwapStore } from '@/stores'
import { erc20Contract } from '@/utils/contract'
// TODO
const routerContract = ''

export default function (initParams: swapParamsType, chainId: number) {
  const globalStore = useGlobalConfigStore()
  const swapStore = useSwapStore()

  const apiBaseUrl = computed(() => 'https://router.firebird.finance/aggregator/v1')

  const swapParams = {
    chainId,
    from:
      initParams.fromTokenAddress === '0x0000000000000000000000000000000000000000'
        ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
        : initParams.fromTokenAddress,
    to:
      initParams.toTokenAddress === '0x0000000000000000000000000000000000000000'
        ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
        : initParams.toTokenAddress,
    amount: initParams.amount,
    receiver: initParams.fromAddress,
    source: 'sample'
  }

  const checkAllowance = async () => {
    if (swapParams.receiver) {
      if (swapParams.from === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE') {
        return Infinity
      } else if (routerContract) {
        const contract = await erc20Contract(swapParams.from)
        return contract.allowance(swapParams.receiver, routerContract)
      } else {
        return 0
      }
    } else {
      return 0
    }
  }

  // requestAllowance
  const requestAllowance = async () => {
    globalStore.btnLoading = true

    console.log('route address=', routerContract)
    if (!routerContract) {
      return undefined
    }
    const contract = await erc20Contract(swapParams.from)
    const approveRes = await contract
      .approve(routerContract, BigNumber.from(swapParams.amount))
      .catch((err: any) => null)
    console.log('approveRes=', approveRes)
    approveRes && (await approveRes.wait())
    globalStore.btnLoading = false
    return approveRes
  }

  const fetchRoute: () => Promise<routeResultType | undefined> = () => {
    return instance.get(apiRequestUrl(apiBaseUrl.value + '/route', swapParams)).then(res => {
      return catchRouteResult(res.data)
    })
  }

  const swapTransactionConfig = ref<swapTransactionConfigType>({
    data: '',
    from: '',
    gasPrice: '',
    to: '',
    value: '',
    allowanceTarget: ''
  })

  const catchRouteResult: (res: any) => routeResultType | undefined = (res: any) => {
    if (res) {
      console.log(res)
      swapTransactionConfig.value = {
        data: res.data,
        from: swapParams.receiver,
        gasPrice: res.gasPrice,
        to: res.to,
        value: res.value,
        allowanceTarget: res.allowanceTarget
      }
    }

    return res
      ? ({
          dex: {
            name: 'Firebird',
            routerContract
          },
          estimatedGas: res.gas,
          fromToken: swapStore.getTokenByAddress(res.sellTokenAddress),
          fromTokenAmount: res.amount,
          toToken: swapStore.getTokenByAddress(res.buyTokenAddress),
          toTokenAmount: res.buyAmount
        } as routeResultType)
      : undefined
  }

  const doExchange = () => {
    return swapTransactionConfig.value
  }

  return {
    checkAllowance,
    requestAllowance,
    fetchRoute,
    doExchange
  }
}
