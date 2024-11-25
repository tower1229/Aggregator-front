import { SearchOutlined } from '@aggregator/icons'
import { NInput } from 'naive-ui'
import type { InputProps } from 'naive-ui'
import { defineComponent } from 'vue'
import './index.css'

export type USearchPropsType = InputProps

const USearch = defineComponent({
  extends: NInput,
  inheritAttrs: true,
  setup(props) {
    return () => (
      <NInput {...props} class="u-search" placeholder={props.placeholder || 'Search'}>
        {{
          prefix: () => <SearchOutlined class="u-search-prefix" />
        }}
      </NInput>
    )
  }
})

export default USearch
