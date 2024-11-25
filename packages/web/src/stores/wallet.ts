import {
  configureChains,
  createClient,
  watchNetwork,
  watchAccount,
  switchNetwork
} from '@wagmi/core'
import * as allChains from '@wagmi/core/chains'
import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/html'
import { defineStore } from 'pinia'
import { supportedNetworks } from '@/constants'

export type coinbaseProvider = {
  ethereum: any
}
export type WalletState = {
  // wallet address
  address?: string
  chainInfo?: { id: number } & Record<string, any>
  web3modal?: Web3Modal
  provider?: any
}
export type coinbaseWindowType = {
  providers: Array<{
    close: () => void
  }>
}

export const useWalletStore = defineStore('wallet', {
  state: (): WalletState => ({
    address: undefined,
    chainInfo: undefined,
    web3modal: undefined
  }),
  getters: {
    connected: state => !!state.address,
    chainId: state => state.chainInfo?.id,
    explorerUrl: state => state.chainInfo?.blockExplorers.default.url
  },
  actions: {
    init() {
      // begin
      const chains = supportedNetworks
        .map(item => item.wagmiChainName)
        .map(key => key && (allChains as any)[key])
        .filter(net => !!net)
      if (chains.length) {
        // Wagmi Core Client
        const { provider } = configureChains(chains, [
          walletConnectProvider({ projectId: import.meta.env.VITE_WEB3MODAL_PROJECT_ID })
        ])
        const wagmiClient = createClient({
          autoConnect: true,
          connectors: modalConnectors({
            projectId: import.meta.env.VITE_WEB3MODAL_PROJECT_ID,
            version: '1', // or "2"
            appName: 'wedex',
            chains
          }),
          provider
        })

        // Web3Modal and Ethereum Client
        const ethereumClient = new EthereumClient(wagmiClient, chains)
        this.web3modal = new Web3Modal(
          { projectId: import.meta.env.VITE_WEB3MODAL_PROJECT_ID },
          ethereumClient
        )

        watchAccount(account => {
          this.address = account.address
        })
        watchNetwork(network => {
          this.chainInfo = network.chain
        })

        return this.web3modal
      } else {
        console.warn('wallet init error, check the chains list', supportedNetworks, allChains)
        return null
      }
    },
    switchNetwork(chain: { chainId?: number; chainName?: string }) {
      let result = chain.chainId
      if (!result) {
        const targetChain: any = supportedNetworks.find(
          e => e.name.toLowerCase() === chain.chainName?.toLowerCase()
        )
        if (targetChain) {
          result = targetChain.chainId
        }
      }
      result &&
        this.connected &&
        switchNetwork({
          chainId: result
        })
    },
    setDefaultChainByChainId(chainId: number) {
      const targetName = supportedNetworks.find(e => e.chainId === chainId)?.wagmiChainName
      const targetNet = targetName ? (allChains as any)[targetName] : null
      if (targetNet) {
        this.web3modal?.setDefaultChain(targetNet)
      } else {
        console.warn('no support default net: ', chainId)
      }
    },
    disconnectWallet() {
      this.address = undefined
      this.chainInfo = undefined
    }
  }
})

export type WalletStore = ReturnType<typeof useWalletStore>
