// Disabling no explicit any due to this being type check and avoding code with unknown type
/* eslint-disable @typescript-eslint/no-explicit-any */
import { itemRarityProbability, RarityDefinition, Item } from './types'

const isString = (str: unknown): str is string => {
  return typeof str === 'string' || str instanceof String
}

const isNumber = (num: unknown): num is number => {
  return typeof num === 'number'
}

const isBoolean = (bool: unknown): bool is boolean => {
  return typeof bool === 'boolean'
}

const parseStringArray = (strArr: unknown): string[] => {
  if (!strArr || !Array.isArray(strArr)) {
    throw new Error('Incorrect or missing string array ' + strArr)
  }
  const returnValue: string[] = strArr.map((str) => parseString(str))
  if (!returnValue) {
    throw new Error('Incorrect or missing string array')
  }
  return returnValue
}

//This assumes that the itemtype probabilities are seperated by comma and a space and rarity and probability are seperated by a space
export const toitemRarityProbabilities = (str: string | undefined): itemRarityProbability[] => {
  if (!str) {
    throw new Error('Cannot give empty string')
  }
  const strArr = str.split(', ')
  const rarities: itemRarityProbability[] = []
  strArr.forEach(s => {
    const [rarity, probability] = s.split(' ')
    rarities.push({ rarity, probability: Number(probability) })
  })
  return rarities
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

export const toRarityDefinitions = (str: string | undefined): RarityDefinition[] => {
  if (!str) {
    throw new Error('Invalid string')
  }
  const strArr = str.split(', ')
  const rarityDefinitions: RarityDefinition[] = []
  strArr.forEach(s => {
    const fields = s.split(' ')
    if (fields.length < 2) {
      throw new Error('Invalid rarity definition')
    }
    const rarity = fields[0]
    const enchantmentTiers: number[] = []
    for (let i = 1; i < fields.length; i++) {
      enchantmentTiers.push(Number(fields[i]))
    }
    rarityDefinitions.push({ rarity, enchantmentTiers })
  })
  console.log(rarityDefinitions[0])
  return rarityDefinitions
}

export const toItem = (data: any): Item => {
  const item: Item = {
    id: parseString(data.id),
    name: parseString(data.name),
    games: data.games ? parseStringArray(data.games) : undefined,
    storepool: data.storepool ? parseStringArray(data.storepool) : undefined,
    material: data.material ? parseString(data.material) : undefined,
    baseCost: data.baseCost ? parseNumber(data.baseCost) : undefined,
    weight: data.weight ? parseNumber(data.weight) : undefined,
    properties: data.properties ? parseString(data.properties) : undefined,
    damage: data.damage ? parseString(data.damage) : undefined,
    damageTypes: data.damageTypes ? parseStringArray(data.damageTypes) : undefined,
    baseItem: data.baseItem !== undefined ? parseBoolean(data.baseItem) : undefined,
    unique: data.unique !== undefined ? parseBoolean(data.unique) : undefined,
    weapon: data.weapon !== undefined ? parseBoolean(data.weapon) : undefined,
    weaponType: data.weaponType ? parseString(data.weaponType) : undefined,
    armor: data.armor !== undefined ? parseBoolean(data.armor) : undefined,
    armorType: data.armorType ? parseString(data.armorType) : undefined,
    armorClass: data.armorClass ? parseString(data.armorClass) : undefined,
    strength: data.strength ? parseString(data.strength) : undefined,
    stealth: data.stealth ? parseString(data.stealth) : undefined,
    rarity: data.rarity ? parseString(data.rarity) : undefined
  }
  return item
}