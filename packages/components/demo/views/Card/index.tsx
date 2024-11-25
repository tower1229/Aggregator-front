import { defineComponent } from 'vue'
import { UCard } from '@/comps/index'

const CardDemoPage = defineComponent({
  name: 'CardDemoPage',
  setup() {
    return () => (
      <UCard title="Title">
        {{
          default: () => `Card content`,
          cover: () => (
            <img class="!w-10" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
          )
        }}
      </UCard>
    )
  }
})

export default CardDemoPage
