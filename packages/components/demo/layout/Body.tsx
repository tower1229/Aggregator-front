import { defineComponent } from 'vue'

import { RouterView } from 'vue-router'

export default defineComponent({
  setup() {
    return () => {
      return (
        <div class="h-full bg-[#e5e5e5] p-4">
          <RouterView></RouterView>
        </div>
      )
    }
  }
})
