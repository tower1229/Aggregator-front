import { NMessageProvider } from 'naive-ui'
import { defineComponent } from 'vue'

const UMessageProvider = defineComponent({
  name: 'UMessageProvider',
  setup(props, ctx) {
    return () => <NMessageProvider>{ctx.slots.default?.()}</NMessageProvider>
  }
})

export default UMessageProvider
