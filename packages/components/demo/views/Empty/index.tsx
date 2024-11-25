import { defineComponent } from 'vue'
import { UEmpty } from '@/comps/index'

const EmptyDemoPage = defineComponent({
  name: 'EmptyDemoPage',
  setup() {
    return () => <UEmpty />
  }
})

export default EmptyDemoPage
