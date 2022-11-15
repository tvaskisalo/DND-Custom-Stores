export type SubmitEvent = (e:React.SyntheticEvent) => Promise<void>
export type Field = {
  name: string
  type: string
  value: string | undefined,
  onChange: (e: unknown) => void
}
export type itemRarityProbability = {
  rarity: string,
  probability: number
}
export type RarityDefinition = {
  rarity: string,
  enchantmentTiers: number[]
}
export type Item = {
  name: string,
  games?: string[],
  rarity?: string
  storepool?: string[],
  material?: string,
  baseCost?: number,
  weight?: number,
  properties?: string,
  damage?: string,
  damageTypes?: string[],
  baseItem?: boolean,
  unique?: boolean,
  weapon?: boolean,
  weaponType?: string,
  armor?: boolean,
  armorType?: string,
  armorClass?: string,
  strength?: string,
  stealth?: string
}