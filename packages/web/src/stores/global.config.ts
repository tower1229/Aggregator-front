import { themeColor } from '@aggregator/components'
import { storage } from '@aggregator/utils'
import { useMediaQuery } from '@vueuse/core'
import { defineStore } from 'pinia'

export type GlobalConfigState = {
  // current theme, default: light
  theme: 'light' | 'dark'
  notice: {
    title?: string
    state: 'pending' | 'success' | 'failed'
    txLink?: string
  }
  btnLoading: boolean
  btnLock: boolean
  swapSetting: {
    slippage: number
    speed: 'Normal' | 'Fast' | 'Instant'
    deadline: number
  }
}

const localData: GlobalConfigState =
  (storage('local').get('globalConfig') as GlobalConfigState) || {}
const isLargeScreen = useMediaQuery('(min-width: 1024px)')

export const useGlobalConfigStore = defineStore('globalConfig', {
  state: (): GlobalConfigState => ({
    theme: localData.theme || 'dark',
    notice: {
      state: 'pending'
    },
    btnLoading: false,
    btnLock: false,
    swapSetting: {
      slippage: 1,
      speed: 'Fast',
      deadline: 30
    }
  }),
  getters: {
    isLargeScreen: () => isLargeScreen.value,
    themeColors: state => themeColor(state.theme)
  },
  actions: {
    switchTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      storage('local').set('globalConfig', {
        theme: this.theme
      })
    },
    startNotice(text: string, link?: string) {
      this.notice = {
        title: text,
        state: 'pending',
        txLink: link
      }
    },
    successNotice(text: string, link?: string) {
      this.notice = {
        title: text,
        state: 'success',
        txLink: link
      }
      setTimeout(() => {
        this.notice = {
          state: 'pending'
        }
      }, 5000)
    },
    failNotice(text: string) {
      if (text === '4001') {
        // user reject
        return
      }
      if (text.indexOf('32603') !== -1) {
        text = 'Insufficient funds for gas'
      }
      this.notice = {
        title: text,
        state: 'failed'
      }
      setTimeout(() => {
        this.notice = {
          state: 'pending'
        }
      }, 5000)
    }
  }
})
