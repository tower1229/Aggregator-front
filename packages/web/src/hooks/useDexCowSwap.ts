import { signMessage } from '@wagmi/core'
import { BigNumber } from 'ethers'
import { computed } from 'vue'
import { swapParamsType, routeResultType } from '@/hooks'
import { default as instance } from '@/services/customApi'
import { useGlobalConfigStore, useSwapStore } from '@/stores'
import { erc20Contract } from '@/utils/contract'

const NAME = 'CowSwap'
const supportChainIds = [1, 100]
const routerContract = '0xC92E8bdf79f0507f65a392b0ab4667716BFE0110'

const chainInfoMap: Record<number, { api: string; mainToken: string }> = {
  1: {
    api: 'https://api.cow.fi/mainnet',
    mainToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
  },
  100: {
    api: 'https://barn.api.cow.fi/xdai',
    mainToken: '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d'
  }
}

export default function (initParams: swapParamsType, chainId: number) {
  const globalStore = useGlobalConfigStore()
  const swapStore = useSwapStore()

  const apiBaseUrl = computed(() => {
    return chainInfoMap[chainId]?.api
  })

  const swapParams = Object.assign(
    {
      sellToken:
        initParams.fromTokenAddress === '0x0000000000000000000000000000000000000000'
          ? chainInfoMap[chainId]?.mainToken
          : initParams.fromTokenAddress,
      buyToken:
        initParams.toTokenAddress === '0x0000000000000000000000000000000000000000'
          ? chainInfoMap[chainId]?.mainToken
          : initParams.toTokenAddress,
      sellAmountBeforeFee: initParams.amount,
      slippage: initParams.slippage,
      kind: 'sell',
      partiallyFillable: false
    },
    initParams.fromAddress
      ? {
          receiver: initParams.fromAddress,
          from: initParams.fromAddress
        }
      : {}
  )

  const checkAllowance = async () => {
    if (swapParams.from) {
      if (swapParams.sellToken === '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d') {
        return Infinity
      } else if (routerContract) {
        const contract = await erc20Contract(swapParams.sellToken)
        const result = await contract.allowance(swapParams.from, routerContract)
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
    let approveCount = swapParams.sellAmountBeforeFee
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
    swapParams.slippage = globalStore.swapSetting.slippage

    return instance.post(apiBaseUrl.value + '/api/v1/quote', swapParams).then(res => {
      return catchRouteResult(res?.data)
    })
  }

  let orderParamsData = { signature: '' }

  const catchRouteResult: (res: any) => routeResultType | undefined = (res: any) => {
    if (res?.quote) {
      orderParamsData = res.quote
    }

    return res?.quote
      ? ({
          dex: {
            name: NAME,
            routerContract
          },
          estimatedGas: Math.round(res.quote.feeAmount / swapStore.feeData.formatted.gasPrice),
          fromToken: swapStore.getTokenByAddress(res.quote.sellToken),
          fromTokenAmount: res.quote.sellAmount,
          toToken: swapStore.getTokenByAddress(res.quote.buyToken),
          toTokenAmount: res.quote.buyAmount
        } as routeResultType)
      : undefined
  }

  const doExchange = () => {
    if (!swapParams.from) {
      return Promise.reject('no from')
    }
    signMessage({
      message: JSON.stringify(orderParamsData)
    }).then(signature => {
      console.log(`${NAME} signature=`, signature)
      orderParamsData.signature = signature
    })
    return instance.post(apiBaseUrl.value + '/api/v1/orders', orderParamsData).then(res => {
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
          from: swapParams.from,
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
