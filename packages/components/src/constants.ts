export type SelectOption = {
  label: string
  value: string | number
  disabled?: boolean
}

/**
 * Default Comer skills
 */
export const DEFAULT_SKILLS: SelectOption[] = [
  'Default',
  'Developer',
  'UI/UE',
  'Designer',
  'Product Manager',
  'Project Manager',
  'Dev Ops',
  'Marketing',
  'Content Editor',
  'Moderator',
  'Promoter',
  'Hyper',
  'Community Manager',
  'Solidity',
  'Backend Engineer',
  'Front Engineer'
].map(item => ({
  label: item,
  value: item
}))

export const DEFAULT_STARTUP_TAGS: SelectOption[] = [
  'DCO',
  'WEB3',
  'NFT',
  'DEFI',
  'CRYPTO',
  'PASSIVE INCOME',
  'LEND',
  'DEX',
  'STAKER',
  'GAMEFI',
  'NODE',
  'COMMUNITY'
].map(item => ({
  label: item,
  value: item
}))
