import { defineComponent, ref } from 'vue'
import { UButton, UContractInteraction, UContractInteractionPropsType } from '@/comps/index'

const TransactionDemoPage = defineComponent({
  name: 'TransactionDemoPage',
  setup() {
    const status = ref<UContractInteractionPropsType['status']>()

    const testStatus = (_status: UContractInteractionPropsType['status']) => {
      status.value = 'pending'
      setTimeout(() => {
        status.value = _status
      }, 3000)
    }

    return () => (
      <>
        <UContractInteraction
          status={status.value}
          text="Waiting to submit all contents to blockchain for creating startup"
        />
        <div class="flex items-center gap-4">
          <UButton onClick={() => (status.value = 'pending')}>Pending</UButton>
          <UButton onClick={() => testStatus('success')}>Success</UButton>
          <UButton onClick={() => testStatus('canceled')}>Cancel</UButton>
          <UButton onClick={() => testStatus('failed')}>Fail</UButton>
        </div>
      </>
    )
  }
})

export default TransactionDemoPage
