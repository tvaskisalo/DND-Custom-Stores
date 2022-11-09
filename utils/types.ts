export type LoginRequest = {
  password: string,
  username: string
}
export type Token = {
  username: string,
  id: string
}
export type RarityDefinition = {
  rarity: string,
  enchantmentTiers: number[],
  enchantmentCount: number
}
//This is an item that has certain fields defined. Used for item generation
export type CompleteItem = {
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
  weapon: boolean,
  weaponType?: string,
  armor: boolean,
  armorType?: string,
  armorClass?: string,
  strength?: string,
  stealth?: string
}
//This is an enchantment that has certain fields defined. Used for item generation
export type CompleteEnchantment = {
  name: string,
  games?: string[],
  tier: number,
  damage?: string
  damageTypes?: string[],
  description: string
}
export type NewGameRequest = {
  name: string,
  enchantments?: string[]
  rarities?: RarityDefinition[]
}
export type NewStoreRequest = {
  name: string,
  itemTypeProbabilities: ItemTypeProbability[],
  games?: string[]
}
export type NewItemRequest = {
  name: string,
  games?: string[],
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
export type NewEnchantRequest = {
  name: string,
  games?: string[],
  tier?: number,
  damage?: string
  damageTypes?: string[],
  description?: string
}
export type UpdateGameParams = {
  id: string,
  name?: string,
  enchantments?: string[]
  rarities?: RarityDefinition[]
}
export type UpdateStoreParams = {
  id: string,
  name?: string,
  itemTypeProbabilities?: ItemTypeProbability[],
  games?: string[]
}
export type UpdateItemParams = {
  id: string,
  name?: string,
  games?: string[],
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
export type UpdateEnchantParams = {
  id: string,
  games?: string[],
  name?: string
  tier?: number,
  damage?: string
  damageTypes?: string[],
  description?: string
}

export type GetStoresParams = {
  game: string
}
export type GetItemsParams = {
  name: string
}
export type GetEnchantmentsParams = {
  game: string
}

export type ItemTypeProbability = {
  rarity: string,
  probability: number
}
export type ItemTypeRange = {
  min: number,
  max: number,
  rarity: string
}