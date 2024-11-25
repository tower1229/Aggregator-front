import { defineComponent, reactive, ref } from 'vue'

import { UPaginatedList, UButton } from '@/comps/index'

export default defineComponent({
  setup() {
    const data = reactive([1, 2, 3, 4, 5, 6])
    const pageNum = ref<number>(1)
    const colCount = ref<number>(3)

    return () => {
      return (
        <div class="h-full">
          <div class="flex flex-row items-center mb-16px">
            <span class="text-16px mr-4px">显示列数:</span>
            {data.map(count => {
              return (
                <UButton
                  type={colCount.value === count ? 'primary' : 'default'}
                  key={count}
                  class="not-last:mr-16px"
                  onClick={() => {
                    colCount.value = count
                  }}
                >
                  {count}
                </UButton>
              )
            })}
          </div>
          <UPaginatedList
            dataSource={data}
            colCount={colCount.value}
            cellRender={i => {
              return (
                <div class="h-[200px] bg-[#5331F4] flex flex-row justify-center items-center text-30px">
                  {i}
                </div>
              )
            }}
            pagination={{
              page: pageNum.value,
              pageCount: 9,
              onUpdatePage(page) {
                pageNum.value = page
              }
            }}
          />
        </div>
      )
    }
  }
})
