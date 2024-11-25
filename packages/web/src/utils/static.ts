export const ossPath = (shortPath?: string) => {
  if (!shortPath || !shortPath.split) {
    return shortPath
  }
  if (shortPath.indexOf('http') === 0) {
    return shortPath
  }
  return `//${import.meta.env.VITE_HOST}/oss${shortPath}`
}

import defaultTokenImg from '@/assets/token.png'

export const tokenLogoUrl = (url: any) => {
  return (url ? url.replaceAll(' ', '') : url) || defaultTokenImg
}
