export type LoginRequest = {
  password: string,
  username: string
}
export type Token = {
  username: string,
  id: string
}
export type NewGameRequest = {
  name: string
}
export type NewStoreRequest = {
  name: string,
  itemTypeProbabilities: ItemTypeProbability[],
  game?: string
}
export type GetStoresParams = {
  game: string
}
export type GetItemsParams = {
  name: string
}
export type NewItemRequest = {
  name: string,
  storepool?: string[],
  material?: string,
  baseCost?: number,
  weight?: number,
  properties?: string,
  damage?: string,
  damageTypes?: string[],
  baseItem: boolean,
  unique: boolean
}
export type ItemTypeProbability = {
  rarity: string,
  probability: number
}