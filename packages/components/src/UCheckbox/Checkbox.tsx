import type { CheckboxProps } from 'naive-ui'
import { NCheckbox } from 'naive-ui'
import { defineComponent } from 'vue'

export type UCheckboxPropsType = CheckboxProps

const UCheckbox = defineComponent({
  name: 'UCheckbox',
  extends: NCheckbox,
  setup(props, ctx) {
    return () => <NCheckbox {...props} v-slots={ctx.slots} />
  }
})

export default UCheckbox
