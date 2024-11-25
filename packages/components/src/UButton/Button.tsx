import { NButton } from 'naive-ui'
import type { ButtonProps } from 'naive-ui'
import { defineComponent } from 'vue'

export type UButtonPropsType = ButtonProps

const UButton = defineComponent({
  extends: NButton,
  setup(props, { slots }) {
    return () => <NButton {...props} v-slots={slots} />
  }
})

export default UButton
