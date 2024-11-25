import { debounce } from '../src/delay'

describe('utils: debounce', () => {
  const debounceTime = 1000
  const sleepTime = 1500

  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  test('calls only once', () => {
    const fn = jest.fn()
    const debounced = debounce(fn, debounceTime)

    debounced()
    debounced()
    debounced()

    jest.advanceTimersByTime(sleepTime)

    expect(fn.mock.calls.length).toBe(1)
  })

  test('calls multiple times', () => {
    const fn = jest.fn()
    const debounced = debounce(fn, debounceTime)

    debounced()
    jest.advanceTimersByTime(sleepTime)
    debounced()
    debounced()

    jest.advanceTimersByTime(sleepTime)

    expect(fn.mock.calls.length).toBe(2)
  })
})
