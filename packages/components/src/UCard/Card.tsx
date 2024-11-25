import type { CardProps } from 'naive-ui'
import { NCard } from 'naive-ui'
import { defineComponent } from 'vue'
import './index.css'

export type UCardPropsType = CardProps

const UCard = defineComponent({
  name: 'UCard',
  extends: NCard,
  setup(props, ctx) {
    return () => <NCard {...props} class="u-card" v-slots={ctx.slots} />
  }
})

export default UCard
