import type { CheckboxGroupProps } from 'naive-ui'
import { NCheckboxGroup } from 'naive-ui'
import { defineComponent } from 'vue'

export type UCheckboxGroupPropsType = CheckboxGroupProps

const UCheckboxGroup = defineComponent({
  name: 'UCheckboxGroup',
  extends: NCheckboxGroup,
  setup(props, ctx) {
    return () => <NCheckboxGroup {...props} v-slots={ctx.slots} />
  }
})

export default UCheckboxGroup
