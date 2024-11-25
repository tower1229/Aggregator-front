import { ClearOutlined, WalletOutlined } from '@aggregator/icons'
import { isValidAddress } from '@aggregator/utils'
import { computed, defineComponent, PropType, ref } from 'vue'
import { UInput } from '../UInput'
import type { ExtractPropTypes } from '../utils'
import './UAddressInput.css'

export const UAddressInputProps = {
  value: {
    type: String
  },
  placeholder: {
    type: String,
    default: 'Public address'
  },
  onChange: {
    type: Function as PropType<(v: string) => void>
  },
  noIcon: {
    type: Boolean,
    default: false
  }
} as const

export type UAddressInputPropsType = ExtractPropTypes<typeof UAddressInputProps>

const UAddressInput = defineComponent({
  name: 'UAddressInput',
  props: UAddressInputProps,
  emits: ['update:value'],
  setup(props, ctx) {
    const disabled = ref(false)
    const status = ref<'success' | 'warning' | 'error' | undefined>(undefined)
    const showValue = computed(() => {
      const v = props.value
      return disabled.value && v && isValidAddress(v)
        ? `${v.substring(0, 8)}...${v.substring(v.length - 10)}`
        : v
    })
    const onInput = (v: string) => {
      ctx.emit('update:value', v)
      if (isValidAddress(v)) {
        disabled.value = true
        props.onChange?.(v)
      }
    }
    const onBlur = () => {
      if (props.value && !isValidAddress(props.value)) {
        status.value = 'error'
      } else {
        status.value = undefined
      }
    }
    const reset = () => {
      disabled.value = false
      ctx.emit('update:value', '')
    }
    return () => (
      <UInput
        type="text"
        placeholder={props.placeholder}
        disabled={disabled.value}
        value={showValue.value}
        status={status.value}
        onInput={onInput}
        onBlur={onBlur}
      >
        {{
          prefix: () => (props.noIcon ? null : <WalletOutlined class="u-address-input__icon" />),
          suffix: () =>
            disabled.value ? <ClearOutlined class="u-address-input__close" onClick={reset} /> : null
        }}
      </UInput>
    )
  }
})

export default UAddressInput
