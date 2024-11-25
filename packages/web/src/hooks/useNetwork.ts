import { ref, computed } from 'vue'
import { services } from '@/services'
import type { ApiDocuments } from '@/services/a2s.namespace'

const list = ref<ApiDocuments.proto_ChainResponse[]>([])

const loading = ref(false)

export function useNetwork(refresh = false) {
  const getTypeList = async (reload = refresh) => {
    if ((reload || !list.value.length) && !loading.value) {
      loading.value = true
      const { error, data } = await services['Chain@get-chain-list']({})
      if (!error) {
        list.value = data?.list || []
      } else {
        list.value = []
      }
      loading.value = false
    }
  }

  getTypeList()

  const getNetByChainId = (chainId: number) => {
    return computed(() => list.value.find(item => item.chainId === chainId))
  }

  return {
    list,
    reload: () => getTypeList(true),
    getNetByChainId
  }
}
