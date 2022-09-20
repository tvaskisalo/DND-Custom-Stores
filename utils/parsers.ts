// Disabling no explicit any due to this being type check and avoding code with unknown type
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthenticationError } from 'apollo-server-express'
import { User } from '../schemas/user'
import { ItemTypeProbability, LoginRequest, NewGameRequest, NewItemRequest, NewStoreRequest, Token } from './types'

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

export const toNewItemRequest = (reqData: any): NewItemRequest => {
  const newItemRequest: NewItemRequest = {
    name: parseString(reqData.name),
    storePool: reqData.storePool ? parseStringArray(reqData.storePool) : undefined,
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
    itemTypeProbabilities: parseItemTypeProbabilities(reqData.itemTypeProbabilities)
  }
  return newStoreRequest
}

export const parseItemTypeProbabilities = (data: any): [ItemTypeProbability] => {
  if (!data && !Array.isArray(data)) {
    throw new Error('Incorrect or missing ItemTypeProbabilities '+data)
  }
  let returnValue: [ItemTypeProbability] | undefined
  // Disabling unsafe call for any, since we know that data is array and we are now checking the elements
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  data.forEach((element: unknown) => {
    if (returnValue) {
      returnValue.push(parseItemTypeProbability(element))
    }
  })
  if (!returnValue) {
    throw new Error('Incorrect or missing ItemTypeProbabilities '+data)
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