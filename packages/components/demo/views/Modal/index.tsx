import { defineComponent, ref } from 'vue'
import { UButton } from '@/comps/UButton'
import { UCard } from '@/comps/UCard'
import { UModal } from '@/comps/UModal'

export default defineComponent({
  setup() {
    const visible = ref(false)

    const showModal = () => {
      visible.value = true
    }

    return () => (
      <div>
        <UModal show={visible.value}>
          <UCard
            style="width: 600px"
            title="Modal"
            bordered={false}
            size="huge"
            role="dialog"
            aria-modal="true"
          >
            This is Modal
          </UCard>
        </UModal>
        <UButton type="primary" onClick={showModal}>
          show
        </UButton>
      </div>
    )
  }
})
