import { defineComponent, ref } from 'vue'
import { UDatePicker, UTime } from '@/comps/index'

const DatePickerDemoPage = defineComponent({
  name: 'DatePickerDemoPage',
  setup() {
    const date = ref(new Date().getTime())
    const month = ref()
    const range = ref<Date[] | null>(null)
    return () => (
      <>
        <UDatePicker v-model:value={date.value} type="date" />
        <UDatePicker v-model:value={month.value} type="month" />
        <UDatePicker v-model:value={range.value} type="datetimerange" />
        <div>
          1. <UTime time={date.value} />
        </div>
        <div>
          2. <UTime time={month.value} />
        </div>
        <div>
          3. <UTime time={range.value?.[0]} /> -&gt; <UTime time={range.value?.[1]} />
        </div>
      </>
    )
  }
})

export default DatePickerDemoPage
