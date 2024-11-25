/**
 * https://chainlist.org/
 */

export type ChainNetworkType = {
  chainId: number
  name: string
  shortName?: string
  wagmiChainName?: string
  currencySymbol: string
  rpcUrl: string
  explorerUrl: string
  chain_contracts?: Array<{
    project: number
    address: string
    abi: string
  }>
  coingeckoId?: string
  coingeckoPlatformId?: string
  defillamaId?: string
}

/**
 * All networks we want to support
 * (Ethereum、BNB Smart Chain、Avalanche、Fantom Opera) use
 */
export const allNetworks: ChainNetworkType[] = [
  // mainnet
  {
    chainId: 1,
    name: 'Ethereum',
    shortName: 'Ethereum',
    wagmiChainName: 'mainnet',
    currencySymbol: 'ETH',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    explorerUrl: 'https://etherscan.io',
    coingeckoId: 'ethereum',
    coingeckoPlatformId: 'ethereum'
  },
  {
    chainId: 10,
    name: 'Optimism',
    shortName: 'Optimism',
    wagmiChainName: 'optimism',
    currencySymbol: 'ETH',
    rpcUrl: 'https://mainnet.optimism.io',
    explorerUrl: 'https://optimistic.etherscan.io',
    coingeckoId: 'optimism',
    coingeckoPlatformId: 'optimistic-ethereum'
  },
  {
    chainId: 56,
    name: 'Binance Smart Chain',
    shortName: 'BSC',
    wagmiChainName: 'bsc',
    currencySymbol: 'BNB',
    rpcUrl: 'https://bsc.blockpi.network/v1/rpc/public',
    explorerUrl: 'https://bscscan.com',
    coingeckoId: 'binancecoin',
    coingeckoPlatformId: 'binance-smart-chain',
    defillamaId: 'bsc'
  },
  {
    chainId: 57,
    name: 'Syscoin',
    shortName: 'Syscoin',
    currencySymbol: 'SYS',
    rpcUrl: 'https://rpc.syscoin.org',
    explorerUrl: 'https://explorer.syscoin.org',
    coingeckoId: 'syscoin',
    coingeckoPlatformId: 'syscoin'
  },
  {
    chainId: 100,
    name: 'Gnosis Chain',
    shortName: 'Gnosis',
    wagmiChainName: 'gnosis',
    currencySymbol: 'xDAI',
    rpcUrl: 'https://rpc.gnosischain.com',
    explorerUrl: 'https://gnosisscan.io',
    coingeckoId: 'gnosis',
    coingeckoPlatformId: 'xdai',
    defillamaId: 'xdai'
  },
  {
    chainId: 137,
    name: 'Polygon',
    shortName: 'Polygon',
    wagmiChainName: 'polygon',
    currencySymbol: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    coingeckoId: 'matic-network',
    coingeckoPlatformId: 'polygon-pos'
  },
  {
    chainId: 250,
    name: 'Fantom',
    shortName: 'Fantom',
    wagmiChainName: 'fantom',
    currencySymbol: 'FTM',
    rpcUrl: 'https://rpc.ftm.tools',
    explorerUrl: 'https://ftmscan.com',
    coingeckoId: 'fantom',
    coingeckoPlatformId: 'fantom'
  },
  {
    chainId: 288,
    name: 'BOBA NETWORK',
    shortName: 'BOBA',
    wagmiChainName: 'boba',
    currencySymbol: 'ETH',
    rpcUrl: 'https://mainnet.boba.network',
    explorerUrl: 'https://bobascan.com',
    coingeckoId: 'boba-network',
    coingeckoPlatformId: 'boba'
  },
  {
    chainId: 42161,
    name: 'Arbitrum One',
    shortName: 'Arbitrum',
    wagmiChainName: 'arbitrum',
    currencySymbol: 'ETH',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorerUrl: 'https://arbiscan.io/',
    coingeckoId: 'arbitrum',
    coingeckoPlatformId: 'arbitrum-one',
    defillamaId: 'arbitrum'
  },
  {
    chainId: 43114,
    name: 'Avalanche',
    shortName: 'Avalanche',
    wagmiChainName: 'avalanche',
    currencySymbol: 'AVAX',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    explorerUrl: 'https://snowtrace.io',
    coingeckoId: 'avalanche-2',
    coingeckoPlatformId: 'avalanche',
    defillamaId: 'avax'
  },
  // testnet
  {
    chainId: 5,
    name: 'Goerli',
    shortName: 'Goerli',
    currencySymbol: 'ETH',
    rpcUrl: 'https://goerli.infura.io/v3',
    explorerUrl: 'https://goerli.etherscan.io'
  },
  {
    chainId: 97,
    name: 'BNB Chain Testnet',
    shortName: 'BNB Testnet',
    currencySymbol: 'tBNB',
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    explorerUrl: 'https://testnet.bscscan.com'
  },
  {
    chainId: 4002,
    name: 'Fantom Testnet',
    shortName: 'Fantom Testnet',
    currencySymbol: 'FTM',
    rpcUrl: 'https://rpc.testnet.fantom.network',
    explorerUrl: 'https://testnet.ftmscan.com'
  },
  {
    chainId: 43113,
    name: 'Avalanche Fuji Testnet',
    shortName: 'Avalanche Testnet',
    currencySymbol: 'AVAX',
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    explorerUrl: 'https://cchain.explorer.avax-test.network'
  },
  {
    chainId: 80001,
    name: 'Mumbai',
    shortName: 'Mumbai',
    currencySymbol: 'MATIC',
    rpcUrl: 'https://matic-mumbai.chainstacklabs.com',
    explorerUrl: 'https://mumbai.polygonscan.com'
  },
  {
    chainId: 2814,
    name: 'Rollux OPv1 Private',
    shortName: 'Rollux Private',
    currencySymbol: 'RSYS',
    rpcUrl: 'https://testnet.rollux.com:2814',
    explorerUrl: 'https://explorer.testnet.rollux.com'
  }
]

export const supportedChainIds = import.meta.env.VITE_SUPPORTED_CHAIN_ID?.split(',').map(id =>
  Number(id)
) ?? [43114]

/**
 * Current supported networks
 */
export const supportedNetworks: ChainNetworkType[] = allNetworks.filter(network =>
  supportedChainIds.includes(network.chainId)
)

export const getNetByChainId = (chainId: number) => {
  return allNetworks.find(item => item.chainId === chainId)
}

export const getNetByChainName = (chainName: string) => {
  return allNetworks.find(item => item.name.toLowerCase() === chainName.toLowerCase())
}

export const SpinAddressMap: Record<number, string[]> = {
  1: [
    '0x0000000000000000000000000000000000000000',
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    '0x566957ef80f9fd5526cd2bef8be67035c0b81130',
    '0x6b175474e89094c44da98b954eedeac495271d0f',
    '0xdac17f958d2ee523a2206206994597c13d831ec7',
    '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'
  ],
  10: [
    '0x0000000000000000000000000000000000000000',
    '0x4200000000000000000000000000000000000006',
    '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
    '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
    '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
    '0x68f180fcce6836688e9084f035309e29bf0a2095'
  ],
  56: [
    '0x0000000000000000000000000000000000000000',
    '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
    '0x55d398326f99059ff775485246999027b3197955',
    '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c'
  ],
  100: [
    '0x0000000000000000000000000000000000000000',
    '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d',
    '0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1',
    '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83'
  ],
  137: [
    '0x0000000000000000000000000000000000000000',
    '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    '0x4318cb63a2b8edf2de971e2f17f77097e499459d',
    '0xc2132d05d31c914a87c6611c10748aeb04b58e8f'
  ],
  250: [
    '0x0000000000000000000000000000000000000000',
    '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
    '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
    '0x049d68029688eabf473097a2fc38ef61633a3c7a',
    '0x04068da6c83afcfa0e13ba15a6696662335d5b75'
  ],
  288: [
    '0x0000000000000000000000000000000000000000',
    '0x66a2a913e447d6b4bf33efbec43aaef87890fbbc',
    '0xa18bf3994c0cc6e3b63ac420308e5383f53120d7',
    '0xf74195bb8a5cf652411867c5c2c5b8c2a402be35',
    '0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000'
  ],
  42161: [
    '0x0000000000000000000000000000000000000000',
    '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
    '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
    '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
    '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
    '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f'
  ],
  43114: [
    '0x0000000000000000000000000000000000000000',
    '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
    '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
    '0xc7198437980c041c805a1edcba50c1ce5db95118',
    '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664'
  ]
}
