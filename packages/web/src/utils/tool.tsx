import { useEventBus } from '@vueuse/core'
export const bus = useEventBus<string>('dex')
