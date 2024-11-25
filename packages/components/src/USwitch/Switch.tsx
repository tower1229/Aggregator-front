import type { SwitchProps } from 'naive-ui'
import { NSwitch } from 'naive-ui'
import { defineComponent } from 'vue'

export type USwitchPropsType = SwitchProps

const USwitch = defineComponent({
  name: 'USwitch',
  extends: NSwitch,
  setup(props, ctx) {
    return () => <NSwitch {...props} v-slots={ctx.slots} />
  }
})

export default USwitch
