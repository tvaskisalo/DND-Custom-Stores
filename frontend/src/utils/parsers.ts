import { itemRarityProbability, RarityDefinition } from './types'

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