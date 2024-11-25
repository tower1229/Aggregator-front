import { useUrlSearchParams, useFetch } from '@vueuse/core'
import { fetchBalance, fetchFeeData } from '@wagmi/core'
import { defineStore } from 'pinia'
import { useWalletStore } from './wallet'
import AllTokens from '@/assets/data/tokenlist.json'
import { TokenItemType } from '@/components/TokenSelect'
import { supportedNetworks, SpinAddressMap, getNetByChainId, getNetByChainName } from '@/constants'
import { fetchBalances, fetchTokenPriceByLLama } from '@/services/customApi'
import { formatUnits } from '@/utils/number'
import { bus } from '@/utils/tool'

type TokenExtentionType = {
  amount?: string
  price?: number
  balance?: number
}

type State = {
  tokens: (TokenType | undefined)[]
  sellAmount?: number
  allowanceStore: Record<string, number>
  balanceStore: Record<string, string>
  priceStore: Record<string, number>
  currentChainBalance?: any[]
  currentChainId: number
  stateStack: {
    label: string
  }[]
  tokenReady?: boolean
  feeData: any
  spinAddress?: string[]
  chainsBalanceStore: Record<string, any>[]
  allTokens: Record<number, TokenType[]>
  mainTokenInfo?: TokenItemType
}

export type TokenType = TokenItemType & TokenExtentionType

export const useSwapStore = defineStore('swap', {
  state: (): State => ({
    tokens: [undefined, undefined],
    sellAmount: 1,
    allowanceStore: {},
    balanceStore: {},
    priceStore: {},
    currentChainId: supportedNetworks[0].chainId,
    stateStack: [],
    feeData: undefined,
    chainsBalanceStore: [],
    allTokens: {}
  }),
  getters: {
    tokenReady: state => state.tokens.filter(e => e?.address).length === 2,
    paramsReady: state => state.tokenReady && (state.sellAmount || 0) > 0,
    swapReady: state => state.stateStack.length > 4 && state.sellAmount,
    token0Allowance: state => {
      if (state.tokens[0]?.address) {
        const allowance = state.allowanceStore[state.tokens[0].address]
        if (allowance) {
          if (allowance === Infinity) {
            return Infinity
          } else {
            return formatUnits(String(allowance), state.tokens[0]?.decimals)
          }
        } else {
          return 0
        }
      } else {
        return 0
      }
    },
    list: state => {
      // TODO add mainToken
      const walletStore = useWalletStore()
      return (state.allTokens[walletStore.chainId || state.currentChainId] || [])
        .concat([state.mainTokenInfo as TokenItemType])
        .map(item => {
          const storeAmount = state.balanceStore[item.address]
          const target = state.currentChainBalance?.find(citem => citem.address === item.address)
          const amount = storeAmount || target?.amount || 0
          const balanceData = {
            amount,
            price: target?.price,
            balance: formatUnits(amount, item.decimals)
          }
          return {
            ...item,
            ...balanceData
          }
        })
        .sort((l, r) =>
          (l.balance || 0) * (l.price || 0) > (r.balance || 0) * (r.price || 0) ? -1 : 1
        )
    },
    mainTokenInfo: state => {
      const walletStore = useWalletStore()
      const nativeToken = (
        (AllTokens as Record<string, any[]>)[String(walletStore.chainId || state.currentChainId)] ||
        []
      ).find(e => e.address === '0x0000000000000000000000000000000000000000')
      if (nativeToken) {
        const customNetwork = getNetByChainId(walletStore.chainId || state.currentChainId)
        if (!nativeToken.geckoId) {
          nativeToken.geckoId = customNetwork?.coingeckoId
        }

        if (!nativeToken.coingeckoPlatformId) {
          nativeToken.coingeckoPlatformId = customNetwork?.coingeckoPlatformId
        }
      }
      return {
        mcap: nativeToken.mcap,
        address: nativeToken.address,
        chainId: nativeToken.chainId,
        name: nativeToken.name,
        symbol: nativeToken.symbol,
        logoURI: nativeToken.logoURI,
        decimals: nativeToken.decimals,
        geckoId: nativeToken.geckoId,
        coingeckoPlatformId: nativeToken.coingeckoPlatformId
      } as TokenItemType
    },
    spinAddress: state => {
      const walletStore = useWalletStore()
      return SpinAddressMap[walletStore.chainId || state.currentChainId] || []
    },
    currentChainBalance: state => {
      const walletStore = useWalletStore()
      const currentChain = state.chainsBalanceStore.find(
        (item: any) => item.chainId === Number(walletStore.chainId)
      )
      return (currentChain as any)?.balances || []
    }
  },
  actions: {
    init: async function () {
      const params = useUrlSearchParams('history')
      const { chain, from, to, amount } = params
      console.log('init', chain, from, to)
      // pre fetch
      // this.getTokenPrice(['0x0000000000000000000000000000000000000000'])
      await this.getAllTokens()
      let fromToken = undefined
      if (from) {
        fromToken = this.getTokenByAddress(from as string)
        if (fromToken) {
          this.updateTokenBalance({
            token: fromToken.address
          })
        }
      }
      let toToken = undefined
      if (to) {
        toToken = this.getTokenByAddress(to as string)
        if (toToken) {
          this.updateTokenBalance({
            token: toToken.address
          })
        }
      }
      this.tokens = [fromToken, toToken]
      if (amount) {
        this.sellAmount = Number(amount)
      }
    },
    reset() {
      this.allowanceStore = {}
      this.balanceStore = {}
      this.priceStore = {}
    },
    getAllTokens: async function () {
      const walletStore = useWalletStore()
      const chainId = walletStore.chainId || this.currentChainId
      if (this.allTokens[chainId]) {
        return this.allTokens
      } else {
        const customNetwork = getNetByChainId(chainId)
        if (!customNetwork?.coingeckoPlatformId) {
          console.warn('missing coingeckoPlatformId', customNetwork)
          return this.allTokens
        }
        const { data } = await useFetch(
          `https://tokens.coingecko.com/${customNetwork.coingeckoPlatformId}/all.json`
        )
          .get()
          .json()
        if (Array.isArray(data.value.tokens)) {
          this.allTokens[chainId] = data.value.tokens
        }

        return this.allTokens
      }
    },
    updateTokenBalance(params: { address?: any; token: any }) {
      const walletStore = useWalletStore()
      const options: any = {
        address: (params.address || walletStore.address) as `0x${string}`,
        token:
          params.token === '0x0000000000000000000000000000000000000000' ? undefined : params.token,
        formatUnits: 'wei'
      }
      if (!options.address || !params.token) {
        return console.warn('get balance error', params, options)
      }

      console.log('will update balance...', params, options)
      fetchBalance(options).then(balance => {
        console.log('update balance=', params.token, balance.formatted)
        this.balanceStore[params.token] = balance.formatted
        bus.emit('forceUpdate')
      })
    },
    getTokenPrice(addressesArr: string[], callback?: () => void) {
      const params = useUrlSearchParams('history')
      const walletStore = useWalletStore()
      const chainName =
        (params.chain && getNetByChainName(params.chain as string)?.defillamaId) ||
        (walletStore.chainId && getNetByChainId(walletStore.chainId)?.defillamaId) ||
        walletStore.chainInfo?.name ||
        params.chain
      const addressesArrWithoutCache = addressesArr.filter(addr => !this.priceStore[addr])
      if (addressesArrWithoutCache.length > 0) {
        fetchTokenPriceByLLama(chainName, {
          contract_addresses: addressesArrWithoutCache
        })?.then(priceMap => {
          if (priceMap) {
            const addresses = Object.keys(priceMap)
            addresses.forEach(addr => {
              const contract = addr.split(':')[1]
              if (contract) {
                this.priceStore[contract] = priceMap[addr]
              } else {
                console.warn(`get price error`, addr, priceMap)
              }
            })
            typeof callback === 'function' && callback()
          } else {
            // console.warn('get mainToken error', price)
          }
        })
      } else {
        typeof callback === 'function' && callback()
      }

      // const erc20TokenList = addressesArrWithoutCache.filter(
      //   addr => addr !== '0x0000000000000000000000000000000000000000'
      // )

      // // get erc20Token price
      // if (erc20TokenList.length) {
      //   if (!this.mainTokenInfo?.coingeckoPlatformId) {
      //     console.warn('can not getTokenPrice without geckoId')
      //     return
      //   }
      //   if (chainName) {
      //     fetchTokenPrice(this.mainTokenInfo?.coingeckoPlatformId, {
      //       contract_addresses: erc20TokenList.join(',')
      //     })?.then(priceMap => {
      //       if (priceMap) {
      //         const addresses = Object.keys(priceMap)
      //         addresses.forEach(addr => {
      //           this.priceStore[addr] = priceMap[addr]
      //         })
      //         typeof callback === 'function' && callback()
      //       } else {
      //         // console.warn('get TokenPrice error', price)
      //       }
      //     })
      //   } else {
      //     console.warn('can not getTokenPrice without chainName')
      //   }
      // }

      // if (erc20TokenList.length < addressesArrWithoutCache.length) {
      //   if (!this.mainTokenInfo?.geckoId) {
      //     console.warn('can not getTokenPrice without geckoId')
      //     return
      //   }
      //   // get mainToken
      //   fetchTokenPrice(this.mainTokenInfo?.geckoId, {})?.then(priceMap => {
      //     if (priceMap) {
      //       const addresses = Object.keys(priceMap)
      //       addresses.forEach(addr => {
      //         this.priceStore[addr] = priceMap[addr]
      //       })
      //       typeof callback === 'function' && callback()
      //     } else {
      //       // console.warn('get mainToken error', price)
      //     }
      //   })
      // }
    },
    fetchCurrentChainBalances() {
      const walletStore = useWalletStore()
      if (walletStore.address) {
        fetchBalances(walletStore.address).then((res: any) => {
          if (res?.data) {
            this.chainsBalanceStore = res.data.chains || []
            console.log('currentChainBalance Balances update')

            setTimeout(() => {
              this.currentChainBalance.forEach((item: any) => {
                if (this.balanceStore[item.address] === undefined) {
                  this.balanceStore[item.address] = item.amount
                }
              })
            }, 0)
          } else {
            console.warn('fetchCurrentChainBalances error')
          }
        })
      }
    },
    getTokenByAddress(contractAddress: string) {
      if (contractAddress === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
        contractAddress = '0x0000000000000000000000000000000000000000'
      }
      return this.list.find(item => item.address === contractAddress)
    },
    getFeeData(callback?: any, reload?: boolean) {
      const walletStore = useWalletStore()
      if (typeof callback === 'function') {
        if (this.feeData && !reload) {
          callback(this.feeData)
        } else {
          fetchFeeData({
            chainId: walletStore.chainId,
            formatUnits: 'wei'
          }).then(fee => {
            this.feeData = fee
            callback(this.feeData)
          })
        }
      } else {
        fetchFeeData({
          chainId: walletStore.chainId,
          formatUnits: 'wei'
        }).then(fee => (this.feeData = fee))
      }
    }
  }
})
