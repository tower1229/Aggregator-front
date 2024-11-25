import { UImage, UInput } from '@aggregator/components'
import { SearchOutlined, CloseOutlined } from '@aggregator/icons'
import { defineComponent, PropType, ref, computed } from 'vue'
import { RecycleScroller } from 'vue-virtual-scroller'
import { formatCurrency } from '@/utils/number'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { tokenLogoUrl } from '@/utils/static'

export type TokenItemType = {
  mcap?: number | null
  address: string
  chainId: number
  name: string
  symbol: string
  logoURI?: string
  decimals: number
  geckoId?: string | null
  coingeckoPlatformId?: string
}

export default defineComponent({
  name: 'TokenSelect',
  emits: ['update', 'close'],
  props: {
    tokens: {
      type: Array as PropType<TokenItemType[]>
    },
    spinAddress: {
      type: Array as PropType<string[]>
    },
    filterContracts: {
      type: Array as PropType<string[]>
    },
    chooseToken: {
      type: String
    }
  },
  setup(props, ctx) {
    const searchKeywords = ref('')

    const onChooseToken = (token: any) => {
      ctx.emit('update', token)
    }

    const finnalOptions = computed<TokenItemType[]>(() => {
      if (searchKeywords.value.length && props.tokens) {
        const pattern = new RegExp(searchKeywords.value.toLowerCase())
        return props.tokens.filter(
          opt =>
            (pattern.test(opt.name.toLowerCase()) ||
              pattern.test(opt.symbol.toLowerCase()) ||
              pattern.test(opt.address.toLowerCase())) &&
            (!Array.isArray(props.filterContracts) ||
              props.filterContracts.indexOf(opt.address) === -1)
        )
      } else {
        return (props.tokens || []).filter(
          opt =>
            !Array.isArray(props.filterContracts) ||
            props.filterContracts.indexOf(opt.address) === -1
        )
      }
    })

    const spinTokens = computed(() =>
      props.tokens?.filter(
        item => item.address && (props.spinAddress || []).indexOf(item.address) !== -1
      )
    )

    return {
      searchKeywords,
      onChooseToken,
      finnalOptions,
      spinTokens
    }
  },
  render() {
    return (
      <div class="flex flex-col h-full">
        <div class="flex p-4 items-center">
          <UInput
            size="large"
            clearable
            placeholder="Search name or contract address"
            v-slots={{
              prefix: () => <SearchOutlined class="h-4 w-4" />
            }}
            value={this.searchKeywords}
            on-update:value={(value: string) => (this.searchKeywords = value.trim())}
          />
          <CloseOutlined
            class="cursor-pointer h-6 ml-2 text-color2 w-6 hover:text-color1"
            onClick={() => this.$emit('close')}
          />
        </div>
        {this.spinTokens && (
          <div class="flex flex-wrap mb-4 px-4 gap-3">
            {this.spinTokens.map(item => (
              <div
                class="border-color-border cursor-pointer flex border-1 h-8 px-4 gap-2 items-center hover:border-primary hover:text-primary"
                onClick={() => this.onChooseToken(item)}
              >
                <UImage
                  src={tokenLogoUrl(item.logoURI)}
                  class="rounded-full h-5 w-5"
                  preview-disabled
                />
                {item.symbol}
              </div>
            ))}
          </div>
        )}
        <RecycleScroller
          class="border-color-border border-t-1 flex-1 py-2 scroller overflow-y-auto overflow-x-hidden"
          items={this.finnalOptions}
          item-size={58}
          key-field="address"
          v-slots={{
            default: (data: any) => {
              const { item } = data
              return (
                <li
                  class={
                    'cursor-pointer flex py-2 px-4 items-center hover:bg-color-hover' +
                    (this.chooseToken === item.address ? ' bg-color-hover' : '')
                  }
                  onClick={() => this.onChooseToken(item)}
                >
                  <UImage
                    src={tokenLogoUrl(item.logoURI)}
                    class="rounded-full bg-bg2 h-9 w-9"
                    preview-disabled
                  />
                  <div class="flex-1 text-base px-3 leading-6">
                    {item.name}
                    <div class="text-xs text-color3">{item.symbol}</div>
                  </div>
                  <div class="max-w-[50%] overflow-hidden">
                    {item.balance ? (
                      <>
                        {formatCurrency(item.balance, 4)}
                        <span class="text-xs">
                          (≈${formatCurrency(item.balance * item.price, 4)})
                        </span>
                      </>
                    ) : null}
                  </div>
                </li>
              )
            }
          }}
        ></RecycleScroller>
      </div>
    )
  }
})
