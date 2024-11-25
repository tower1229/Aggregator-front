import { defineComponent, ref } from 'vue'
import { UInputNumber } from '@/comps/index'

const InputNumberDemoPage = defineComponent({
  name: 'InputNumberDemoPage',
  setup() {
    const v = ref(1)
    return () => (
      <>
        <UInputNumber v-model:value={v.value}>
          {{
            prefix: () => <span>$</span>,
            suffix: () => <span>%</span>
          }}
        </UInputNumber>
        <UInputNumber v-model:value={v.value}></UInputNumber>
        {v.value}
      </>
    )
  }
})

export default InputNumberDemoPage
