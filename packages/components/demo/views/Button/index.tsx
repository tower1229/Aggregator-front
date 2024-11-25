import { defineComponent } from 'vue'

import { UButton } from '@/comps/index'

export default defineComponent({
  setup() {
    return () => {
      return (
        <div class="h-full">
          <div class="rounded-xl p-20px">
            <div class="mb-16px text-16px">基础</div>
            <div class="flex flex-row">
              <UButton class="mr-16px mb-16px" type="primary">
                Primary
              </UButton>
              <UButton class="mr-16px mb-16px" type="success">
                Success
              </UButton>
              <UButton class="mr-16px mb-16px" type="tertiary">
                Tertiary
              </UButton>
              <UButton class="mr-16px mb-16px" type="warning">
                Warning
              </UButton>
              <UButton class="mr-16px mb-16px" type="error">
                Error
              </UButton>
              <UButton class="mr-16px mb-16px" type="info">
                Info
              </UButton>
              <UButton class="mb-16px" type="default">
                Default
              </UButton>
            </div>
          </div>
        </div>
      )
    }
  }
})
