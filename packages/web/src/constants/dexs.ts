import type { ApiDocuments } from '@/services/a2s.namespace'

type dexSwapData = {
  inputAddress?: string
  outputAddress?: string
  chainId?: number
  inputSymbol?: string
  outputSymbol?: string
}

const inputAddress = 'inputAddress'
const outputAddress = 'outputAddress'
const inputSymbol = 'inputSymbol'
const outputSymbol = 'outputSymbol'
const chainId = 'chainId'
// @ts-ignore
const template = (strings, ...keys) => {
  return function (swapData: dexSwapData) {
    const result = [strings[0]]
    keys.forEach(function (key: any, i) {
      // @ts-ignore
      const value = swapData[key] || '--'
      result.push(value, strings[i + 1])
    })
    return result.join('')
  }
}

export const dexs: Record<string, any> = {
  'Uniswap V2': {
    swapFunction: template`https://app.uniswap.org/#/swap?inputCurrency=${inputAddress}&outputCurrency=${outputAddress}&chainId=${chainId}`
  },
  SpiritSwap: {
    swapFunction: template`https://www.spiritswap.finance/swap/${inputSymbol}/${outputSymbol}`
  },
  Pangolin: {
    swapFunction: template`https://app.pangolin.exchange/#/swap?inputCurrency=${inputAddress}&outputCurrency=${outputAddress}&chainId=${chainId}`
  },
  'SushiSwap V2': {
    swapFunction: template`https://app.sushi.com/swap?inputCurrency=${inputAddress}&outputCurrency=${outputAddress}&chainId=${chainId}`
  },
  Pegasys: {
    swapFunction: template`https://app.pegasys.finance/#/swap?inputCurrency=${inputAddress}&outputCurrency=${outputAddress}&chainId=${chainId}`
  },
  Fraxswap: {
    swapFunction: template`https://app.frax.finance/swap/main?from=${inputAddress}&to=${outputAddress}`
  }
}

export const dexSwapLink = (dex: ApiDocuments.model_DEX, swapData: dexSwapData) => {
  if (dex.name && dexs[dex.name]) {
    return dexs[dex.name].swapFunction(swapData)
  } else {
    return dex.appUrl
  }
}
