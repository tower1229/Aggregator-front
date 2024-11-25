import { convertCamelCase, randomStr } from '../src/char'

describe('utils: convert camel case', () => {
  test('startup to Startup', () => {
    expect(convertCamelCase('startup', true)).toBe('Startup')
  })

  test('Startup to startup', () => {
    expect(convertCamelCase('Startup', false)).toBe('startup')
  })

  test('Startup to startup', () => {
    expect(convertCamelCase('Startup')).toBe('startup')
  })

  test.each([['start_up'], ['start-up']])('cover to startup', x => {
    expect(convertCamelCase(x)).toBe('startUp')
  })
})

describe('random string', () => {
  test('randomStr', () => {
    expect(typeof randomStr()).toBe('string')
  })
})
