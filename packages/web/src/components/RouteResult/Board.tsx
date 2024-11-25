import { shortenAddress } from '@aggregator/utils'
import { defineComponent, PropType, ref } from 'vue'
import { useSwapStore, useGlobalConfigStore, useWalletStore } from '@/stores'
import { formatCurrency, fixFloat2, formatCurrencyWithUnit } from '@/utils/number'

export default defineComponent({
  name: 'OnChainBoard',
  props: {
    routeResult: {
      type: Object as PropType<any>
    },
    output: {
      type: Object as PropType<any>
    }
  },
  setup(props, ctx) {
    const swapStore = useSwapStore()
    const globalStore = useGlobalConfigStore()
    const walletStore = useWalletStore()
    const showDetail = ref(false)

    return {
      globalStore,
      swapStore,
      showDetail,
      walletStore
    }
  },
  render() {
    return (
      <>
        {this.output ? (
          <div
            class={
              'border-color-border border-t-1 text-xs text-color2 ' + (this.$attrs.class || '')
            }
          >
            <div class="p-4 leading-6">
              <div class="flex mb-2 items-center">
                <div class="flex-1 text-color3">Routing source</div>
                <div>{this.routeResult.dex.name}</div>
              </div>
              <div class="flex mb-2 items-center">
                <div class="flex-1 text-color3">Rate</div>
                <div>{`1 ${this.routeResult.fromToken?.symbol} = ${formatCurrency(
                  this.output.toTokenAmount / this.output.fromTokenAmount,
                  4
                )} ${this.routeResult.toToken.symbol}`}</div>
              </div>
              <div class="flex mb-2 items-center">
                <div class="flex-1 text-color3">Est. received</div>
                <div>{`${formatCurrency(this.output.toTokenAmount, 4)} ${
                  this.routeResult.toToken.symbol
                }`}</div>
              </div>
              <div class="flex mb-2 items-center">
                <div class="flex-1 text-color3">Mininum received after slippage</div>
                <div>{`${this.output.toTokenAmountAfter} ${this.routeResult.toToken.symbol}`}</div>
              </div>
              <div class="flex mb-2 items-center">
                <div class="flex-1 text-color3">Price Impact</div>
                <div>{fixFloat2(this.output.priceImpact)}%</div>
              </div>
              <div class="flex mb-2 items-center">
                <div class="flex-1 text-color3">Network Fees</div>
                <div>{formatCurrencyWithUnit(this.output.estimatedGasUSD)}</div>
              </div>
              <div class="flex mb-2 items-center">
                <div class="flex-1 text-color3">Network</div>
                <div>{this.walletStore.chainInfo?.name}</div>
              </div>
              <div class="border-color-border flex border-t-1 mt-4 mb-2 pt-4 items-center">
                <div class="flex-1 text-color3">Recipient</div>
                {this.walletStore.address ? (
                  <strong title={this.walletStore.address}>
                    {shortenAddress(this.walletStore.address)}
                  </strong>
                ) : (
                  '~'
                )}
              </div>
            </div>
          </div>
        ) : null}
      </>
    )
  }
})
