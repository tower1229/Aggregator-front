/* eslint-disable */
interface BasicDto {
  [key: string]: any
}
export declare namespace ApiDocuments {
  export interface model_Chain extends BasicDto {
    chainId?: number
    currentSymbol?: string
    description?: string
    explorer?: string
    id?: string
    logo?: string
    logoStyle?: ApiDocuments.model_LogoStyle
    name?: string
    rpcUrl?: string
    wssUrl?: string
  }
  export interface model_DEX extends BasicDto {
    appUrl?: string
    chainId?: number
    default_fee?: number
    dexType?: number
    factory?: string
    id?: string
    logo?: string
    logoStyle?: ApiDocuments.model_LogoStyle
    name?: string
    officialSite?: string
    router01?: string
    router02?: string
  }
  export interface model_LogoStyle extends BasicDto {
    dark?: ApiDocuments.model_Style
    light?: ApiDocuments.model_Style
  }
  export interface model_PairReportIM extends BasicDto {
    chainId?: number
    dexId?: string
    fdv?: number
    last1h?: ApiDocuments.model_PairReportIMTimeData
    last24h?: ApiDocuments.model_PairReportIMTimeData
    last30m?: ApiDocuments.model_PairReportIMTimeData
    last4h?: ApiDocuments.model_PairReportIMTimeData
    last5m?: ApiDocuments.model_PairReportIMTimeData
    last6h?: ApiDocuments.model_PairReportIMTimeData
    lastTxAt?: number
    liquidity?: number
    mktCap?: number
    pairId?: string
    priceW0?: number
    priceW0USD?: number
    priceW1?: number
    priceW1USD?: number
    reserve0?: number
    reserve1?: number
  }
  export interface model_PairReportIMTimeData extends BasicDto {
    lastTxAt?: number
    makers?: ApiDocuments.model_PairReportIMTimeDataInfo
    price?: number
    priceAvg?: ApiDocuments.model_PairReportIMTimeDataInfo
    priceChange?: number
    priceChangeAbs?: number
    priceHigh?: number
    priceLow?: number
    priceUSD?: number
    start?: number
    timestamp?: number
    txns?: ApiDocuments.model_PairReportIMTimeDataInfo
    views?: number
    volume?: ApiDocuments.model_PairReportIMTimeDataInfo
    /**
     * @description VolumeChange PairReportIMTimeDataInfo `json:&quot;volumeChange&quot; bson:&quot;volumeChange&quot;`
     */
    volumeChange?: number
  }
  export interface model_PairReportIMTimeDataInfo extends BasicDto {
    buys?: number
    sells?: number
    total?: number
  }
  export interface model_SearchPairLastTime extends BasicDto {
    priceChangeAbsMax?: number
    priceChangeAbsMin?: number
    priceChangeMax?: number
    priceChangeMin?: number
    /**
     * @description 1m,5m,15m,1h,4h,6h,24h
     */
    timeInterval?: string
    txnsBuysMax?: number
    txnsBuysMin?: number
    txnsMax?: number
    txnsMin?: number
    txnsSellsMax?: number
    txnsSellsMin?: number
    viewsMax?: number
    viewsMin?: number
    volumeChangeMax?: number
    volumeChangeMin?: number
    volumeMax?: number
    volumeMin?: number
  }
  export interface model_SearchRanks extends BasicDto {
    /**
     * @description query rank by; field, According to the data structure, splicing field strings with dots
     */
    rankBy?: string
    /**
     * @description query rank type; 1 asc, -1 desc
     */
    rankType?: number
  }
  export interface model_Style extends BasicDto {
    background?: string
    color?: string
  }
  export interface proto_ChainResponse extends BasicDto {
    chainId?: number
    currentSymbol?: string
    description?: string
    explorer?: string
    id?: string
    logo?: string
    logoStyle?: ApiDocuments.model_LogoStyle
    name?: string
    rpcUrl?: string
    wssUrl?: string
  }
  export interface proto_DEXResponse extends BasicDto {
    appUrl?: string
    chainId?: number
    default_fee?: number
    dexType?: number
    factory?: string
    id?: string
    logo?: string
    logoStyle?: ApiDocuments.model_LogoStyle
    name?: string
    officialSite?: string
    router01?: string
    router02?: string
  }
  export interface proto_IDResponse extends BasicDto {
    /**
     * @description ID
     */
    id?: string
  }
  export interface proto_JwtAuthorizationResponse extends BasicDto {
    /**
     * @description Token
     */
    token: string
  }
  export interface proto_ListData extends BasicDto {
    /**
     * @description data list
     */
    list?: any
    /**
     * @description total
     */
    total: number
  }
  export interface proto_MessageResponse extends BasicDto {
    /**
     * @description Message
     */
    message: string
  }
  export interface proto_NonceResponse extends BasicDto {
    /**
     * @description expiration time
     */
    expirationTime: string
    /**
     * @description nonce
     */
    nonce: string
  }
  export interface proto_PageData extends BasicDto {
    /**
     * @description data list
     */
    list?: any
    /**
     * @description pagination offset, default: 0
     */
    offset?: number
    /**
     * @description pagination select current page, default: 1
     */
    page?: number
    /**
     * @description pagination size, default: 20
     */
    size?: number
    /**
     * @description total
     */
    total: number
  }
  export interface proto_Pair24HBasic extends BasicDto {
    chainId?: number
    id?: string
    pairReportIM?: ApiDocuments.proto_PairReportIM24H
  }
  export interface proto_PairBasicResponse extends BasicDto {
    chainId?: number
    createdAt?: number
    dex?: ApiDocuments.model_DEX
    dexId?: string
    fee?: number
    id?: string
    name?: string
    network?: ApiDocuments.model_Chain
    pairReportIM?: ApiDocuments.proto_PairReportIM
    token0?: {}
    token1?: {}
    tokenW0?: string
    tokenW0Logo?: string
    tokenW1?: string
    views?: number
  }
  export interface proto_PairReportIM extends BasicDto {
    fdv?: number
    last1h?: ApiDocuments.model_PairReportIMTimeData
    last24h?: ApiDocuments.model_PairReportIMTimeData
    last4h?: ApiDocuments.model_PairReportIMTimeData
    last5m?: ApiDocuments.model_PairReportIMTimeData
    last6h?: ApiDocuments.model_PairReportIMTimeData
    lastTxAt?: number
    liquidity?: number
    mktCap?: number
    priceW0?: number
    priceW0USD?: number
    priceW1?: number
    priceW1USD?: number
  }
  export interface proto_PairReportIM24H extends BasicDto {
    last24h?: ApiDocuments.proto_PairReportIMTimeDataPrice
    lastTxAt?: number
    priceW0?: number
    priceW0USD?: number
    priceW1?: number
    priceW1USD?: number
  }
  export interface proto_PairReportIMTimeDataPrice extends BasicDto {
    price?: number
    priceChange?: number
    priceHigh?: number
    priceLow?: number
    priceUSD?: number
  }
  export interface proto_PairReportResponse extends BasicDto {
    close?: number
    high?: number
    id?: string
    low?: number
    open?: number
    /**
   * @description DEX_ID        primitive.ObjectID `json:&quot;dexId&quot; bson:&quot;dexId&quot;`
PairId        primitive.ObjectID `json:&quot;pairId&quot; bson:&quot;pairId&quot;`
ChainId       uint64             `json:&quot;chainId&quot; bson:&quot;chainId&quot;`
HappenAt      int64              `json:&quot;happenAt&quot; bson:&quot;happenAt&quot;`
PriceAvg      float64            `json:&quot;priceAvg&quot; bson:&quot;priceAvg&quot;`
PriceAvgBuys  float64            `json:&quot;priceAvgBuys&quot; bson:&quot;priceAvgBuys&quot;`
PriceAvgSells float64            `json:&quot;priceAvgSells&quot; bson:&quot;priceAvgSells&quot;`
PriceEnd      float64            `json:&quot;priceEnd&quot; bson:&quot;priceEnd&quot;`
PriceMax      float64            `json:&quot;priceMax&quot; bson:&quot;priceMax&quot;`
PriceMin      float64            `json:&quot;priceMin&quot; bson:&quot;priceMin&quot;`
PriceStart    float64            `json:&quot;priceStart&quot; bson:&quot;priceStart&quot;`
TxnsBuys      int64              `json:&quot;txnsBuys&quot; bson:&quot;txnsBuys&quot;`
TxnsSells     int64              `json:&quot;txnsSells&quot; bson:&quot;txnsSells&quot;`
Txns          int64              `json:&quot;txns&quot; bson:&quot;txns&quot;`
Views         int64              `json:&quot;views&quot; bson:&quot;views&quot;`
Volume        float64            `json:&quot;volume&quot; bson:&quot;volume&quot;`
VolumeBuys    float64            `json:&quot;volumeBuys&quot; bson:&quot;volumeBuys&quot;`
VolumeSells   float64            `json:&quot;volumeSells&quot; bson:&quot;volumeSells&quot;`
Makers        int64              `json:&quot;makers&quot; bson:&quot;makers&quot;`
MakersBuys    int64              `json:&quot;makersBuys&quot; bson:&quot;makersBuys&quot;`
MakersSells   int64              `json:&quot;makersSells&quot; bson:&quot;makersSells&quot;`
Liquidity     float64            `json:&quot;liquidity&quot; bson:&quot;liquidity&quot;`
FDV           float64            `json:&quot;FDV&quot; bson:&quot;FDV&quot;`
MKTCap        float64            `json:&quot;MKTCap&quot; bson:&quot;MKTCap&quot;`
TrendType     int                `json:&quot;trendType&quot; bson:&quot;trendType&quot;`
     */
    pairId?: string
    timestamp?: number
    txns?: number
    volume?: number
  }
  export interface proto_PairResponse extends BasicDto {
    chainId?: number
    createdAt?: number
    decimals?: number
    dex?: ApiDocuments.model_DEX
    dexId?: string
    factory?: string
    fee?: number
    id?: string
    logo?: string
    name?: string
    network?: ApiDocuments.model_Chain
    pairAddress?: string
    pairDetail?: {}
    pairReportIM?: ApiDocuments.model_PairReportIM
    symbol?: string
    token0?: {}
    token1?: {}
    tokenW0?: string
    tokenW0Categories?: string[]
    tokenW0Info?: {}
    tokenW0Logo?: string
    tokenW1?: string
    tokenW1Info?: {}
    views?: number
  }
  export interface proto_PairTransactionResponse extends BasicDto {
    amount0In?: number
    amount0Out?: number
    amount1In?: number
    amount1Out?: number
    amountInUSD?: number
    amountOutUSD?: number
    blockGasLimit?: number
    blockGasUsed?: number
    blockNumber?: number
    blockTime?: number
    chainId?: number
    dexId?: string
    effectiveGasPrice?: number
    flinkTime?: number
    from?: string
    gasUsed?: number
    id?: string
    lastPriceW0USD?: number
    pairAddress?: string
    pairId?: string
    priceW0?: number
    priceW0USD?: number
    priceW1?: number
    priceW1USD?: number
    to?: string
    token0Price?: number
    token0PriceUSD?: number
    token1Price?: number
    token1PriceUSD?: number
    transactionFee?: number
    transactionHash?: string
  }
  export interface proto_PortfolioResponse extends BasicDto {
    tokenBalances?: ApiDocuments.proto_TokenBalance[]
    totalBalanceUSD?: number
    totalBalanceUSDChange?: number
  }
  export interface proto_QueryPairRequest extends BasicDto {
    /**
     * @description is ad
     */
    ad?: boolean
    /**
     * @description categories
     */
    categories?: string[]
    /**
     * @description chain ids
     */
    chainIds?: number[]
    /**
     * @description dex ids
     */
    dexs?: string[]
    /**
     * @description query keyword
     */
    keyword?: string
    liquidityMax?: number
    liquidityMin?: number
    /**
     * @description or filters
     */
    or?: ApiDocuments.model_SearchPairLastTime[]
    /**
     * @description hour
     */
    pairAgeMax?: number
    /**
     * @description hour
     */
    pairAgeMin?: number
    /**
     * @description pair ids
     */
    pairIds?: string[]
    priceChangeAbsMax?: number
    priceChangeAbsMin?: number
    priceChangeMax?: number
    priceChangeMin?: number
    /**
     * @description multi-rank
     */
    ranks?: ApiDocuments.model_SearchRanks[]
    /**
     * @description 1m,5m,15m,1h,4h,6h,24h
     */
    timeInterval?: string
    txnsBuysMax?: number
    txnsBuysMin?: number
    txnsMax?: number
    txnsMin?: number
    txnsSellsMax?: number
    txnsSellsMin?: number
    viewsMax?: number
    viewsMin?: number
    volumeChangeMax?: number
    volumeChangeMin?: number
    volumeMax?: number
    volumeMin?: number
  }
  export interface proto_ShareSetRequest extends BasicDto {
    description: string
    image: string
    route: string
    title: string
  }
  export interface proto_ShareSetResponse extends BasicDto {
    shareCode: string
  }
  export interface proto_SyncItemRequest extends BasicDto {
    /**
     * @description item
     */
    item?: {}
  }
  export interface proto_SyncListRequest extends BasicDto {
    /**
     * @description list
     */
    list?: {}[]
  }
  export interface proto_TokenBalance extends BasicDto {
    balance?: number
    balanceUSD?: number
    contractAddress?: string
    decimals?: number
    logo?: string
    name?: string
    pair?: ApiDocuments.proto_Pair24HBasic
    symbol?: string
  }
  export interface proto_UploadResponse extends BasicDto {
    url: string
  }
  export interface proto_WalletLoginRequest extends BasicDto {
    /**
     * @description Wallet nonce
     */
    nonce: string
    /**
     * @description Wallet signature
     */
    signature: string
    /**
     * @description Wallet address
     */
    walletAddress: string
  }
}
