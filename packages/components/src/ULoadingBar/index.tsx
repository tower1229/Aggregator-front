import { useLoadingBar } from 'naive-ui'
import type { LoadingBarApiInjection } from 'naive-ui/lib/loading-bar/src/LoadingBarProvider'
import { defineComponent, onMounted } from 'vue'
import ULoadingBarProvider from './ULoadingBarProvider'
export { default as ULoadingBarProvider } from './ULoadingBarProvider'

let _resolve: (value: unknown) => void
const _promise = new Promise(resolve => {
  _resolve = resolve
})

let _loadingBar: LoadingBarApiInjection

const loadingBarActions: (keyof LoadingBarApiInjection)[] = ['start', 'error', 'finish']

export const loadingBar: LoadingBarApiInjection = loadingBarActions.reduce((acc, name) => {
  acc[name] = (...args: any[]) => {
    // @ts-ignore
    _promise.then(() => _loadingBar[name](...args))
  }
  return acc
}, {} as any)

export const ULoadingBar = defineComponent({
  name: 'ULoadingBar',
  setup() {
    const loadingBar = useLoadingBar()
    _loadingBar = loadingBar

    onMounted(() => {
      _resolve(1)
    })

    return () => <ULoadingBarProvider />
  }
})
