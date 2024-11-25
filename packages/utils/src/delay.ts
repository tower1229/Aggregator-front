export function debounce<F extends (...params: any[]) => void>(fn: F, delay = 300) {
  let timeoutID: NodeJS.Timeout | number
  return function (this: any, ...args: any[]) {
    typeof window === 'undefined'
      ? clearTimeout(timeoutID as NodeJS.Timeout)
      : clearTimeout(timeoutID as number)
    timeoutID = (typeof window === 'undefined' ? global : window).setTimeout(
      () => fn.apply(this, args),
      delay
    )
  } as F
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
