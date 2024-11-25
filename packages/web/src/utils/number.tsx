import { ethers, BigNumber } from 'ethers'

export const fixFloat2 = (value: number) => {
  return Math.round(value * 100) / 100
}

export const fixFloat4 = (value: number) => {
  return Math.round(value * 10000) / 10000
}

export const fixFloat6 = (value: number) => {
  return Math.round(value * 1000000) / 1000000
}

export const fixFloat8 = (value: number) => {
  return Math.round(value * 100000000) / 100000000
}

export const formatBigNumber = (value: number | string) => {
  const data = Number(value)
  if (isNaN(data)) {
    return '--'
  }
  return data > 100000000
    ? `${(data / 100000000).toFixed(1).replace(/\.0$/, '')}B`
    : data > 1000000
    ? `${(data / 1000000).toFixed(1).replace(/\.0$/, '')}M`
    : data > 1000
    ? `${(data / 1000).toFixed(1).replace(/\.0$/, '')}K`
    : `${data.toFixed(2).replace(/\.00$/, '')}`
}

const fixFloatE = (float: string) => {
  if (float.split && float.indexOf('e-') !== -1) {
    const [numberStr, floatNumber] = float.split('e-')
    const [intStr, floatStr] = numberStr.split('.')
    const zeroStr = new Array(Number(floatNumber) - intStr.length).fill(0).join('')
    return `0.${zeroStr}${intStr}${floatStr || ''}`
  } else {
    return float
  }
}

const formatCore = (
  value: number | string | null | undefined,
  formatWithJSX?: boolean,
  floatLength?: 2 | 4 | 6 | 8
) => {
  let result = '0'
  if (!isNaN(Number(value))) {
    if (Number(value) > 1) {
      result = String(fixFloat4(Number(value)))
      if (result.split('.').length === 2) {
        const float4NumArr = Number(result).toLocaleString('en-US').split('.')

        if (float4NumArr[0].length > 3) {
          result = fixFloat2(Number(value)).toLocaleString('en-US')
        } else {
          result = `${float4NumArr[0]}.${result.split('.')[1]}`
        }
      } else {
        result = Number(result + '.0').toLocaleString('en-US')
      }
    } else {
      const numArr = fixFloatE(String(value)).split('.')
      if (numArr.length === 2) {
        const regResult = numArr[1].match(/^(0+)/)
        if (regResult && regResult.index === 0) {
          if (regResult[0].length > 5) {
            // effectiveFixed
            return effectiveFixed(Number(value), (floatLength || 8) - 2, formatWithJSX)
          }
        }
      }
      switch (floatLength) {
        case 2:
          result = fixFloat2(Number(value)).toString()
          break
        case 4:
          result = fixFloat4(Number(value)).toString()
          break
        case 6:
          result = fixFloat6(Number(value)).toString()
          break
        default:
          // 8
          result = fixFloat8(Number(value)).toString()
      }
      // return effectiveFixed(Number(value), 4, formatWithJSX)
    }
  }

  return fixFloatE(result)
}

export const parseCurrency = (input: string) => {
  const nums = input.replace(/,/g, '').trim()
  if (/^\d+(\.(\d+)?)?$/.test(nums)) return Number(nums)
  return nums === '' ? null : Number.NaN
}

export const formatCurrency = (
  value: number | string | null | undefined,
  floatLength?: 2 | 4 | 6 | 8
) => {
  return formatCore(value, false, floatLength) as string
}

export const formatCurrencyToJSX = (
  value: number | string | null | undefined,
  floatLength?: 2 | 4 | 6 | 8
) => {
  return formatCore(value, true, floatLength)
}

export const parseCurrencyWithUnit = (input: string) => {
  const nums = input.replace(/(,|\$|\s)/g, '').trim()
  if (/^\d+(\.(\d+)?)?$/.test(nums)) return Number(nums)
  return nums === '' ? null : Number.NaN
}

export const formatCurrencyWithUnit = (
  value: number | string | null | undefined,
  formatWithJSX?: boolean,
  floatLength?: 2 | 4 | 6 | 8
) => {
  return `$${formatCore(value, formatWithJSX, floatLength)}`
}

export const formatCurrencyWithUnitToJSX = (
  value: number | string | null | undefined,
  floatLength?: 2 | 4 | 6 | 8
) => {
  return <>${formatCurrencyToJSX(value, floatLength)}</>
}

export const formatUnits = (value: ethers.BigNumberish | string, decimal?: ethers.BigNumberish) =>
  Number(
    ethers.utils.formatUnits(BigNumber.isBigNumber(value) ? value : BigNumber.from(value), decimal)
  )

export const parseUnits = (value: string, decimal?: number | string) => {
  let theValue = value
  if (typeof decimal === 'number') {
    theValue = Number(value).toFixed(decimal)
  }
  return ethers.utils.parseUnits(theValue, decimal).toString()
}

export const effectiveFixed = (floatNumber: number, digit = 4, formatWithJSX?: boolean) => {
  if (floatNumber) {
    const numArr = fixFloatE(String(floatNumber)).split('.')
    if (numArr.length === 2) {
      const regResult = numArr[1].match(/^(0+)/)
      if (regResult && regResult.index === 0) {
        let fixedStr = numArr[1].slice(regResult[0].length, regResult[0].length + digit + 1)
        if (fixedStr.length > 1) {
          fixedStr = Math.round(Number(fixedStr) / 10).toString()
        }

        // formatWithJSX
        // && regResult[0].length > 4
        if (formatWithJSX === true && regResult[0].length > 5) {
          return (
            <>
              {numArr[0]}.0
              <span class="transform top-1 scale-80 inline-block relative">
                {regResult[0].length}
              </span>
              {fixedStr}
            </>
          )
        } else {
          return `${numArr[0]}.${regResult[0]}${fixedStr}`
        }
      } else {
        let fixedStr = numArr[1].slice(0, digit + 1)
        if (fixedStr.length > digit) {
          fixedStr = Math.round(Number(fixedStr) / 10).toString()
        }

        return `${numArr[0]}.${fixedStr}`
      }
    }

    return floatNumber.toString()
  } else {
    return '0'
  }
}
