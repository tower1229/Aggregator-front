import { UButton, UPopover } from '@aggregator/components'
import { ArrowDownOutlined, ConfirmOutlined } from '@aggregator/icons'
import { useUrlSearchParams } from '@vueuse/core'
import { BigNumber } from 'ethers'
import { defineComponent, PropType, computed, watch, ref } from 'vue'
import { useWalletStore, useSwapStore, useGlobalConfigStore } from '@/stores'
import { formatUnits } from '@/utils/number'
import { bus } from '@/utils/tool'
//

export default defineComponent({
  name: 'ActionButton',
  emits: ['update'],
  props: {
    routeResult: {
      type: Object as PropType<any>
    }
  },
  setup(props, ctx) {
    const swapStore = useSwapStore()
    const walletStore = useWalletStore()
    const globalStore = useGlobalConfigStore()

    // computed actinStack
    const actinStack = computed<{ label: string }[]>(() => {
      const stateArray = []
      stateArray.push({
        label: 'Connect Wallet'
      })

      if (walletStore.connected) {
        stateArray.push({
          label: 'Switch Network'
        })

        if (swapStore.tokenReady && (swapStore.sellAmount || 0) > 0) {
          stateArray.push({
            label: 'Insufficient Balance'
          })

          const amount = swapStore.tokens[0]
            ? formatUnits(
                BigNumber.from(swapStore.balanceStore[swapStore.tokens[0].address] || 0),
                swapStore.tokens[0].decimals
              )
            : 0
          if (amount >= (swapStore.sellAmount || 0)) {
            stateArray.push({
              label: 'Select a route'
            })

            if (props.routeResult) {
              stateArray.push({
                label: 'Approve'
              })

              if (swapStore.token0Allowance >= (swapStore.sellAmount || 0)) {
                stateArray.push({
                  label: 'Swap'
                })
              }
            }
          }
        }
      }
      return stateArray
    })

    watch(
      () => actinStack.value,
      stack => {
        swapStore.stateStack = stack
        if (swapStore.stateStack.length === 2) {
          const urlParams = useUrlSearchParams('history')
          if (urlParams.chain === walletStore.chainInfo?.name.toLowerCase()) {
            globalStore.btnLock = true
            swapStore.stateStack[swapStore.stateStack.length - 1].label = 'Swap'
          } else {
            globalStore.btnLock = false
            swapStore.stateStack[swapStore.stateStack.length - 1].label = 'Switch Network'
          }
        }
      }
    )

    const actionBtnFunc = {
      'Connect Wallet': () => {
        console.log('Connect Wallet')
        walletStore.web3modal?.openModal({
          route: 'ConnectWallet'
        })
      },
      'Switch Network': () => {
        walletStore.web3modal?.openModal({
          route: 'SelectNetwork'
        })
      },
      'Insufficient Balance': () => {
        console.log('Insufficient Balance')
        swapStore.sellAmount = swapStore.tokens[0]
          ? formatUnits(
              BigNumber.from(swapStore.balanceStore[swapStore.tokens[0].address] || 0),
              swapStore.tokens[0]?.decimals
            )
          : 0
      },
      Approve: () => {
        console.log('emit Approve')
        bus.emit('Approve', approveType.value)
      },
      Swap: () => {
        console.log('emit Swap')
        bus.emit('Swap')
      }
    }

    const tipRef = ref()
    const approveType = ref<1 | 2>(1)

    return {
      globalStore,
      swapStore,
      actinStack,
      actionBtnFunc,
      tipRef,
      approveType
    }
  },
  render() {
    const approveItemClass =
      'leading-5 rounded cursor-pointer p-2 pl-10 relative hover:bg-color-hover'
    const approveCurrentIconClass = 'h-5 text-primary top-3 left-3 w-5 absolute'

    return (
      <>
        <UButton
          class="rounded-sm  font-xl font-700 h-10 mt-5 text-center w-full transition-all leading-10 overflow-hidden"
          type="primary"
          loading={this.globalStore.btnLoading}
          disabled={this.globalStore.btnLock}
          onClick={() => {
            const label = this.actinStack[this.actinStack.length - 1].label
            label && (this.actionBtnFunc as any)[label] && (this.actionBtnFunc as any)[label]()
          }}
        >
          {this.actinStack[this.actinStack.length - 1].label}
          {this.swapStore.stateStack.length === 5 ? (
            <span class="ml-1">{this.routeResult.fromToken.symbol}</span>
          ) : null}
          {this.swapStore.stateStack.length === 5 ? (
            <UPopover
              ref={ref => (this.tipRef = ref)}
              trigger="hover"
              placement="bottom-end"
              showArrow={false}
              raw={true}
              v-slots={{
                trigger: () => (
                  <span class="bg-primary border-primary-bg border-l-1 px-3 px-2 right-0 leading-10 absolute">
                    <ArrowDownOutlined class="h-4 -mt-0.5 w-4 align-middle" />
                  </span>
                ),
                default: () => (
                  <ul class="rounded bg-bg2 text-xs p-2 text-color3 w-90">
                    <li class={approveItemClass} onClick={() => (this.approveType = 1)}>
                      {this.approveType === 1 ? (
                        <ConfirmOutlined class={approveCurrentIconClass} />
                      ) : null}
                      <div class="font-700 text-base text-color1">Approve One-time Only</div>
                      {`You will give your approval to spend ${this.swapStore.sellAmount} ${this.routeResult.fromToken.symbol} on your behalf`}
                    </li>
                    <li class={approveItemClass} onClick={() => (this.approveType = 2)}>
                      {this.approveType === 2 ? (
                        <ConfirmOutlined class={approveCurrentIconClass} />
                      ) : null}
                      <div class="font-700 text-base text-color1">Approve Unlimited Amount</div>
                      {`You won't need to approvve again next time you want to spend ${this.routeResult.fromToken.symbol}`}
                    </li>
                  </ul>
                )
              }}
            />
          ) : null}
        </UButton>
      </>
    )
  }
})
