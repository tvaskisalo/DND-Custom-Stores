export type SubmitEvent = (e:React.SyntheticEvent) => Promise<void>
export type Field = {
  name: string
  type: string
  value: string | undefined,
  onChange: (e: unknown) => void
}
export type ItemTypeProbability = {
  rarity: string,
  probability: number
}
export type RarityDefinition = {
  rarity: string,
  enchantmentTiers: number[]
}