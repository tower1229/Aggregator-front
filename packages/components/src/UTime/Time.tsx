import type { TimeProps } from 'naive-ui'
import { NTime } from 'naive-ui'
import { defineComponent } from 'vue'

export type UTimePropsType = TimeProps

const UTime = defineComponent({
  name: 'UTime',
  extends: NTime,
  setup(props, ctx) {
    return () => <NTime {...props} v-slots={ctx.slots} />
  }
})

export default UTime
