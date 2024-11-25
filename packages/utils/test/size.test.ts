import { sizeFormat } from '../src/size'

describe('utils: size format', () => {
  test('less than KB', () => {
    expect(sizeFormat(123)).toBe('123 B')
  })

  test('less than MB, more than KB', () => {
    expect(sizeFormat(12345)).toBe('12.06 kB')
  })

  test('less than GB, more than MB', () => {
    expect(sizeFormat(1234567)).toBe('1.18 MB')
  })

  test('less than TB, more than GB', () => {
    expect(sizeFormat(1234567890)).toBe('1.15 GB')
  })

  test('more than TB', () => {
    expect(sizeFormat(1234567890123)).toBe('1.12 TB')
  })
})
