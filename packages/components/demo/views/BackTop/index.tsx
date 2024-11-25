import { defineComponent } from 'vue'
import { UBackTop } from '@/comps/index'

const BackTopDemoPage = defineComponent({
  name: 'BackTopDemoPage',
  setup() {
    return () => (
      <div class="h-[2000px]">
        <UBackTop />
      </div>
    )
  }
})

export default BackTopDemoPage
