import { ref } from 'vue'

export function useMockCountdown(args?: {
  total?: number
  // speed?: 'fast' | 'normal' | 'slow'
}) {
  const total = args?.total ?? 100
  // const speed = args?.speed ?? 'normal'

  const left = ref(total)

  let timeout: number | undefined

  function loop() {
    let delta: number
    if (left.value >= total / 2) {
      delta = total / 10
    } else if (left.value >= total / 4) {
      delta = total / 20
    } else {
      delta = Math.random() * left.value * 0.8
      // delta = (speed === 'fast' ? 0.6 : speed === 'slow' ? 0.2 : 0.4) * Math.random() * left.value
    }
    left.value -= Math.floor(delta)
    if (left.value > 0) {
      timeout = window.setTimeout(() => {
        loop()
      }, 1000)
    }
  }

  function cancel() {
    setLeft(0)
    if (timeout) {
      window.clearTimeout(timeout)
      timeout = undefined
    }
  }

  function setLeft(v: number) {
    left.value = v
  }

  function start() {
    setLeft(total)
    loop()
  }

  return { left, cancel, start }
}
