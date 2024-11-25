import type { PopconfirmProps } from 'naive-ui'
import { NPopconfirm } from 'naive-ui'
import { defineComponent } from 'vue'

export type UPopconfirmPropsType = PopconfirmProps

const UPopconfirm = defineComponent({
  name: 'UPopconfirm',
  extends: NPopconfirm,
  setup(props, ctx) {
    return () => <NPopconfirm {...props} v-slots={ctx.slots} />
  }
})

export default UPopconfirm
