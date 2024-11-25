import { NProgress, ProgressProps } from 'naive-ui'
import { defineComponent } from 'vue'

export type UProgressPropsType = ProgressProps

const UProgress = defineComponent({
  name: 'UProgress',
  extends: NProgress,
  setup(props, ctx) {
    return () => <NProgress {...props} v-slots={ctx.slots} />
  }
})

export default UProgress
