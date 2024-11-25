import { SettingOutlined } from '@aggregator/icons'
import { useUrlSearchParams } from '@vueuse/core'
import { defineComponent, ref, watch, onBeforeUnmount, nextTick } from 'vue'
import TheFooter from '@/blocks/TheFooter'
import TheHeader from '@/blocks/TheHeader'
import ActionButton from '@/components/ActionButton'
import HomeSlogan from '@/components/HomeSlogan'
import RouteResult from '@/components/RouteResult'
import Setting from '@/components/Setting'
import SwapForm from '@/components/SwapForm'
import TransactionWaiting from '@/components/TransactionWaiting'
import { getNetByChainId, getNetByChainName } from '@/constants'
import { useSwapStore, useWalletStore, useGlobalConfigStore } from '@/stores'
import { bus } from '@/utils/tool'

const globalConfigStore = useGlobalConfigStore()

const LandingPage = defineComponent({
  name: 'LandingPage',
  setup(props, ctx) {
    const urlParams = useUrlSearchParams('history')
    const swapStore = useSwapStore()
    const walletStore = useWalletStore()

    const showSetting = ref(false)

    const selectedRoute = ref()

    const handleSelectRoute = (result: any) => {
      selectedRoute.value = result
    }

    const offlineInited = ref(false)

    walletStore.init()?.setTheme({
      themeMode: globalConfigStore.theme
    })

    const handlePickToken = (index: 1 | 2, token: any) => {
      console.log('handleTokenSelect', index, token)
      // sync url
      if (index === 1) {
        urlParams.from = token.address
      } else if (index === 2) {
        urlParams.to = token.address
      }
      nextTick(() => swapStore.init())
    }

    const handleReverseToken = () => {
      if (swapStore.tokenReady) {
        const backupFrom = urlParams.from
        urlParams.from = urlParams.to
        urlParams.to = backupFrom
        nextTick(() => swapStore.init())
      }
    }

    const unsubscribe = ref()
    watch(
      () => walletStore.connected,
      () => {
        if (walletStore.connected) {
          // online init
          console.log('online init', urlParams.chain, offlineInited.value)
          if (!offlineInited.value) {
            if (urlParams.chain) {
              walletStore.switchNetwork({
                chainName: urlParams.chain as string
              })
            } else {
              urlParams.chain = walletStore.chainInfo?.name.toLowerCase()
            }
            if (!urlParams.from) {
              urlParams.from = '0x0000000000000000000000000000000000000000'
            }
          } else {
            if (urlParams.chain !== walletStore.chainInfo?.name.toLowerCase()) {
              urlParams.chain = walletStore.chainInfo?.name.toLowerCase()
              urlParams.from = '0x0000000000000000000000000000000000000000'
              delete urlParams.to
            }
            swapStore.reset()
          }
          nextTick(() => {
            swapStore.init()
          })
          // sync wallet network
          if (typeof unsubscribe.value === 'function') {
            unsubscribe.value()
          }
          unsubscribe.value = watch(
            () => walletStore.chainId,
            chainId => {
              if (chainId) {
                if (urlParams.chain !== walletStore.chainInfo?.name.toLowerCase()) {
                  urlParams.chain = walletStore.chainInfo?.name.toLowerCase()
                  urlParams.from = '0x0000000000000000000000000000000000000000'
                  delete urlParams.to
                }
                swapStore.reset()
                nextTick(() => {
                  swapStore.init()
                })
              }
            }
          )
        } else {
          if (urlParams.chain) {
            swapStore.currentChainId =
              getNetByChainName(urlParams.chain as string)?.chainId || swapStore.currentChainId
          }
        }
      },
      {
        immediate: true
      }
    )

    watch(
      () => walletStore.address,
      address => {
        swapStore.reset()
        if (address) {
          // update balance
          swapStore.fetchCurrentChainBalances()
        }
      },
      {
        immediate: true
      }
    )

    let uninstallWatchInitList: any = null
    setTimeout(() => {
      // waiting for wallet autoconnect
      uninstallWatchInitList = watch(
        () => swapStore.list,
        list => {
          if (list) {
            if (!walletStore.chainId) {
              // offline init
              console.log('offline init')
              if (urlParams.chain) {
                const queryNet = getNetByChainName(urlParams.chain as string)
                if (queryNet) {
                  swapStore.currentChainId = queryNet.chainId
                  walletStore.setDefaultChainByChainId(swapStore.currentChainId)
                } else {
                  console.warn('no support net:', urlParams.chain)
                }
              } else {
                const queryNet = getNetByChainId(swapStore.currentChainId)
                if (queryNet) {
                  urlParams.chain = queryNet.name.toLowerCase()
                  urlParams.from = '0x0000000000000000000000000000000000000000'
                  delete urlParams.to
                } else {
                  console.warn('no support currentChainId:', swapStore.currentChainId)
                }
              }
              if (!urlParams.from) {
                urlParams.from = '0x0000000000000000000000000000000000000000'
              }
              offlineInited.value = true
              nextTick(() => swapStore.init())
            }
            uninstallWatchInitList && uninstallWatchInitList()
          }
        },
        {
          immediate: true
        }
      )
    }, 1000)

    // sync amount to url
    watch(
      () => swapStore.sellAmount,
      amount => {
        urlParams.amount = String(amount)
      }
    )

    // get token price
    watch(
      () => swapStore.tokens,
      () => {
        if (swapStore.tokens.filter(e => e?.address).length === 2) {
          swapStore.getTokenPrice(swapStore.tokens.filter(e => e?.address).map(e => e!.address))
        }
      },
      {
        deep: true
      }
    )

    onBeforeUnmount(() => {
      if (typeof unsubscribe.value === 'function') {
        unsubscribe.value()
      }
    })

    bus.on((event: string) => {
      switch (event) {
        case 'forceUpdate':
          // console.log('forceUpdate')
          break
        default:
      }
    })

    return {
      swapStore,
      showSetting,
      selectedRoute,
      handleSelectRoute,
      handlePickToken,
      handleReverseToken
    }
  },
  render() {
    const contBoxClass =
      'relative bg-bg3 p-4 w-104 max-w-[96vw] rounded-sm h-full border-1 border-color-border'
    const contHeadClass = 'h-6 flex items-center'

    return (
      <div>
        <TheHeader />
        <div class="flex mt-30 pb-16 justify-center <lg:mt-8 <lg:pb-8">
          <div class="min-h-95 grid gap-6 grid-cols-2 <lg:grid-cols-1">
            <div class={contBoxClass}>
              <div class={contHeadClass + ' mb-6'}>
                <strong class="flex-1 text-lg">Swap</strong>
                <SettingOutlined
                  class="cursor-pointer h-5 text-color2 w-5 hover:text-color1"
                  onClick={() => (this.showSetting = true)}
                />
              </div>
              <SwapForm onPick={this.handlePickToken} onReverse={this.handleReverseToken} />
              <ActionButton routeResult={this.selectedRoute} />
              {this.showSetting ? (
                <div class="h-full bg-bg2 w-full top-0 left-0 absolute">
                  <Setting onClose={() => (this.showSetting = false)} />
                </div>
              ) : null}
            </div>
            <div class={contBoxClass}>
              {this.swapStore.paramsReady ? (
                <RouteResult onUpdate={this.handleSelectRoute} />
              ) : (
                <HomeSlogan />
              )}
            </div>
          </div>
        </div>
        <TheFooter />
        <TransactionWaiting />
      </div>
    )
  }
})

export default LandingPage
