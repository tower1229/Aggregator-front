import type { ModalProps } from 'naive-ui'
import { NModal } from 'naive-ui'
import { defineComponent } from 'vue'

export type UModalPropsType = ModalProps

const UModal = defineComponent({
  name: 'UModal',
  extends: NModal,
  inheritAttrs: true,
  setup(props, ctx) {
    return () => <NModal {...props} class="u-modal" v-slots={ctx.slots} />
  }
})

export default UModal
