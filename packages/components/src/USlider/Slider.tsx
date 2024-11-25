import type { SliderProps } from 'naive-ui'
import { NSlider } from 'naive-ui'
import { defineComponent } from 'vue'

export type USliderPropsType = SliderProps

const USlider = defineComponent({
  name: 'USlider',
  extends: NSlider,
  setup(props, ctx) {
    return () => <NSlider {...props} v-slots={ctx.slots} />
  }
})

export default USlider
