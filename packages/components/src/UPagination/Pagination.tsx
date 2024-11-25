import { NPagination } from 'naive-ui'
import type { PaginationProps } from 'naive-ui'
import { defineComponent } from 'vue'
import './index.css'

export type UPaginationPropsType = PaginationProps

const UPagination = defineComponent({
  extends: NPagination,
  setup(props, ctx) {
    return () => <NPagination class="u-pagination" {...props} v-slots={ctx.slots} />
  }
})

export default UPagination
