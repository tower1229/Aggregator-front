import type { EmptyProps } from 'naive-ui'
import { NEmpty } from 'naive-ui'
import { defineComponent } from 'vue'

export type UEmptyPropsType = EmptyProps

const UEmpty = defineComponent({
  name: 'UEmpty',
  extends: NEmpty,
  setup(props, ctx) {
    return () => <NEmpty {...props}>{ctx.slots.default?.()}</NEmpty>
  }
})

export default UEmpty
