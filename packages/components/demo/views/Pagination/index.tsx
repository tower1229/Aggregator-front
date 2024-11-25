import { defineComponent, ref } from 'vue'

import { UPagination } from '@/comps/index'

export default defineComponent({
  setup() {
    const current = ref<number>(1)
    return () => {
      return (
        <div class="h-full">
          <div class="p-20px rounded-xl">
            <div class="text-16px mb-16px">基础</div>
            <div class="flex flex-row">
              <UPagination
                page={current.value}
                pageCount={10}
                onUpdatePage={page => {
                  current.value = page
                }}
              />
            </div>
          </div>
        </div>
      )
    }
  }
})
