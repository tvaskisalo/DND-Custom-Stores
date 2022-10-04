import seedrandom from 'seedrandom'
import { ItemTypeProbability, ItemTypeRange } from './types'

//This will genrate random list of item rarities
//This function assumes that the sum of itemTypeProbabilities is 100
const generateItemRarities = (capacity: number, itemTypeProbabilities: ItemTypeProbability[], seed: string | undefined): string[] => {
  const ranges: ItemTypeRange[] = []
  //seed is for not only for testing purposes
  const randomFloat = seedrandom(seed)
  let min = 0
  itemTypeProbabilities.forEach(itemType => {
    //Adding ranges such that the next rarity's minimum is equal to last range's maximum.
    //Here minimum is inclusive but maximum is exclusive
    ranges.push({ min, max:min+itemType.probability, rarity: itemType.rarity })
    min = min+itemType.probability
  })
  const itemRarities: string[] = []
  for (let i = 0; i<capacity; i++) {
    //Generate random number between [0,100[
    const randomInt = Math.floor(randomFloat()*100)
    ranges.forEach(range => {
      //If the random number is in the range of this rarity, add the rarity to the list
      if (range.min <= randomInt && randomInt < range.max) {
        itemRarities.push(range.rarity)
      }
    })
  }
  return itemRarities
}

export default {
  generateItemRarities
}