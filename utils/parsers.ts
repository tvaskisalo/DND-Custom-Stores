// Disabling no explicit any due to this being type check and avoding code with unknown type
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthenticationError } from 'apollo-server-express'
import { User } from '../schemas/user'
import { GetItemsParams, GetStoresParams, itemRarityProbability, UpdateGameParams, UpdateItemParams, UpdateStoreParams, LoginRequest, NewGameRequest, NewItemRequest, NewStoreRequest, Token, RarityDefinition, GetEnchantmentsParams, UpdateEnchantParams, NewEnchantRequest } from './types'

const isString = (str: unknown): str is string => {
  return typeof str === 'string' || str instanceof String
}

const isNumber = (num: unknown): num is number => {
  return typeof num === 'number'
}

const isBoolean = (bool: unknown): bool is boolean => {
  return typeof bool === 'boolean'
}

const parseBoolean = (bool: unknown): boolean => {
  if (bool === undefined || !isBoolean(bool)) {
    throw new Error(`Invalid boolean value: ${bool}`)
  }
  return bool
}

const parseString = (str: unknown): string => {
  if (!str || !isString(str)) {
    throw new Error('Invalid or missing string ' + str)
  }
  return str
}

const parseNumber = (num: unknown): number => {
  if (num === undefined || !isNumber(num)) {
    throw new Error('Invalid or missing number' + num)
  }
  return num
}

export const toLoginRequest = (reqData: any): LoginRequest => {
  const loginRequest: LoginRequest = {
    password: parseString(reqData.password),
    username: parseString(reqData.username)
  }
  return loginRequest
}

export const toToken = (reqData: any): Token => {
  const token: Token = {
    username: parseString(reqData.username),
    id: parseString(reqData.id)
  }
  return token
}

export const toUpdateGameParams = (reqData: any): UpdateGameParams => {
  const updateRequest: UpdateGameParams =  {
    id: parseString(reqData.id),
    name: reqData.name ? parseString(reqData.name): undefined,
    enchantments: reqData.enchantments ? parseStringArray(reqData.enchantments) : undefined,
    rarities: reqData.rarities ? parseRarityDefinitions(reqData.rarities) : undefined
  }
  return updateRequest
}

export const toUpdateStoreParams = (reqData: any): UpdateStoreParams => {
  const updateRequest: UpdateStoreParams = {
    id: parseString(reqData.id),
    name: reqData.name ? parseString(reqData.name): undefined,
    itemRarityProbabilities: reqData.itemRarityProbabilities ? parseitemRarityProbabilities(reqData.itemRarityProbabilities) : undefined,
    games: reqData.games ? parseStringArray(reqData.games) : undefined,
    capacity: reqData.capacity ? parseNumber(reqData.capacity): undefined,
  }
  return updateRequest
}

export const toUpdateItemParams = (reqData: any): UpdateItemParams => {
  const updateRequest: UpdateItemParams = {
    id: parseString(reqData.id),
    name: reqData.name ? parseString(reqData.name) : undefined,
    games: reqData.games ? parseStringArray(reqData.games) : undefined,
    storepool: reqData.storepool ? parseStringArray(reqData.storepool) : undefined,
    material: reqData.material ? parseString(reqData.material) : undefined,
    baseCost: reqData.baseCost ? parseNumber(reqData.baseCost) : undefined,
    weight: reqData.weight ? parseNumber(reqData.weight) : undefined,
    properties: reqData.properties ? parseString(reqData.properties) : undefined,
    damage: reqData.damage ? parseString(reqData.damage) : undefined,
    damageTypes: reqData.damageTypes ? parseStringArray(reqData.damageTypes) : undefined,
    baseItem: reqData.baseItem !== undefined ? parseBoolean(reqData.baseItem) : undefined,
    unique: reqData.unique !== undefined ? parseBoolean(reqData.unique) : undefined,
    weapon: reqData.weapon !== undefined ? parseBoolean(reqData.weapon) : undefined,
    weaponType: reqData.weaponType ? parseString(reqData.weaponType) : undefined,
    armor: reqData.armor !== undefined ? parseBoolean(reqData.armor) : undefined,
    armorType: reqData.armorType ? parseString(reqData.armorType) : undefined,
    armorClass: reqData.armorClass ? parseString(reqData.armorClass) : undefined,
    strength: reqData.strength ? parseString(reqData.strength) : undefined,
    stealth: reqData.stealth ? parseString(reqData.stealth) : undefined
  }
  return updateRequest
}

export const toUpdateEnchantmentParams = (reqData: any): UpdateEnchantParams => {
  const updateRequest: UpdateEnchantParams = {
    id: parseString(reqData.id),
    games: reqData.games ? parseStringArray(reqData.games) : undefined,
    name: reqData.name ? parseString(reqData.name) : undefined,
    tier: reqData.tier ? parseNumber(reqData.tier) : undefined,
    damage: reqData.damage ? parseString(reqData.damage) : undefined,
    damageTypes: reqData.damageTypes ? parseStringArray(reqData.damageTypes) : undefined,
    description: reqData.description ? parseString(reqData.description) : undefined,
    weapon: reqData.weapon !== undefined ? parseBoolean(reqData.weapon): undefined,
    armor: reqData.armor !== undefined ? parseBoolean(reqData.armor) : undefined,
    stealth: reqData.stealth ? parseString(reqData.stealth) : undefined,
    strength: reqData.strength ? parseString(reqData.strength) : undefined,
  }
  return updateRequest
}

export const toNewEnchantmentRequest = (reqData: any): NewEnchantRequest => {
  const request: NewEnchantRequest = {
    games: reqData.games ? parseStringArray(reqData.games) : undefined,
    name: parseString(reqData.name),
    tier: reqData.tier ? parseNumber(reqData.tier) : undefined,
    damage: reqData.damage ? parseString(reqData.damage) : undefined,
    damageTypes: reqData.damageTypes ? parseStringArray(reqData.damageTypes) : undefined,
    description: reqData.description ? parseString(reqData.description) : undefined,
    weapon: reqData.weapon !== undefined ? parseBoolean(reqData.weapon): undefined,
    armor: reqData.armor !== undefined ? parseBoolean(reqData.armor) : undefined,
    stealth: reqData.stealth ? parseString(reqData.stealth) : undefined,
    strength: reqData.strength ? parseString(reqData.strength) : undefined,
  }
  return request
}

export const toNewGameRequest = (reqData: any): NewGameRequest => {
  const newGameRequest: NewGameRequest = {
    name: parseString(reqData.name),
    enchantments: reqData.enchantments ? parseStringArray(reqData.enchantments) : undefined,
    rarities: reqData.rarities ? parseRarityDefinitions(reqData.rarities) : undefined
  }
  return newGameRequest
}

const parseStringArray = (strArr: unknown): string[] => {
  if (!strArr || !Array.isArray(strArr)) {
    throw new Error('Incorrect or missing string array ' +strArr)
  }
  const returnValue: string[] = strArr.map((str) => parseString(str))
  if (!returnValue) {
    throw new Error('Incorrect or missing string array')
  }
  return returnValue
}

const parseNumberArray = (numArr: unknown): number[] => {
  if (!numArr || !Array.isArray(numArr)) {
    throw new Error('Invalid or missing number array '+numArr)
  }
  const returnValue: number[] =numArr.map(number => parseNumber(number))
  if (!returnValue) {
    throw new Error('Invalid or missing number array')
  }
  return returnValue
}

export const toStringArray = (reqData: any): string[] => {
  const strArr = parseStringArray(reqData)
  return strArr
}

export const toGetStoresParams = (reqData: any): GetStoresParams => {
  const params: GetStoresParams = {
    game: parseString(reqData.game)
  }
  return params
}
export const toId = (reqData: any): string => {
  return parseString(reqData.id)
}

export const toGetItemsParams = (reqData: any): GetItemsParams => {
  const params: GetItemsParams = {
    name: parseString(reqData.store)
  }
  return params
}

export const toGetEnchantmentsParams = (reqData: any): GetEnchantmentsParams => {
  const params: GetEnchantmentsParams = {
    game: parseString(reqData.game)
  }
  return params
}

export const toName = (reqData: any): string => {
  return parseString(reqData.name)
}

export const toStore = (reqData: any): string => {
  return parseString(reqData.store)
}
export const toNewItemRequest = (reqData: any): NewItemRequest => {
  const newItemRequest: NewItemRequest = {
    name: parseString(reqData.name),
    games: reqData.games ? parseStringArray(reqData.games) : undefined,
    storepool: reqData.storepool ? parseStringArray(reqData.storepool) : undefined,
    material: reqData.material ? parseString(reqData.material) : undefined,
    baseCost: reqData.baseCost ? parseNumber(reqData.baseCost) : undefined,
    weight: reqData.weight ? parseNumber(reqData.weight) : undefined,
    properties: reqData.properties ? parseString(reqData.properties) : undefined,
    damage: reqData.damage ? parseString(reqData.damage) : undefined,
    damageTypes: reqData.damageTypes ? parseStringArray(reqData.damageTypes) : undefined,
    baseItem: reqData.baseItem !== undefined ? parseBoolean(reqData.baseItem) : undefined,
    unique: reqData.unique !== undefined ? parseBoolean(reqData.unique) : undefined,
    weapon: reqData.weapon !== undefined ? parseBoolean(reqData.weapon) : undefined,
    weaponType: reqData.weaponType ? parseString(reqData.weaponType) : undefined,
    armor: reqData.armor !== undefined ? parseBoolean(reqData.armor) : undefined,
    armorType: reqData.armorType ? parseString(reqData.armorType) : undefined,
    armorClass: reqData.armorClass ? parseString(reqData.armorClass) : undefined,
    strength: reqData.strength ? parseString(reqData.strength) : undefined,
    stealth: reqData.stealth ? parseString(reqData.stealth) : undefined
  }
  return newItemRequest
}

export const toNewStoreRequest = (reqData: any): NewStoreRequest => {
  const newStoreRequest: NewStoreRequest = {
    name: parseString(reqData.name),
    itemRarityProbabilities: parseitemRarityProbabilities(reqData.itemRarityProbabilities),
    games: reqData.games ? parseStringArray(reqData.games) : undefined,
    capacity: reqData.capacity ? parseNumber(reqData.capacity) : undefined
  }
  return newStoreRequest
}

export const parseitemRarityProbabilities = (data: unknown): itemRarityProbability[] => {
  if (!data || !Array.isArray(data)) {
    throw new Error('Incorrect or missing itemRarityProbabilities')
  }
  const returnValue: itemRarityProbability[] = data.map((itemT: unknown) => parseitemRarityProbability(itemT))
  if (!returnValue) {
    throw new Error('Incorrect or missing itemRarityProbabilities')
  }
  let sum = 0
  returnValue.forEach(({ probability }) => {
    sum += probability
  })
  if (sum !== 100) {
    throw new Error('The sum of probablities is incorrect ' + sum)
  }
  return returnValue
}

export const parseitemRarityProbability = (reqData: any): itemRarityProbability => {
  if (!reqData || !reqData.rarity || !isString(reqData.rarity) || !reqData.probability || !isNumber(reqData.probability)) {
    throw new Error('Incorrect or missing itemRarityProbability '+reqData)
  }
  return {
    rarity: parseString(reqData.rarity),
    probability: parseNumber(reqData.probability)
  }
}
export const parseRarityDef = (data: any): RarityDefinition => {
  if (!data || !data.rarity || !data.enchantmentTiers ||!Array.isArray(data.enchantmentTiers) || !data.enchantmentCount) {
    throw new Error('Invalid or missing rarityDefinition')
  }
  return {
    rarity: parseString(data.rarity),
    enchantmentTiers: parseNumberArray(data.enchantmentTiers),
    enchantmentCount: parseNumber(data.enchantmentCount)
  }
}

export const  parseRarityDefinitions = (data: unknown): RarityDefinition[] => {
  if (!data || !Array.isArray(data)) {
    throw new Error('Incorrect or missing itemRarityProbabilities')
  }
  const returnValue: RarityDefinition[] = data.map((itemT: unknown) => parseRarityDef(itemT))
  if (!returnValue) {
    throw new Error('Incorrect or missing itemRarityProbabilities')
  }
  return returnValue
}

export const getUser = async (context: unknown) => {
  const token = toToken(context)
  if (!token) {
    throw new AuthenticationError('Invalid token')
  }
  return await User.findOne({ id: token.id })
}