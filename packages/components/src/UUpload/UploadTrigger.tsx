import { NUploadTrigger } from 'naive-ui'
import { defineComponent } from 'vue'

const UUploadTrigger = defineComponent({
  name: 'UUploadTrigger',
  extends: NUploadTrigger,
  setup(props, ctx) {
    return () => <NUploadTrigger {...props} v-slots={ctx.slots} />
  }
})

export default UUploadTrigger
