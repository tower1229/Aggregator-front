import type { SelectProps, SelectOption } from 'naive-ui'
import { NSelect } from 'naive-ui'
import { defineComponent } from 'vue'

export type USelectPropsType = SelectProps
export type USelectOption = SelectOption

const USelect = defineComponent({
  name: 'USelect',
  inheritAttrs: true,
  extends: NSelect,
  setup(props, ctx) {
    return () => <NSelect {...props} v-slots={ctx.slots} />
  }
})

export default USelect
