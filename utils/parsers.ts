// Disabling no explicit any due to this being type check and avoding code with unknown type
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthenticationError } from 'apollo-server-express'
import { User } from '../schemas/user'
import { GetItemsParams, GetStoresParams, ItemTypeProbability, UpdateGameParams, UpdateItemParams, UpdateStoreParams, LoginRequest, NewGameRequest, NewItemRequest, NewStoreRequest, Token } from './types'

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
  }
  return updateRequest
}

export const toUpdateStoreParams = (reqData: any): UpdateStoreParams => {
  const updateRequest: UpdateStoreParams = {
    id: parseString(reqData.id),
    name: reqData.name ? parseString(reqData.name): undefined,
    itemTypeProbabilities: reqData.itemTypeProbabilities ? parseItemTypeProbabilities(reqData.itemTypeProbabilities) : undefined,
    games: reqData.games ? parseStringArray(reqData.games) : undefined
  }
  return updateRequest
}

export const toUpdateItemParams = (reqData: any): UpdateItemParams => {
  const updateRequest: UpdateItemParams = {
    id: parseString(reqData.id),
    name: reqData.name ? parseString(reqData.name) : undefined,
    storepool: reqData.storepool ? parseStringArray(reqData.storepool) : undefined,
    material: reqData.material ? parseString(reqData.material) : undefined,
    baseCost: reqData.baseCost ? parseNumber(reqData.baseCost) : undefined,
    weight: reqData.weight ? parseNumber(reqData.weight) : undefined,
    properties: reqData.properties ? parseString(reqData.properties) : undefined,
    damage: reqData.damage ? parseString(reqData.damage) : undefined,
    damageTypes: reqData.damageTypes ? parseStringArray(reqData.damageTypes) : undefined,
    baseItem: reqData.baseItem !== undefined ? parseBoolean(reqData.baseItem) : undefined,
    unique: reqData.unique !== undefined ? parseBoolean(reqData.unique) : undefined
  }
  return updateRequest
}

export const toNewGameRequest = (reqData: any): NewGameRequest => {
  const newGameRequest: NewGameRequest = {
    name: parseString(reqData.name)
  }
  return newGameRequest
}

const parseStringArray = (strArr: unknown): string[] => {
  if (!strArr || !Array.isArray(strArr)) {
    throw new Error('Incorrect or missing string array ' +strArr)
  }
  const returnValue: string[] = strArr.map((str) => parseString(str))
  if (!returnValue) {
    throw new Error('Incorrect or missing string array '+strArr)
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

export const toGetItemsParams = (reqData: any): GetItemsParams => {
  const params: GetItemsParams = {
    name: parseString(reqData.store)
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
    storepool: reqData.storepool ? parseStringArray(reqData.storepool) : undefined,
    material: reqData.material ? parseString(reqData.material) : undefined,
    baseCost: reqData.baseCost ? parseNumber(reqData.baseCost) : undefined,
    weight: reqData.weight ? parseNumber(reqData.weight) : undefined,
    properties: reqData.properties ? parseString(reqData.properties) : undefined,
    damage: reqData.damage ? parseString(reqData.damage) : undefined,
    damageTypes: reqData.damageTypes ? parseStringArray(reqData.damageTypes) : undefined,
    baseItem: parseBoolean(reqData.baseItem),
    unique: parseBoolean(reqData.unique)
  }
  return newItemRequest
}

export const toNewStoreRequest = (reqData: any): NewStoreRequest => {
  const newStoreRequest: NewStoreRequest = {
    name: parseString(reqData.name),
    itemTypeProbabilities: parseItemTypeProbabilities(reqData.itemTypeProbabilities),
    games: reqData.games ? parseStringArray(reqData.games) : undefined
  }
  return newStoreRequest
}

export const parseItemTypeProbabilities = (data: unknown): ItemTypeProbability[] => {
  if (!data || !Array.isArray(data)) {
    throw new Error('Incorrect or missing ItemTypeProbabilities '+data)
  }
  const returnValue: ItemTypeProbability[] = data.map((itemT: unknown) => parseItemTypeProbability(itemT))
  if (!returnValue) {
    throw new Error('Incorrect or missing ItemTypeProbabilities '+data)
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

export const parseItemTypeProbability = (reqData: any): ItemTypeProbability => {
  if (!reqData && !reqData.rarity && !isString(reqData.rarity) && !reqData.probability && !isNumber(reqData.probability)) {
    throw new Error('Incorrect or missing ItemTypeProbability '+reqData)
  }
  return {
    rarity: parseString(reqData.rarity),
    probability: parseNumber(reqData.probability)
  }
}

export const getUser = async (context: unknown) => {
  const token = toToken(context)
  if (!token) {
    throw new AuthenticationError('Invalid token')
  }
  return await User.findOne({ id: token.id })
}