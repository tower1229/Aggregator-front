import { defineComponent } from 'vue'

import { UAddress } from '@/comps/index'

export default defineComponent({
  setup() {
    return () => {
      return (
        <div class="h-full">
          <div class="rounded-xl p-20px">
            <div class="mb-16px text-16px">基础</div>
            <div class="flex flex-row">
              <UAddress address="0xC294C27c28E9b0302A5aaC94a24cEA87B207E5e9" />
            </div>
            <div class="my-16px text-16px">截取</div>
            <div class="flex flex-row">
              <UAddress autoSlice address="0xC294C27c28E9b0302A5aaC94a24cEA87B207E5e9" />
            </div>
          </div>
        </div>
      )
    }
  }
})
