import { useClipboard } from '@vueuse/core'
import { services } from '@/services'

const { copy } = useClipboard()

type shareToTwitterProp = {
  image: string
  route: string
  title: string
  description: string
  text?: string
  tags?: string
}

const shareToTwitter = async function (props: shareToTwitterProp) {
  return new Promise((resolve, reject) => {
    if (props.image && props.title && props.route && props.description) {
      services['Share@set-share']({
        ...props
      }).then(res => {
        if (res.data?.shareCode) {
          const TwitterTempUrl = `https://${import.meta.env.VITE_HOST}/api/share/${
            res.data.shareCode
          }`
          // &via=WEconomyNetwork
          const postTwitterLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            props.text || props.title
          )}&url=${encodeURIComponent(TwitterTempUrl)}${
            props.tags ? '&hashtags=' + encodeURIComponent(props.tags) : ''
          }`
          window.open(postTwitterLink)
          resolve(true)
        } else {
          reject(new Error(`api Share@set-share response error`))
        }
      })
    } else {
      console.warn(`shareToTwitter(): missing param `, props)
      reject(new Error(`shareToTwitter(): missing param `))
    }
  })
}

type copyTextProp = {
  text: string
}

const copyText = function (props: copyTextProp) {
  return copy(props.text)
}

export function useShare() {
  return {
    shareToTwitter,
    copyText
  }
}
