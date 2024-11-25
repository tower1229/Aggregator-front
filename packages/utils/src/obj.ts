export function omitObject<T extends Record<string, any>, K extends Extract<keyof T, string>>(
  obj: T,
  ...keys: K[]
): Omit<T, K> {
  const result: Record<string, any> = {}
  Object.keys(obj).forEach(key => {
    if (!keys.includes(key as K)) {
      result[key] = obj[key]
    }
  })
  return result as Omit<T, K>
}
