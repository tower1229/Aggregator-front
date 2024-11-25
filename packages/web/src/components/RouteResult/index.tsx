import { USkeleton } from '@aggregator/components'
import { ArrowDownOutlined, BestFilled } from '@aggregator/icons'
import { sendTransaction, prepareSendTransaction, fetchBlockNumber } from '@wagmi/core'
import { BigNumber } from 'ethers'
import { defineComponent, watch, ref, onBeforeUnmount, computed, nextTick } from 'vue'
import Board from './Board'
import Routes from './Routes'
import Loading from '@/components/Loading'
import { useDexes, routeResultType, swapParamsType, routeCollectionType } from '@/hooks'
import { useWalletStore, useSwapStore, useGlobalConfigStore } from '@/stores'
import { parseUnits, formatUnits, formatCurrency, fixFloat2 } from '@/utils/number'
import { bus } from '@/utils/tool'

type extendType = {
  priceUSD?: number
  estimatedGasUSD?: number
  finnalGet?: number
}

export default defineComponent({
  name: 'RouteResult',
  emits: ['update'],
  setup(props, ctx) {
    const swapStore = useSwapStore()
    const walletStore = useWalletStore()
    const globalStore = useGlobalConfigStore()

    const dexesHook = useDexes()
    const blockNumber = ref()

    const swapParams = computed<swapParamsType | null>(() => {
      if (swapStore.tokenReady) {
        return {
          fromTokenAddress: swapStore.tokens[0]?.address as string,
          toTokenAddress: swapStore.tokens[1]?.address as string,
          amount: parseUnits(String(swapStore.sellAmount), swapStore.tokens[0]?.decimals),
          fromAddress: walletStore.address,
          slippage: globalStore.swapSetting.slippage,
          fee: 0
        }
      } else {
        return null
      }
    })

    const AutoChooseDexName = ref<string | undefined>()
    const UserChooseDexName = ref<string | undefined>()
    const chooseDexName = computed(() => UserChooseDexName.value || AutoChooseDexName.value)
    const currentDex = computed(() =>
      dexesHook.list.value.find(e => e.name === chooseDexName.value)
    )
    let routeList = ref<routeCollectionType[]>([])
    const resultList = ref<((routeResultType & extendType) | null)[]>()

    const currentRoute = computed(() =>
      resultList.value?.length
        ? resultList.value.find(e => e?.dex.name === chooseDexName.value)
        : undefined
    )

    watch(
      () => currentRoute.value,
      () => {
        ctx.emit('update', currentRoute.value)
      }
    )

    const routeResultReady = computed(
      () =>
        resultList.value?.length &&
        swapParams.value &&
        swapStore.priceStore[swapParams.value.toTokenAddress] &&
        swapStore.feeData?.formatted.gasPrice
    )

    watch(
      () => routeResultReady.value,
      ready => {
        globalStore.btnLock = !ready
      },
      {
        immediate: true
      }
    )

    watch(
      [
        () => routeList.value,
        () => swapStore.priceStore,
        () => swapStore.mainTokenInfo,
        () => swapStore.feeData
      ],
      () => {
        swapStore.getTokenPrice(['0x0000000000000000000000000000000000000000'], () => {
          resultList.value = routeList.value
            .filter(e => e.status === 0 || (e.status === 1 && e.result))
            .map(e => (e.status === 0 ? null : (e.result as routeResultType)))
            .map(item => {
              if (item === null) return null

              const priceUSD = swapParams.value?.toTokenAddress
                ? swapStore.priceStore[swapParams.value.toTokenAddress]
                : undefined
              const estimatedGasUSD =
                swapStore.feeData?.formatted.gasPrice && swapStore.mainTokenInfo?.decimals
                  ? formatUnits(
                      BigNumber.from(swapStore.feeData.formatted.gasPrice).mul(item.estimatedGas),
                      swapStore.mainTokenInfo?.decimals
                    ) * swapStore.priceStore['0x0000000000000000000000000000000000000000']
                  : undefined

              return {
                ...item,
                priceUSD,
                estimatedGasUSD,
                finnalGet:
                  priceUSD && estimatedGasUSD
                    ? priceUSD * formatUnits(item.toTokenAmount, item.toToken.decimals) -
                      estimatedGasUSD
                    : 0
              }
            })
            .sort((l, r) => ((l?.finnalGet || 0) > (r?.finnalGet || 0) ? -1 : 1))
          if (routeResultReady.value && resultList.value[0]) {
            AutoChooseDexName.value = resultList.value[0].dex.name
            console.log('Auto set BEST dex=', AutoChooseDexName.value)
          }
        })
      },
      {
        deep: true
      }
    )

    const checkCurrentAllowance = async () => {
      if (!globalStore.btnLoading) {
        globalStore.btnLock = true
        globalStore.btnLoading = true
        const allowance = await currentDex.value?.checkAllowance()
        globalStore.btnLoading = false
        globalStore.btnLock = false
        console.log('update allowance=', allowance)
        swapParams.value &&
          (swapStore.allowanceStore[swapParams.value.fromTokenAddress] = allowance || 0)
      }
    }

    watch(
      [() => currentRoute.value, () => swapStore.tokens],
      ([currentRoute, tokens], [oldDex, oldTokens]) => {
        if (
          currentRoute?.dex.name !== oldDex?.dex.name ||
          !oldTokens ||
          tokens[0]?.address !== oldTokens[0]?.address
        ) {
          nextTick(checkCurrentAllowance)
        }
      }
    )

    // eventBus
    const unsubscribe = bus.on((event: string, payload: any) => {
      switch (event) {
        case 'Approve':
          if (currentDex.value) {
            globalStore.btnLoading = true
            swapStore.stateStack[swapStore.stateStack.length - 1].label = 'Waiting for approving'
            currentDex.value?.requestAllowance(payload).then(res => {
              globalStore.btnLoading = false
              checkCurrentAllowance()
            })
          }
          break
        case 'Swap':
          if (currentDex.value) {
            // return (globalStore.notice.title = 'test')
            globalStore.btnLoading = true

            currentDex.value
              ?.doExchange()
              .then(swapTransaction => {
                console.log('swapTransaction=', swapTransaction)
                if (swapTransaction) {
                  prepareSendTransaction({
                    request: swapTransaction
                  })
                    .then(config => {
                      console.log('config=', config)
                      globalStore.btnLoading = false

                      sendTransaction(config)
                        .then(res => {
                          console.log('res=', res)
                          if (res) {
                            globalStore.startNotice(
                              'Comfirming Transaction',
                              walletStore.explorerUrl
                                ? `${walletStore.explorerUrl}/tx/${res.hash}`
                                : undefined
                            )
                            res.wait().then(() => {
                              console.log('swap success')
                              globalStore.successNotice(
                                currentRoute.value
                                  ? `Swap ${formatCurrency(
                                      formatUnits(
                                        currentRoute.value.fromTokenAmount,
                                        currentRoute.value.fromToken.decimals
                                      ),
                                      4
                                    )} ${currentRoute.value.fromToken.symbol} for ${formatCurrency(
                                      formatUnits(
                                        currentRoute.value.toTokenAmount,
                                        currentRoute.value.toToken.decimals
                                      ),
                                      4
                                    )} ${currentRoute.value.toToken.symbol}`
                                  : 'Success',
                                walletStore.explorerUrl
                                  ? `${walletStore.explorerUrl}/tx/${res.hash}`
                                  : undefined
                              )
                              // update balance
                              swapParams.value?.fromTokenAddress &&
                                swapStore.updateTokenBalance({
                                  token: swapParams.value.fromTokenAddress
                                })
                              swapParams.value?.toTokenAddress &&
                                swapStore.updateTokenBalance({
                                  token: swapParams.value.toTokenAddress
                                })
                            })
                          } else {
                            globalStore.failNotice('Failed')
                          }
                        })
                        .catch(err => {
                          console.warn(err)
                          globalStore.failNotice(`${err.code || 'Failed'}`)
                          globalStore.btnLoading = false
                        })
                    })
                    .catch(err => {
                      console.warn(err)
                      globalStore.failNotice(`${err.code || 'Failed'}`)
                      globalStore.btnLoading = false
                    })
                } else {
                  console.warn('Swap fail: with out swapTransaction')
                  globalStore.failNotice(`Swap fail: with out swapTransaction`)
                  globalStore.btnLoading = false
                }
              })
              .catch(err => {
                globalStore.btnLoading = false
                globalStore.failNotice(`${err.code || 'Failed'}`)
              })
          }
          break
        default:
      }
    })

    let timer: any = null
    timer = setInterval(() => fetchBlockNumber().then(num => (blockNumber.value = num)), 20000)

    watch(
      () => blockNumber.value,
      (blockNumber, old) => {
        blockNumber && old && update()
      }
    )

    const resultCompleted = ref(false)
    // init
    watch(
      () => swapParams.value,
      swapParams => {
        if (swapParams) {
          if (swapStore.paramsReady) {
            console.log('RouteResult init:', swapParams)
            dexesHook.init(swapParams)
            routeList.value = []
            resultList.value = []
            AutoChooseDexName.value = undefined
            UserChooseDexName.value = undefined
            swapStore.getFeeData(() => {
              routeList = dexesHook.fetchRoute()
              console.log(11111111111, routeList)
              const unwatch = watch(
                () => routeList.value,
                () => {
                  if (!routeList.value.find(e => e.status === 0)) {
                    resultCompleted.value = true
                    unwatch()
                  }
                },
                {
                  deep: true
                }
              )
            })
          }
        }
      },
      {
        immediate: true
      }
    )

    // update
    const update = () => {
      swapStore.getTokenPrice(swapStore.tokens.filter(e => e?.address).map(e => e!.address))
      swapStore.getFeeData(() => {
        if (swapParams.value && swapStore.paramsReady) {
          routeList = dexesHook.fetchRoute()
          console.log(22222222)
        }
      }, true)
    }

    // pause update
    watch(
      () => globalStore.notice.title,
      hasTitle => {
        console.log(hasTitle)
        timer && clearInterval(timer)
        if (!hasTitle) {
          timer = setInterval(() => fetchBlockNumber().then(num => (blockNumber.value = num)), 5000)
        } else if (globalStore.notice.state === 'pending') {
          console.warn('Pause update, until transaction done')
        }
      }
    )

    onBeforeUnmount(() => {
      ctx.emit('update', undefined)
      globalStore.btnLock = false
      unsubscribe()
      timer && clearInterval(timer)
      routeList.value = []
      resultList.value = []
    })

    const showRoutes = ref(true)

    const output = ref()
    watch(
      [() => currentRoute.value, () => swapStore.feeData],
      ([routeResult, feeData]) => {
        const mainTokenPrice = swapStore.priceStore['0x0000000000000000000000000000000000000000']
        if (routeResult && feeData && mainTokenPrice) {
          const fromTokenAmount =
            routeResult?.fromTokenAmount && routeResult.fromToken
              ? formatUnits(routeResult.fromTokenAmount, routeResult.fromToken.decimals)
              : 0
          const toTokenAmount =
            routeResult?.toTokenAmount && routeResult.toToken
              ? formatUnits(routeResult.toTokenAmount, routeResult.toToken.decimals)
              : 0

          output.value = {
            fromTokenAmount,
            toTokenAmount,
            priceImpact:
              100 -
              ((toTokenAmount * swapStore.priceStore[routeResult.toToken.address]) /
                (fromTokenAmount * mainTokenPrice)) *
                100,
            toTokenAmountAfter: toTokenAmount
              ? formatCurrency((toTokenAmount * (100 - globalStore.swapSetting.slippage)) / 100, 4)
              : 0,
            estimatedGasUSD:
              formatUnits(
                BigNumber.from(feeData.formatted.gasPrice).mul(routeResult.estimatedGas),
                swapStore.mainTokenInfo?.decimals
              ) * mainTokenPrice,
            gasPrice: formatUnits(
              BigNumber.from(feeData.formatted.gasPrice),
              swapStore.mainTokenInfo?.decimals
            )
          }
        } else {
          output.value = undefined
        }
      },
      {
        deep: true
      }
    )

    const handleChooseDex = (item: routeResultType) => {
      UserChooseDexName.value = item.dex.name
      showRoutes.value = false
    }

    const unwatchComplte = watch(
      () => resultCompleted.value,
      () => {
        if (resultCompleted.value) {
          showRoutes.value = false
          unwatchComplte()
        }
      }
    )

    return {
      swapParams,
      routeList,
      resultList,
      currentRoute,
      chooseDexName,
      showRoutes,
      output,
      handleChooseDex,
      resultCompleted
    }
  },
  render() {
    return (
      <div class="flex flex-col">
        {!this.resultCompleted ? (
          <div class=" flex pb-4 items-center">
            <div class="flex-1">
              <div class="text-xs mb-2 text-color2">Fetching the best route for your swaps</div>
              <USkeleton class="h-6 w-[55%] float-left" />
            </div>
            <div class="h-10 transform w-10 scale-60 relative">
              <Loading />
            </div>
          </div>
        ) : null}
        {this.resultList && this.resultCompleted && this.currentRoute && this.output ? (
          <div class="mb-4">
            {this.resultList[0]?.dex.name === this.chooseDexName ? (
              <div class={'flex text-xs mb-1 text-color3 text-[#BD983D] leading-4 items-center'}>
                <BestFilled class="h-3 mr-1 w-3" /> Best Swap
              </div>
            ) : this.currentRoute.finnalGet ? (
              <span class="text-error">
                {fixFloat2(
                  ((this.currentRoute.finnalGet - (this.resultList[0]?.finnalGet || 0)) /
                    Math.abs(this.resultList[0]?.finnalGet || 0)) *
                    100
                )}
                %
              </span>
            ) : null}
            <div class="flex items-center">
              <div class="flex-1 font-700 text-lg">{`1 ${
                this.currentRoute.fromToken?.symbol
              } = ${formatCurrency(this.output.toTokenAmount / this.output.fromTokenAmount, 4)} ${
                this.currentRoute.toToken.symbol
              }`}</div>
              <div
                class="cursor-pointer flex text-xs text-color3 items-center select-none"
                onClick={() => (this.showRoutes = !this.showRoutes)}
              >
                Other routes
                <ArrowDownOutlined
                  class={
                    'h-4 w-4 transform transition-all ml-1' + (this.showRoutes ? ' rotate-180' : '')
                  }
                />
              </div>
            </div>
          </div>
        ) : null}
        {!this.showRoutes && (
          <Board class="-mx-4" output={this.output} routeResult={this.currentRoute} />
        )}
        {this.showRoutes && this.resultList && (
          <Routes
            class="-mx-4"
            resultList={this.resultList}
            chooseDexName={this.chooseDexName}
            onChoose={this.handleChooseDex}
          />
        )}
      </div>
    )
  }
})
