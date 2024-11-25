import { NNotificationProvider } from 'naive-ui'
import { defineComponent } from 'vue'

const UNotificationProvider = defineComponent({
  name: 'UNotificationProvider',
  setup(props, ctx) {
    return () => <NNotificationProvider>{ctx.slots.default?.()}</NNotificationProvider>
  }
})

export default UNotificationProvider
