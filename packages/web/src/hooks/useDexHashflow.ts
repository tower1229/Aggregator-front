import { BigNumber } from 'ethers'
import { computed } from 'vue'
import { swapParamsType, routeResultType } from '@/hooks'
import { default as instance } from '@/services/customApi'
import { useGlobalConfigStore, useSwapStore } from '@/stores'
import { erc20Contract } from '@/utils/contract'
// TODO
const NAME = 'Hashflow'
const supportChainIds = [1, 56, 10, 137, 42161, 43114]

export default function (initParams: swapParamsType, chainId: number) {
  const globalStore = useGlobalConfigStore()
  const swapStore = useSwapStore()

  const HashflowRouter: Record<number, any> = {
    1: {
      address: '0xF6a94dfD0E6ea9ddFdFfE4762Ad4236576136613'
    },
    10: {
      address: '0xb3999F658C0391d94A37f7FF328F3feC942BcADC'
    },
    56: {
      address: '0x0ACFFB0fb2cddd9BD35d03d359F3D899E32FACc9'
    },
    137: {
      address: '0x72550597dc0b2e0beC24e116ADd353599Eff2E35'
    },
    42161: {
      address: '0x1F772fA3Bc263160ea09bB16CE1A6B8Fc0Fab36a'
    },
    43114: {
      address: '0x64D2f9F44FE26C157d552aE7EAa613Ca6587B59e'
    }
  }
  const routerContract = HashflowRouter[chainId]?.address

  const apiBaseUrl = computed(() => {
    return `https://api.hashflow.com`
  })

  const swapParams = Object.assign(
    {
      baseToken:
        initParams.fromTokenAddress === '0x0000000000000000000000000000000000000000'
          ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
          : initParams.fromTokenAddress,
      quoteToken:
        initParams.toTokenAddress === '0x0000000000000000000000000000000000000000'
          ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
          : initParams.toTokenAddress,
      baseTokenAmount: initParams.amount,
      networkId: chainId,
      rfqType: 0,
      source: 'hashflow'
    },
    initParams.fromAddress
      ? {
          trader: initParams.fromAddress
        }
      : {}
  )

  const checkAllowance = async () => {
    if (swapParams.trader) {
      if (swapParams.baseToken === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE') {
        return Infinity
      } else if (routerContract) {
        const contract = await erc20Contract(swapParams.baseToken)
        const result = await contract.allowance(swapParams.trader, routerContract)
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

    const contract = await erc20Contract(swapParams.baseToken)
    let approveCount = swapParams.baseTokenAmount
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
    return instance.post(apiBaseUrl.value + '/taker/v2/rfq', swapParams).then(res => {
      return catchRouteResult(res?.data)
    })
  }

  let orderParamsData: Record<string, any> = {}

  const catchRouteResult: (res: any) => routeResultType | undefined = (res: any) => {
    if (res.quoteData) {
      orderParamsData = res.quoteData
    }

    return res
      ? ({
          dex: {
            name: NAME,
            routerContract
          },
          estimatedGas: res.quote.feeAmount,
          fromToken: swapStore.getTokenByAddress(res.quote.sellToken),
          fromTokenAmount: res.quote.sellAmount,
          toToken: swapStore.getTokenByAddress(res.quote.buyToken),
          toTokenAmount: res.quote.buyAmount
        } as routeResultType)
      : undefined
  }

  const doExchange = () => {
    if (!swapParams.trader) {
      return Promise.reject('no from')
    }

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

    return {
      data: orderParamsData.data,
      from: swapParams.trader,
      gasPrice: finnalGasPrice,
      to: routerContract,
      value: orderParamsData.value,
      gasLimit: orderParamsData.gasEstimate
    }
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
