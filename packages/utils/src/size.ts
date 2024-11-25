const sizeUnits = ['B', 'kB', 'MB', 'GB', 'TB']
/**
 * size format, retain 2 decimal places
 * @param size file size in bytes
 */
export function sizeFormat(size: number): string {
  if (size <= 0) return '0'
  const digitGroups = Math.floor(Math.log10(size) / Math.log10(1024))
  return `${Math.round((100 * size) / 1024 ** digitGroups) / 100} ${sizeUnits[digitGroups]}`
}
