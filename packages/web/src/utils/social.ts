export const socialLinkTransform = (value: string, type?: string) => {
  let result = value
  const typeString = type ? type.toLowerCase() : null
  if (typeString) {
    switch (typeString) {
      case 'twitter':
        if (value.indexOf('//') === -1) {
          result = `https://twitter.com/${value}`
        }
        break
      case 'telegram':
        if (value.indexOf('//') === -1) {
          result = `https://t.me/${value}`
        }
        break
    }
  }

  return result
}
