import { defineComponent } from 'vue'
import { UPaginatedList } from '@/comps/index'

export default defineComponent({
  setup() {
    const requestService = (page: number, pageSize: number) => {
      return new Promise<{
        total: number
        items: Record<string, any>[]
      }>(resolve => {
        resolve({
          total: 32,
          items: Array.from({ length: pageSize }, (_, i) => ({
            k: i + 1 + page * pageSize
          }))
        })
      })
    }

    return () => {
      return (
        <>
          <UPaginatedList
            service={requestService}
            children={data => {
              return (
                <div>
                  {data.total}
                  {data.dataSource.map(item => (
                    <div>{item.k}</div>
                  ))}
                </div>
              )
            }}
          />
        </>
      )
    }
  }
})
