import { UForm, UFormItem, UInputNumber } from '@aggregator/components'
import { CloseOutlined, SlipOutlined, SpeedOutlined, DeadlineOutlined } from '@aggregator/icons'
import { defineComponent, ref } from 'vue'
import { useGlobalConfigStore } from '@/stores'

export default defineComponent({
  name: 'Setting',
  emits: ['update', 'close'],
  setup(props, ctx) {
    const globalStore = useGlobalConfigStore()

    const quickSlip = ref([
      {
        value: 0.1
      },
      {
        value: 0.5
      },
      {
        value: 1
      },
      {
        value: 2
      }
    ])

    const speedMap = ref<('Normal' | 'Fast' | 'Instant')[]>(['Normal', 'Fast', 'Instant'])

    return {
      globalStore,
      quickSlip,
      speedMap
    }
  },
  render() {
    const contHeadClass = 'h-6 flex items-center'

    return (
      <div class="flex flex-col h-full p-4 select-none">
        <div class={contHeadClass + ' mb-6'}>
          <strong class="flex-1 text-lg">Setting</strong>
          <CloseOutlined
            class="cursor-pointer h-5 text-color2 w-5 hover:text-color1"
            onClick={() => this.$emit('close')}
          />
        </div>
        <div class="flex-1 overflow-y-auto overflow-x-hidden">
          <UForm>
            <UFormItem
              v-slots={{
                label: () => {
                  return (
                    <div class="flex text-xs text-color3 items-center">
                      <SlipOutlined class="h-4 mr-2 w-4" />
                      Slippage tolerance
                    </div>
                  )
                },
                default: () => {
                  return (
                    <div class="border-color-border rounded-sm flex border-1 flex-1 h-11 px-1 gap-2 items-center">
                      <UInputNumber
                        class="flex-1 text-right translateInput"
                        value={this.globalStore.swapSetting.slippage}
                        min={0}
                        precision={2}
                        onUpdate:value={value =>
                          (this.globalStore.swapSetting.slippage = value || 0)
                        }
                        show-button={false}
                        v-slots={{
                          suffix: () => '%'
                        }}
                      />
                      {this.quickSlip.map(item => (
                        <div
                          class={
                            'border-color-border cursor-pointer border-1 h-8 px-4 leading-8 rounded-sm' +
                            (this.globalStore.swapSetting.slippage === item.value
                              ? ' bg-primary text-white'
                              : ' hover:bg-color-hover')
                          }
                          onClick={() => (this.globalStore.swapSetting.slippage = item.value)}
                        >
                          {item.value}%
                        </div>
                      ))}
                    </div>
                  )
                }
              }}
            ></UFormItem>
            <UFormItem
              labelStyle={{
                position: 'relative'
              }}
              v-slots={{
                label: () => {
                  return (
                    <div class="flex text-xs text-color3 items-center">
                      <SpeedOutlined class="h-4 mr-2 w-4" />
                      Transaction speed
                    </div>
                  )
                },
                default: () => {
                  return (
                    <div class="flex gap-2">
                      {this.speedMap.map(item => (
                        <div
                          class={
                            'border-color-border cursor-pointer border-1 h-8 px-4 leading-8 rounded-sm' +
                            (this.globalStore.swapSetting.speed === item
                              ? ' bg-primary text-white'
                              : ' hover:bg-color-hover')
                          }
                          onClick={() => (this.globalStore.swapSetting.speed = item)}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )
                }
              }}
            ></UFormItem>
            <UFormItem
              labelStyle={{
                position: 'relative'
              }}
              v-slots={{
                label: () => {
                  return (
                    <div class="flex text-xs text-color3 items-center">
                      <DeadlineOutlined class="h-4 mr-2 w-4" />
                      Transaction deadline
                    </div>
                  )
                },
                default: () => {
                  return (
                    <div class="border-color-border rounded-sm flex border-1 flex-1 h-11 px-1 gap-2 items-center">
                      <UInputNumber
                        class="flex-1 translateInput"
                        value={this.globalStore.swapSetting.deadline}
                        min={0}
                        onUpdate:value={value =>
                          (this.globalStore.swapSetting.deadline = value || 0)
                        }
                        v-slots={{
                          suffix: () => 'Minutes'
                        }}
                      />
                    </div>
                  )
                }
              }}
            ></UFormItem>
          </UForm>
        </div>
      </div>
    )
  }
})
