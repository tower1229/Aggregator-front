import type { ScrollbarProps } from 'naive-ui'
import { NScrollbar } from 'naive-ui'
import { defineComponent } from 'vue'

export type UScrollbarPropsType = ScrollbarProps

const UScrollbar = defineComponent({
  name: 'UScrollbar',
  extends: NScrollbar,
  setup(props, ctx) {
    return () => <NScrollbar {...props} v-slots={ctx.slots} />
  }
})

export default UScrollbar
