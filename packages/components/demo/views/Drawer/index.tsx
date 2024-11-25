import { defineComponent, ref } from 'vue'
import { UButton } from '@/comps/UButton'
import { UDrawer } from '@/comps/UDrawer'

const DrawerDemoPage = defineComponent({
  name: 'DrawerDemoPage',
  setup() {
    const show = ref(false)
    return () => (
      <>
        <UButton onClick={() => (show.value = true)}>Open drawer</UButton>
        <UDrawer title="New startup" v-model:show={show.value}>
          <div class="h-screen">This is content</div>
        </UDrawer>
      </>
    )
  }
})

export default DrawerDemoPage
