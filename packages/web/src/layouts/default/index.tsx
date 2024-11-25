import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'

const DefaultLayout = defineComponent({
  name: 'DefaultLayout',
  setup() {
    return () => <RouterView class="homePage" />
  }
})

export default DefaultLayout
