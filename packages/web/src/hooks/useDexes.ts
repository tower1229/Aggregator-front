import { ref } from 'vue'
import useDex0x from '@/hooks/useDex0x'
import useDex1inch from '@/hooks/useDex1inch'
import useDexCowSwap from '@/hooks/useDexCowSwap'
import useDexKyberSwap from '@/hooks/useDexKyberSwap'
import useDexOpenOcean from '@/hooks/useDexOpenOcean'
import useDexParaswap from '@/hooks/useDexParaswap'

import { useWalletStore, useSwapStore } from '@/stores'

export type swapParamsType = {
  fromTokenAddress: string
  toTokenAddress: string
  amount: string
  slippage: number
  fromAddress?: string
  fee?: number
  gasPrice?: string
  gasLimit?: number
  referrer?: string
  referrerFee?: number
}

export type swapTransactionConfigType = {
  data: string
  from?: string
  gasPrice: string
  to: string
  value: string
  allowanceTarget?: string
  gasLimit?: string
}

type dexInstanceItem = {
  name: string
  routerContract: string
  supportChainIds: number[]
  checkAllowance: () => number
  requestAllowance: (approveType: 1 | 2) => Promise<any>
  fetchRoute: () => Promise<routeResultType | undefined>
  doExchange: () => Promise<swapTransactionConfigType | undefined>
}

export type routeResultType = {
  dex: {
    name: string
    routerContract: string
  }
  estimatedGas: number
  fromToken: {
    symbol: string
    name: string
    decimals: number
    address: string
  }
  fromTokenAmount: string
  toToken: {
    symbol: string
    name: string
    decimals: number
    address: string
  }
  toTokenAmount: string
}

export type swapResultType = {
  data: string
  from: string
  gasPrice: string
  to: string
  value: string
}
// useDex1inch, useDexParaswap, useDex0x, useDexOpenOcean, useDexKyberSwap
const dexes: any[] = [
  useDex1inch,
  useDexParaswap,
  useDex0x,
  useDexOpenOcean,
  useDexKyberSwap,
  useDexCowSwap
]

export type routeCollectionType = {
  name: string
  status: 0 | 1
  result: routeResultType | undefined
}

const referrer = '0x614080EFB36a34e7D33777e0441363499e8c92A2'
const referrerFee = 0.5

export function useDexes() {
  const walletStore = useWalletStore()
  const swapStore = useSwapStore()

  const list = ref<dexInstanceItem[]>([])

  const routeResultList = ref<routeCollectionType[]>([])

  return {
    list,
    init(swapParams: swapParamsType) {
      if (!swapParams.fromAddress) {
        swapParams.fromAddress = walletStore.address
      }
      swapParams.referrer = referrer
      swapParams.referrerFee = referrerFee

      list.value = dexes
        .map(item => item(swapParams, walletStore.chainId || swapStore.currentChainId))
        .filter((dex: dexInstanceItem) =>
          dex.supportChainIds.includes(walletStore.chainId || swapStore.currentChainId)
        )
    },
    fetchRoute() {
      if (!routeResultList.value.length) {
        routeResultList.value = list.value.map(item => {
          return {
            name: item.name,
            status: 0,
            result: undefined
          }
        })
      }

      list.value.map(item => {
        item?.fetchRoute().then(res => {
          const targetIndex = routeResultList.value.findIndex(e => e.name === item.name)
          if (targetIndex === -1) {
            routeResultList.value.push({
              name: item.name,
              status: 1,
              result: res
            })
          } else {
            routeResultList.value[targetIndex] = {
              name: item.name,
              status: 1,
              result: res
            }
          }
          // routeResultList.value = routeResultList.value.map(routeItem => {
          //   if (routeItem.name === item.name) {
          //     routeItem.status = 1
          //     routeItem.result = res
          //   }
          //   return routeItem
          // })
        })
      })
      return routeResultList
    }
  }
}
