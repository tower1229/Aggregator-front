import { defineComponent } from 'vue'
import { UButton, loadingBar } from '@/comps/index'

const LoadingBarDemoPage = defineComponent({
  name: 'LoadingBarDemoPage',
  setup() {
    return () => (
      <div class="space-x-2">
        <UButton onClick={loadingBar.start}>Start</UButton>
        <UButton onClick={loadingBar.finish}>Finish</UButton>
        <UButton onClick={loadingBar.error}>Error</UButton>
      </div>
    )
  }
})

export default LoadingBarDemoPage
