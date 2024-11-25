import { RouteOutlined, GasOutlined } from '@aggregator/icons'
import { defineComponent, PropType } from 'vue'
import Skeleton from './Skeleton'
import Loading from '@/components/Loading'
import { routeResultType } from '@/hooks'
import { formatUnits, formatCurrency, formatCurrencyWithUnit, fixFloat2 } from '@/utils/number'

type extendType = {
  priceUSD?: number
  estimatedGasUSD?: number
  finnalGet?: number
}

export default defineComponent({
  name: 'Routes',
  emits: ['choose'],
  props: {
    resultList: {
      type: Array as PropType<((routeResultType & extendType) | null)[]>,
      required: true
    },
    chooseDexName: {
      type: String
    }
  },
  render() {
    return (
      <div class={'border-color-border border-t-1 px-4 ' + (this.$attrs.class || '')}>
        <div class="py-4">
          <strong class="text-sm">Select a Best Route for your swaps</strong>
          <div class="text-xs text-color3">Fetch the best price for your cross-chain swaps</div>
        </div>
        {this.resultList?.length ? (
          <ul>
            {this.resultList.map((item, index) =>
              item ? (
                <li
                  class={
                    'rounded-sm cursor-pointer border-1 mb-3 py-3 px-4 transition-all hover:border-color2 ' +
                    (this.chooseDexName === item.dex.name
                      ? 'border-success'
                      : 'border-color-border')
                  }
                  onClick={() => this.$emit('choose', item)}
                >
                  <div class="flex mb-1 items-center">
                    <div class="flex-1">
                      <strong class="text-lg mr-1">
                        {formatCurrency(formatUnits(item.toTokenAmount, item.toToken.decimals), 4)}
                      </strong>
                      {item.toToken.symbol}
                    </div>
                    <GasOutlined class="h-4 mr-1 text-color1 w-4" />
                    <div class="text-color1">
                      {item.estimatedGasUSD
                        ? formatCurrencyWithUnit(item.estimatedGasUSD)
                        : 'loading'}
                    </div>
                    {/* item.priceUSD * formatUnits(item.toTokenAmount, item.toToken.decimals) */}
                  </div>
                  <div class="flex text-xs text-color2 items-center">
                    <RouteOutlined class="h-3 w-3" />
                    <span class="ml-0.5">{item.dex.name}</span>
                    <div class="flex-1">
                      {index === 0 && item.estimatedGasUSD ? (
                        <span class="font-700 text-success px-2">BEST</span>
                      ) : this.resultList &&
                        this.resultList[0] &&
                        this.resultList[0].finnalGet &&
                        item.finnalGet ? (
                        <span class="text-error px-2">
                          {fixFloat2(
                            ((item.finnalGet - this.resultList[0].finnalGet) /
                              Math.abs(this.resultList[0].finnalGet)) *
                              100
                          )}
                          %
                        </span>
                      ) : null}
                    </div>
                    <div>
                      Est. get ≈
                      {item.finnalGet ? formatCurrencyWithUnit(item.finnalGet) : 'loading'}
                    </div>
                  </div>
                </li>
              ) : (
                <Skeleton />
              )
            )}
          </ul>
        ) : (
          <Loading />
        )}
      </div>
    )
  }
})
