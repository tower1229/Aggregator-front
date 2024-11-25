import { UTooltip } from '@aggregator/components'
import { CopyOutlined, ShareOutlined } from '@aggregator/icons'
import { shortenAddress } from '@aggregator/utils'
import { useClipboard } from '@vueuse/core'
import { ethers } from 'ethers'
import { defineComponent, toRefs, ref, computed } from 'vue'
import type { PropType } from 'vue'
//
import './address.css'

export const UAddressProps = {
  prefixLength: {
    type: Number,
    default: 8
  },
  suffixLength: {
    type: Number,
    default: 10
  },
  autoSlice: {
    type: Boolean,
    default: true
  },
  address: {
    type: String,
    required: true
  },
  type: {
    type: String as PropType<'tx' | 'address'>,
    default: 'tx'
  },
  blockchainExplorerUrl: {
    type: String
  }
} as const

const UAddress = defineComponent({
  name: 'UAddress',
  props: UAddressProps,
  setup(props, { attrs }) {
    const showTooltipRef = ref<boolean>(false)

    const { address, autoSlice } = toRefs(props)

    const addressVal = computed(() => ethers.utils.getAddress(address.value))
    const { copy } = useClipboard()

    return {
      autoSlice,
      addressVal,
      showTooltipRef,
      copy
    }
  },
  render() {
    return this.addressVal ? (
      <div class="u-address">
        <span class="u-address__text">
          {this.autoSlice ? shortenAddress(this.addressVal) : this.addressVal}
        </span>

        <span
          class="u-address__icon"
          onClick={e => {
            e.stopPropagation()
            this.copy(this.addressVal)
            this.showTooltipRef = true
          }}
          onMouseleave={e => {
            e.stopPropagation()
            this.showTooltipRef = false
          }}
        >
          <UTooltip show={this.showTooltipRef}>
            {{
              trigger: () => <CopyOutlined class="h-4 w-4" />,
              default: () => 'Copied!'
            }}
          </UTooltip>
        </span>

        {this.blockchainExplorerUrl && (
          <a
            class="u-address__icon"
            target="_blank"
            href={`${this.blockchainExplorerUrl.replace(/\/$/, '')}/${this.addressVal}`}
          >
            <ShareOutlined class="h-4 w-4" />
          </a>
        )}
      </div>
    ) : null
  }
})

export default UAddress
