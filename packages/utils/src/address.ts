/**
 * isValidAddress
 */
export function isValidAddress(address: string) {
  return /^0x[0-9a-fA-F]{40}$/.test(address)
}

/**
 * shortenAddress
 */
export function shortenAddress(address: string, prefixLength = 4, suffixLength = 4): string {
  return `${address.substring(0, prefixLength + 2)}...${address.substring(
    address.length - suffixLength
  )}`
}
