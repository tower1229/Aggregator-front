import { useMessage } from 'naive-ui'
import type { MessageApiInjection } from 'naive-ui/lib/message/src/MessageProvider'
import { defineComponent, onMounted } from 'vue'
import UMessageProvider from './MessageProvider'

let _resolve: (value: unknown) => void
const _promise = new Promise(resolve => {
  _resolve = resolve
})
let _message: MessageApiInjection
const messages: (keyof MessageApiInjection)[] = [
  'destroyAll',
  'error',
  'info',
  'loading',
  'success',
  'warning'
]
const message: MessageApiInjection = messages.reduce((acc, name) => {
  acc[name] = (...args: any[]) => {
    // @ts-ignore
    _promise.then(() => _message[name](...args))
  }
  return acc
}, {} as any)

export const UMessage = defineComponent({
  name: 'UMessage',
  setup() {
    const message = useMessage()
    _message = message

    onMounted(() => {
      _resolve(1)
    })

    return () => <UMessageProvider />
  }
})

export default message
