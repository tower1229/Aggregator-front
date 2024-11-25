import { getContract, erc20ABI, fetchSigner } from '@wagmi/core'

export const erc20Contract = async (address: string) => {
  const signer = await fetchSigner()
  return getContract({
    address,
    abi: erc20ABI,
    signerOrProvider: signer as any
  }) as any
}
