import type { ImageProps } from 'naive-ui'
import { NImage } from 'naive-ui'
import { defineComponent } from 'vue'

export type UImagePropsType = ImageProps

const UImage = defineComponent({
  name: 'UImage',
  extends: NImage,
  inheritAttrs: true,
  setup(props, ctx) {
    return () => <NImage {...props} v-slots={ctx.slots} />
  }
})

export default UImage
