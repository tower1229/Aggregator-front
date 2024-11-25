import { defineComponent } from 'vue'
import { useGlobalConfigStore } from '@/stores'

const WalletAddress = defineComponent({
  name: 'HeaderAddress',
  setup() {
    const globalConfigStore = useGlobalConfigStore()

    return {
      globalConfigStore
    }
  },
  render() {
    return this.globalConfigStore ? (
      <>
        <w3m-network-switch
          class="bg-body-color border-color-border rounded-sm border-1 -mx-4 transform scale-80 <lg:ml-auto <lg:-mr-12 <lg:scale-70"
          style={{
            '--w3m-color-fg-inverse': this.globalConfigStore.themeColors.color1,
            '--w3m-color-fg-accent': this.globalConfigStore.themeColors.bodyColor,
            '--w3m-color-bg-3': this.globalConfigStore.themeColors.primaryColor,
            '--w3m-color-overlay': 'transparent'
          }}
        ></w3m-network-switch>
        <w3m-core-button
          icon="hide"
          class="bg-body-color border-color-border rounded-sm border-1 -mx-4 transform scale-80 <lg:ml-auto <lg:-mr-6 <lg:scale-70"
          style={{
            '--w3m-color-fg-inverse': this.globalConfigStore.themeColors.color1,
            '--w3m-color-fg-accent': this.globalConfigStore.themeColors.bodyColor,
            '--w3m-color-bg-3': this.globalConfigStore.themeColors.primaryColor,
            '--w3m-color-overlay': 'transparent'
          }}
        ></w3m-core-button>
      </>
    ) : null
  }
})

export default WalletAddress
