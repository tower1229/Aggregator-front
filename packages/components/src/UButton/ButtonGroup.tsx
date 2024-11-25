import type { ButtonGroupProps } from 'naive-ui'
import { NButtonGroup } from 'naive-ui'
import { defineComponent } from 'vue'

export type UButtonGroupPropsType = ButtonGroupProps

const UButtonGroup = defineComponent({
  name: 'UButtonGroup',
  extends: NButtonGroup,
  setup(props, ctx) {
    return () => <NButtonGroup {...props} v-slots={ctx.slots} />
  }
})

export default UButtonGroup
