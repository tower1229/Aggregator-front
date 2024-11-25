import type { DropdownProps } from 'naive-ui'
import { NDropdown } from 'naive-ui'
import { defineComponent } from 'vue'

export type UDropdownPropsType = DropdownProps

const UDropdown = defineComponent({
  name: 'UDropdown',
  extends: NDropdown,
  inheritAttrs: true,
  setup(props, ctx) {
    return () => <NDropdown {...props} v-slots={ctx.slots} />
  }
})

export default UDropdown
