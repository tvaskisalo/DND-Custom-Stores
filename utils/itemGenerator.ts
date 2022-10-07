import seedrandom from 'seedrandom'
import { CompleteItem, CompleteEnchantment, ItemTypeProbability, ItemTypeRange, } from './types'

//This will genrate random list of item rarities
//This function assumes that the sum of itemTypeProbabilities is 100
const generateItemRarities = (capacity: number, itemTypeProbabilities: ItemTypeProbability[], seed: string | undefined): string[] => {
  const ranges: ItemTypeRange[] = []
  //seed is for not only for testing purposes
  const random = seedrandom(seed)
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
    const randomInt = Math.floor(random()*100)
    ranges.forEach(range => {
      //If the random number is in the range of this rarity, add the rarity to the list
      if (range.min <= randomInt && randomInt < range.max) {
        itemRarities.push(range.rarity)
      }
    })
  }
  return itemRarities
}

// this function will generate enchantments for given item based on rarity.
const generateEnchantedItem = (n: number, item: CompleteItem, enchantments: CompleteEnchantment[], seed: string | undefined): CompleteItem => {
  if (n > enchantments.length) {
    throw new Error('Number of enchantments cannot exceed number of enchantments in the game')
  }
  const random = seedrandom(seed)
  // Copy the array so we do not modify the original
  const copy = structuredClone(enchantments)
  // Shuffle the array
  const randomizedCopy = copy.sort(() => (random() > .5) ? 1 : -1)
  // Take first n enchantments of the list. This was way we have n number of random enchantments that are different.
  // Other solution would be to get n random indexes, by doing the naive way by generating integers and checking if they are different from previous ones
  // That solution easily becomes inefficient when the list size and is large.
  const itemEnchantments = randomizedCopy.slice(0, n)
  // Sort enchantments alphabetically
  itemEnchantments.sort((a,b) => a.name.localeCompare(b.name))
  const itemCopy = structuredClone(item)
  itemEnchantments.forEach(enchantment => {
    // Adding echantment name in front of the item name
    itemCopy.name = enchantment.name + ' ' + itemCopy.name
    // Adding echantment's damage to the item
    if (enchantment.damage) itemCopy.damage = itemCopy.damage ? itemCopy.damage +' '+enchantment.damage : enchantment.damage
    // Updating damageTypes
    if (enchantment.damageTypes) {
      enchantment.damageTypes.forEach(type => {
        if (!itemCopy.damageTypes) {
          itemCopy.damageTypes = []
        }
        itemCopy.damageTypes.push(type)
      })
    }
    // Add enchantment descriptions to the item properties
    if (!itemCopy.properties) itemCopy.properties = ''
    itemCopy.properties = itemCopy.properties + '/n' + enchantment.name + ': ' +enchantment.description
  })
  return itemCopy
}

export default {
  generateItemRarities,
  generateEnchantedItem
}