import axios from 'axios'

const instance = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

instance.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    // return console.warn(error)
  }
)

export default instance

export const apiRequestUrl = function (methodName: string, queryParams?: Record<string, any>) {
  return methodName + '?' + new URLSearchParams(queryParams).toString()
}

export const fetchBalances = (address: string) => {
  return instance.get(`https://api.llamafolio.com/balances/${address}/tokens`)
}

export const fetchTokenPrice = (chainName: string, params: Record<string, any>) => {
  if (!params.vs_currencies) {
    params.vs_currencies = 'usd'
  }
  if (!params.contract_addresses) {
    // main token
    params.ids = chainName
    return instance
      .get(apiRequestUrl(`https://api.coingecko.com/api/v3/simple/price`, params))
      .then(res => {
        if (res?.data && res.data[params.ids]) {
          return {
            '0x0000000000000000000000000000000000000000': res.data[params.ids][params.vs_currencies]
          }
        } else {
          return null
        }
      })
  } else {
    return instance
      .get(
        apiRequestUrl(`https://api.coingecko.com/api/v3/simple/token_price/${chainName}`, params)
      )
      .then(res => {
        if (res?.data) {
          const keys = Object.keys(res.data)
          keys.map(key => {
            res.data[key] = res.data[key][params.vs_currencies]
          })
          return res.data
        } else {
          return null
        }
      })
  }
}

export const fetchTokenPriceByLLama = (chainName: string, params: Record<string, any>) => {
  const tokens = params.contract_addresses.map((addr: string) => `${chainName}:${addr}`)
  console.log('fetchTokenPriceByLLama', tokens)
  if (!tokens.length) {
    return null
  }

  return instance
    .get(`https://coins.llama.fi/prices/current/${tokens}?searchWidth=4h`)
    .then(res => {
      if (res?.data?.coins) {
        const keys = Object.keys(res.data.coins)
        const result: Record<string, number> = {}
        keys.map(key => {
          result[key] = res.data.coins[key].price
        })
        return result
      } else {
        return null
      }
    })
}
