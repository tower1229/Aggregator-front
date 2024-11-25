/**
 * hex to rgb
 */
export function hex2rgb(hex: string) {
  const hexValue = hex.replace(/^#/, '')
  const r = hexValue.slice(0, 2)
  const g = hexValue.slice(2, 4)
  const b = hexValue.slice(4, 6)
  return {
    r: +`0x${r}`,
    g: +`0x${g}`,
    b: +`0x${b}`
  }
}
