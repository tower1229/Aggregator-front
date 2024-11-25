import { ArrowDownOutlined } from '@aggregator/icons'
import { NSelect } from 'naive-ui'
import type { SelectProps } from 'naive-ui'
import { defineComponent } from 'vue'
import './DropdownFilter.css'

export type UDropdownFilterProps = SelectProps

const UDropdownFilter = defineComponent({
  name: 'UDropdownFilter',
  extends: NSelect,
  setup(props) {
    return () => (
      <NSelect
        {...props}
        class="rounded-sm cursor-pointer u-dropdown-filter hover:bg-color-hover"
        placeholder={props.placeholder || 'Select'}
        menuProps={{
          class: 'u-dropdown-filter__menu'
        }}
      >
        {{
          arrow: () => <ArrowDownOutlined class="u-dropdown-filter__arrow" />
        }}
      </NSelect>
    )
  }
})

export default UDropdownFilter
