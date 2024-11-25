import { USkeleton } from '@aggregator/components'
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {}
  },
  render() {
    return (
      <div class="rounded-sm h-16 px-2">
        <div class="mb-2 overflow-hidden">
          <USkeleton class="h-5 w-[35%] float-left" />
          <USkeleton class="h-3 w-[35%] float-right" />
        </div>
        <div class="overflow-hidden">
          <USkeleton class="h-3 w-[25%] float-left" />
          <USkeleton class="h-3 w-[25%] float-right" />
        </div>
      </div>
    )
  }
})
