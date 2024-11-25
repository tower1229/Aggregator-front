import { NDialogProvider } from 'naive-ui'
import { defineComponent } from 'vue'

const UModalProvider = defineComponent({
  name: 'UModalProvider',
  setup(props, ctx) {
    return () => <NDialogProvider>{ctx.slots.default?.()}</NDialogProvider>
  }
})

export default UModalProvider
