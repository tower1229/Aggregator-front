import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'

import {
  UStyleProvider,
  UHashInputProvider,
  UMessageProvider,
  UMessage,
  ULoadingBar,
  ULoadingBarProvider,
  UUploadProvider,
  UModalProvider
} from '@/comps/index'

const onHashSearch = (value: string) => {
  return new Promise<{ label: string; value: string }[]>(resolve => {
    resolve(
      Array.from({ length: value.length }).map((_, i) => ({
        label: `#${value}_${i}#`,
        value: `${value}_${i}`
      }))
    )
  })
}

const onUpload = (file: File, callback: (percent: number) => void) => {
  let _timeout: number
  const run = () => {
    function loop(progress: number) {
      _timeout = window.setTimeout(() => {
        const nextProgress = Math.random() * (100 - progress) + progress
        callback(nextProgress)
        loop(nextProgress)
      }, 100)
    }
    loop(1)
  }
  return new Promise<string>((resolve, reject) => {
    run()
    setTimeout(() => {
      clearTimeout(_timeout)
      if (Math.random() < 0.9) {
        resolve(`https://picsum.photos/200/200?image=${Math.floor(Math.random() * 1000)}`)
      } else {
        reject(new Error('Upload error'))
      }
    }, 2000)
  })
}

export default defineComponent({
  setup() {
    return () => {
      return (
        <UStyleProvider>
          <UMessageProvider>
            <UMessage />
          </UMessageProvider>
          <ULoadingBarProvider>
            <ULoadingBar />
          </ULoadingBarProvider>
          <UModalProvider>
            <UHashInputProvider onSearch={onHashSearch}>
              <UUploadProvider onUpload={onUpload}>
                <RouterView></RouterView>
              </UUploadProvider>
            </UHashInputProvider>
          </UModalProvider>
        </UStyleProvider>
      )
    }
  }
})
