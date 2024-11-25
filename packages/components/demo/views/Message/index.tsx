import { defineComponent } from 'vue'
import { UButton, message } from '@/comps/index'

const MessageDemoPage = defineComponent({
  name: 'MessageDemoPage',
  setup() {
    const showMsg = () => {
      message.success('This is a success message')
    }
    return () => (
      <div>
        <UButton type="primary" onClick={showMsg}>
          show
        </UButton>
      </div>
    )
  }
})

export default MessageDemoPage
