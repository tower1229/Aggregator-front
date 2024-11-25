import type { InputGroupProps } from 'naive-ui'
import { NInputGroup } from 'naive-ui'
import { defineComponent } from 'vue'

export type UInputGroupPropsType = InputGroupProps

const UInputGroup = defineComponent({
  name: 'UInputGroup',
  extends: NInputGroup,
  setup(props, ctx) {
    return () => {
      return <NInputGroup {...props} v-slots={ctx.slots} />
    }
  }
})

export default UInputGroup
