import { UForm, UFormItem, UInputNumber, UImage } from '@aggregator/components'
import { ArrowLineRightOutlined, ArrowDownOutlined } from '@aggregator/icons'
import { defineComponent, ref, computed } from 'vue'
import { default as TokenSelect, TokenItemType } from '@/components/TokenSelect'
import { useSwapStore } from '@/stores'
import { formatUnits, formatCurrencyToJSX, formatCurrencyWithUnit } from '@/utils/number'
import { tokenLogoUrl } from '@/utils/static'

export default defineComponent({
  name: 'SwapForm',
  emits: ['pick', 'reverse'],
  setup(props, ctx) {
    const swapStore = useSwapStore()

    const showSelect = ref<0 | 1 | 2>(0)

    const handleChooseToken = (token: TokenItemType) => {
      ctx.emit('pick', showSelect.value, token)
      showSelect.value = 0
    }

    const filterContract = computed(() =>
      showSelect.value === 1
        ? swapStore.tokens[1]?.address
        : showSelect.value === 2
        ? swapStore.tokens[0]?.address
        : undefined
    )

    const token0Balance = computed(() => {
      if (swapStore.tokens[0]) {
        if (swapStore.balanceStore[swapStore.tokens[0].address]) {
          return formatUnits(
            swapStore.balanceStore[swapStore.tokens[0].address],
            Number(swapStore.tokens[0]?.decimals)
          )
        } else {
          return 0
        }
      } else {
        return 0
      }
    })

    const quickSetter = ref([
      {
        label: '25%',
        percent: 25
      },
      {
        label: '50%',
        percent: 50
      },
      {
        label: '75%',
        percent: 75
      },
      {
        label: 'MAX',
        percent: 100
      }
    ])

    return {
      swapStore,
      showSelect,
      handleChooseToken,
      filterContract,
      quickSetter,
      token0Balance
    }
  },
  render() {
    return (
      <>
        <UForm>
          <UFormItem
            labelStyle={{
              display: 'block'
            }}
            class="border-color-border rounded-sm border-1 mb-12"
            showFeedback={
              !!this.swapStore.priceStore['0x0000000000000000000000000000000000000000'] &&
              !!this.swapStore.sellAmount
            }
            v-slots={{
              label: () => {
                return (
                  <div class="flex text-xs px-2 pt-2 items-center">
                    <div class="flex-1 text-color3">
                      Balance: {formatCurrencyToJSX(this.token0Balance, 4)}
                    </div>
                    {this.swapStore.tokens[0] && this.token0Balance ? (
                      <>
                        {this.quickSetter.map(setter => (
                          <div
                            class="border-color-border rounded-sm cursor-pointer border-1 h-4 mr-1.5 text-xs px-1.5 text-color3 leading-4 select-none hover:text-color1"
                            onClick={() => {
                              this.swapStore.sellAmount =
                                (this.token0Balance * setter.percent) / 100
                            }}
                          >
                            {setter.label}
                          </div>
                        ))}
                      </>
                    ) : null}
                  </div>
                )
              },
              default: () => {
                return (
                  <div class="flex flex-1 h-13 px-2 gap-2 items-center">
                    <div
                      class="rounded-sm cursor-pointer flex h-10 px-2 items-center hover:bg-color-hover"
                      onClick={() => (this.showSelect = 1)}
                    >
                      <UImage
                        class="rounded-full bg-bg1 h-5 w-5 overflow-hidden"
                        src={tokenLogoUrl(this.swapStore.tokens[0]?.logoURI)}
                        preview-disabled
                      />
                      <div class="font-xl font-700 px-2">
                        {this.swapStore.tokens[0]?.symbol || 'Select token'}
                      </div>
                      <ArrowDownOutlined class="h-4 text-color2 w-4" />
                    </div>
                    <UInputNumber
                      class="flex-1 h-10 text-right translateInput weightInput"
                      size="large"
                      value={this.swapStore.sellAmount}
                      show-button={false}
                      min={0}
                      placeholder="0.0"
                      onUpdate:value={value => (this.swapStore.sellAmount = value || 0)}
                    />
                  </div>
                )
              },
              feedback: () => {
                return this.swapStore.tokens[0]?.address &&
                  this.swapStore.priceStore[this.swapStore.tokens[0]?.address] &&
                  this.swapStore.sellAmount ? (
                  <div class="-mt-2 text-xs px-4 float-right">
                    {formatCurrencyWithUnit(
                      this.swapStore.priceStore[this.swapStore.tokens[0]?.address] *
                        this.swapStore.sellAmount
                    )}
                  </div>
                ) : null
              }
            }}
          ></UFormItem>
          <UFormItem
            labelStyle={{
              position: 'relative',
              display: 'block'
            }}
            v-slots={{
              label: () => {
                return (
                  <>
                    {/* <div class="flex text-xs items-center">
                      <div class="flex-1 text-color3">To</div>
                      {this.swapStore.tokens[1] &&
                      this.swapStore.getTokenByAddress(this.swapStore.tokens[1].address) ? (
                        <div class="text-color1">
                          Balance:
                          {formatCurrencyToJSX(
                            formatUnits(
                              this.swapStore.getTokenByAddress(this.swapStore.tokens[1].address)
                                ?.amount,
                              Number(this.swapStore.tokens[1].decimals)
                            ),
                            4
                          )}
                        </div>
                      ) : null}
                    </div> */}
                    <div
                      class="border-color-border rounded-full cursor-pointer bg-[#1e2025] border-1 h-6 transform transition-all -top-6 left-[50%] text-color1 w-6 rotate-90 -translate-x-2 absolute hover:rotate-270"
                      onClick={() => this.$emit('reverse')}
                    >
                      <ArrowLineRightOutlined class="h-full w-full transform scale-50" />
                    </div>
                  </>
                )
              },
              default: () => {
                return (
                  <div
                    class="border-color-border rounded-sm flex border-1 flex-1 h-13 px-2 gap-2 items-center"
                    onClick={() => (this.showSelect = 2)}
                  >
                    <div class="rounded-sm cursor-pointer flex flex-1 h-10 px-2 items-center hover:bg-color-hover">
                      <UImage
                        class="rounded-full bg-bg1 h-5 w-5 overflow-hidden"
                        src={tokenLogoUrl(this.swapStore.tokens[1]?.logoURI)}
                        preview-disabled
                      />
                      <div class="font-xl flex-1 font-700 px-2">
                        {this.swapStore.tokens[1]?.symbol || 'Select token'}
                      </div>
                      <ArrowDownOutlined class="h-4 text-color2 w-4" />
                    </div>
                  </div>
                )
              }
            }}
          ></UFormItem>
        </UForm>
        {this.showSelect > 0 ? (
          <div class="h-full bg-bg2 w-full top-0 left-0 z-2 absolute">
            <TokenSelect
              filterContracts={this.filterContract ? [this.filterContract] : []}
              tokens={this.swapStore.list}
              spinAddress={this.swapStore.spinAddress}
              chooseToken={this.swapStore.tokens[this.showSelect - 1]?.address}
              onUpdate={this.handleChooseToken}
              onClose={() => (this.showSelect = 0)}
            />
          </div>
        ) : null}
      </>
    )
  }
})
