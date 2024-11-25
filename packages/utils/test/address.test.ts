import { isValidAddress, shortenAddress } from '../src/address'

describe('utils: address', () => {
  test('should be valid address', () => {
    expect(isValidAddress('0x75AE05a6F6Ba82a23b090CF21cb6EA8e9eEA35df')).toBe(true)
  })

  test("should be invalid as it's not start with 0x", () => {
    expect(isValidAddress('x75AE05a6F6Ba82a23b090CF21cb6EA8e9eEA35df')).toBe(false)
  })

  test("should be invalid as it's length is not right", () => {
    expect(isValidAddress('0x75AE05a6F6Ba82a23b090CF21cb6EA8e9eEA35d')).toBe(false)
  })

  test('should be short address', () => {
    expect(shortenAddress('0x75AE05a6F6Ba82a23b090CF21cb6EA8e9eEA35df')).toBe('0x75AE...A35df')
  })
})
