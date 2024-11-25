import { message } from '@aggregator/components'
import { storage } from '@aggregator/utils'
import { defineStore } from 'pinia'
import { STORE_KEY_TOKEN, STORE_KEY_TOKEN_ADRRESS } from '@/constants'
import { useWalletStore } from '@/stores'

export type UserState = {
  // user token
  token: string | undefined
  address: string | undefined
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: storage('local').get<string>(STORE_KEY_TOKEN),
    address: storage('local').get<string>(STORE_KEY_TOKEN_ADRRESS)
  }),
  getters: {
    logged: state => !!state.token
  },
  actions: {
    refreshToken(token?: string) {
      this.token = token || storage('local').get<string>(STORE_KEY_TOKEN)
      storage('local').set(STORE_KEY_TOKEN, this.token as string)
    },
    onLogin(token: string, walletAddress?: string) {
      storage('local').set(STORE_KEY_TOKEN, token)
      if (walletAddress) {
        this.address = walletAddress
        storage('local').set(STORE_KEY_TOKEN_ADRRESS, walletAddress)
      }
      this.token = token
    },
    logout(msg?: false | string, keepWalletState?: boolean) {
      const walletStore = useWalletStore()
      this.token = undefined
      this.address = undefined
      storage('session').clear()
      storage('local').remove(STORE_KEY_TOKEN)
      storage('local').remove(STORE_KEY_TOKEN_ADRRESS)
      if (!keepWalletState) {
        walletStore.disconnectWallet()
      }

      if (msg) {
        message.info(typeof msg === 'string' ? msg : 'You have been logged out')
      }
    }
  }
})
