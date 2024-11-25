import { NUploadDragger } from 'naive-ui'
import { defineComponent } from 'vue'

const UUploadDragger = defineComponent({
  name: 'UUploadDragger',
  extends: NUploadDragger,
  setup(props, ctx) {
    return () => <NUploadDragger {...props} v-slots={ctx.slots} />
  }
})

export default UUploadDragger
