import { omitObject } from '../src/obj'

describe('utils: omit properties from object', () => {
  const obj = {
    a: 1,
    b: 2,
    c: 3
  }

  test('omit unexisted', () => {
    // @ts-ignore
    expect(omitObject(obj, 'd', 'e')).toEqual(obj)
  })

  test('omit all existed', () => {
    expect(omitObject(obj, 'a', 'c')).toEqual({
      b: 2
    })
  })

  test('omit existed and not existed', () => {
    // @ts-ignore
    expect(omitObject(obj, 'a', 'd')).toEqual({
      b: 2,
      c: 3
    })
  })
})
