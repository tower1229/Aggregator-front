import { defineComponent } from 'vue'
import { ULazyImage } from '@/comps/index'

const LazyImageDemoPage = defineComponent({
  name: 'LazyImageDemoPage',
  setup() {
    return () => (
      <ULazyImage
        class="rounded-full h-10 w-10"
        alt="xx"
        src="https://images.pexels.com/photos/842711/pexels-photo-842711.jpeg?auto=compress&cs=tinysrgb&w=1600"
      />
    )
  }
})

export default LazyImageDemoPage
