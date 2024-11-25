import { NLoadingBarProvider } from 'naive-ui'
import { defineComponent } from 'vue'

const ULoadingBarProvider = defineComponent({
  name: 'ULoadingBarProvider',
  setup(props, ctx) {
    return () => <NLoadingBarProvider>{ctx.slots.default?.()}</NLoadingBarProvider>
  }
})

export default ULoadingBarProvider
