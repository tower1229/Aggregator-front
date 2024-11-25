import { defineComponent, ref } from 'vue'
import { UCheckboxGroup } from '@/comps/UCheckbox'
import UCheckbox from '@/comps/UCheckbox/Checkbox'

const CheckboxDemoPage = defineComponent({
  name: 'CheckboxDemoPage',
  setup() {
    const v = ref([1])
    return () => (
      <>
        <UCheckboxGroup v-model:value={v.value}>
          <UCheckbox value={1} label="1" />
          <UCheckbox value={2} label="2" />
        </UCheckboxGroup>
        <span>{v.value}</span>
      </>
    )
  }
})

export default CheckboxDemoPage
