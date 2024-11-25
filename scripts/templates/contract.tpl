import { Contract, BigNumber } from 'ethers'
import { computed } from 'vue'
import { getContract, GetContractArgs, wrapTransaction } from '../share'
import { useWalletStore } from '@/stores'

export const <%= title %>Addresses: Record<number, string> = {<% addresses.forEach(function(network) { %>
  <%= network.chainId %>: '<%= network.address %>',<% }) %>}

const abi = '<%= abi %>'

export function use<%= title %>Contract(params: Omit<GetContractArgs, 'abi'> = { addresses: <%= title %>Addresses }): {
  getContract: () => Contract<% abiArr.forEach(function(func, index) { %>
  <%= func.name %>: (<%=generateArgs(func.inputs) ? generateArgs(func.inputs) + ',' : '' %> pendingText: string, waitingText: string, overrides?: any) => Promise<[<%= generateArgs(func.outputs, true) %>]><% }) %>
} {
  const walletStore = useWalletStore()
  const getContractArgs = computed<GetContractArgs>(() => {
    return {
      abi,
      addresses: <%= title %>Addresses,
      wallet: walletStore.wallet,
      chainId: walletStore.chainId
    }
  })
  return {
    getContract: () => getContract({...getContractArgs.value, ...params}),
    <% abiArr.forEach(function(func, index) { %><%= func.name %>: wrapTransaction({...getContractArgs.value, ...params}, '<%= func.name %>'),
    <% }) %>
  }
}
