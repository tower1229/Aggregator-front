import * as icons from '@aggregator/icons'
import { defineComponent } from 'vue'

const IconsDemoPage = defineComponent({
  name: 'IconsDemoPage',
  setup() {
    return () => (
      <div class="grid gap-4 grid-cols-4">
        {Object.entries(icons).map(([name, Icon]) => (
          <div class="border rounded flex flex-col border-gray-300 p-4 items-center">
            <Icon class="w-full max-w-8 max-h-8" />
            <div class="mt-4 text-sm text-grey3">&lt;{name} /&gt;</div>
          </div>
        ))}
      </div>
    )
  }
})

export default IconsDemoPage
