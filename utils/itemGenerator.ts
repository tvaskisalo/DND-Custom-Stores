import seedrandom from 'seedrandom'
import dao from './dao'
import { toCompleteEnchantment, toCompleteGame, toCompleteItem, toCompleteStore } from './parsers'
import { CompleteItem, CompleteEnchantment, itemRarityProbability, ItemRarityRange, RarityDefinition, CompleteStore, CompleteGame, } from './types'

//Filter function to filter all the correct enchantments.
const enchantmentFilter = (item: CompleteItem, enchantment: CompleteEnchantment, tiers: number[]) => {
  const sameTier = tiers.includes(enchantment.tier)
  if (item.armor && enchantment.armor && sameTier) return true
  if (item.weapon && enchantment.weapon && sameTier) return true
  return false
}

const parseEnchantedItem = (item: CompleteItem, enchantment: CompleteEnchantment) => {
  // Adding echantment name in front of the item name
  item.name = enchantment.name + ' ' + item.name
  // Adding enchantment's damage, stealth and strength to the item
  if (enchantment.damage) item.damage = item.damage ? item.damage + ' ' + enchantment.damage : enchantment.damage
  if (enchantment.stealth) item.stealth = item.stealth ? item.stealth + ' ' + enchantment.stealth : enchantment.stealth
  if (enchantment.strength) item.strength = item.strength ? item.strength + ' ' + enchantment.strength : enchantment.strength
  // Updating damageTypes
  if (enchantment.damageTypes) {
    enchantment.damageTypes.forEach(type => {
      if (!item.damageTypes) {
        item.damageTypes = []
      }
      item.damageTypes.push(type)
    })
  }
  // Add enchantment descriptions to the item properties
  if (!item.properties) {
    item.properties = enchantment.name + ': ' +enchantment.description
  } else {
    item.properties = item.properties + ' /n ' + enchantment.name + ': ' +enchantment.description
  }
}

//This will genrate random list of item rarities
//This function assumes that the sum of itemRarityProbabilities is 100
const generateItemRarities = (capacity: number, itemRarityProbabilities: itemRarityProbability[], seed: string | undefined): string[] => {
  const ranges: ItemRarityRange[] = []
  //seed is for not only for testing purposes
  const random = seedrandom(seed)
  let min = 0
  itemRarityProbabilities.forEach(itemRarity => {
    //Adding ranges such that the next rarity's minimum is equal to last range's maximum.
    //Here minimum is inclusive but maximum is exclusive
    ranges.push({ min, max:min+itemRarity.probability, rarity: itemRarity.rarity })
    min = min+itemRarity.probability
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
  //If enchantment list is empty, return the original item
  if (enchantments.length === 0) return item
  //Might later on make a new type "EnchantedItem", if needed. It would add clarity
  const itemCopy = structuredClone(item)
  //If the number of enchantments that need to be added is greater or equal than available enchantments add all eanchantmenst to the item
  if (n >= enchantments.length) {
    enchantments.forEach(enchantment => parseEnchantedItem(itemCopy, enchantment))
    return itemCopy
  }
  const random = seedrandom(seed)
  // Copy the array so we do not modify the original
  const copy = structuredClone(enchantments)
  // Shuffle the array
  const randomizedCopy = copy.sort(() => (random() > .5) ? 1 : -1)
  // Take first n enchantments of the list. This was way we have n number of random enchantments that are different.
  // Other solution would be to get n random indexes, by doing the naive way by generating integers and checking if they are different from previous ones
  // That solution easily becomes inefficient when the list size and n are large.
  const itemEnchantments = randomizedCopy.slice(0, n)
  // Sort enchantments alphabetically by name
  itemEnchantments.sort((a,b) => a.name.localeCompare(b.name))
  itemEnchantments.forEach(enchantment => parseEnchantedItem(itemCopy, enchantment))
  return itemCopy
}

//Generates enchanted items with rarity and adds to itempool
const addEnchantedItemsToItempool = (
  enchantableItems: CompleteItem[],
  nonUniqueItemRarities: string[],
  rarityDefinitions: RarityDefinition[],
  enchantments: CompleteEnchantment[],
  itempool: CompleteItem[],
  seed: string | undefined) => {
  for (let i = 0; i < enchantableItems.length; i++) {
    enchantableItems[i] = {
      ...enchantableItems[i],
      rarity: nonUniqueItemRarities[i],
      name: nonUniqueItemRarities[i] + ' ' + enchantableItems[i].name
    }
  }
  enchantableItems.forEach(item => {
    const rarityDef = rarityDefinitions.find(i => i.rarity === item.rarity)
    if (rarityDef) {
      const correctEnchantments = enchantments.filter(e => enchantmentFilter(item, e, rarityDef.enchantmentTiers))
      const enchantedItem = generateEnchantedItem(rarityDef.enchantmentCount, item, correctEnchantments, seed)
      itempool.push(enchantedItem)
    }
  })
}

//Generates an itempool. Nonunique items are randomly enchanted according to given rarity definitions and enchantements.
//The count of different rarity items is determined by the itemRarityProbability
const generateItems = (
  capacity: number,
  items: CompleteItem[],
  itemRarityProbabilities: itemRarityProbability[],
  enchantments: CompleteEnchantment[],
  rarityDefinitions: RarityDefinition[],
  seed: string | undefined): CompleteItem[] => {
  const random = seedrandom(seed)
  const itempool: CompleteItem[] = []
  //Generate the rarities for the items
  const itemRarities = generateItemRarities(capacity, itemRarityProbabilities, seed).sort((a,b) => a.localeCompare(b))
  //Count the number of uniques and nonUniques and seperate them since they are handled differently
  const uniqueCount = itemRarities.filter(r => r.toLowerCase() === 'unique').length
  const nonUniqueItemRarities = itemRarities.filter(r => r.toLowerCase() !== 'unique')
  const uniques = items.filter(item => item.unique)
  const nonUniqueItems = items.filter(item => !item.unique)
  //Clone items and enchantments
  const enchantableItems: CompleteItem[] = []
  for (let i = 0; i < capacity-uniqueCount; i++) {
    const itemIndex = Math.floor(random()*nonUniqueItems.length)
    enchantableItems.push(nonUniqueItems[itemIndex])
  }
  // Add a rarity and enchantments to all items
  addEnchantedItemsToItempool(enchantableItems, nonUniqueItemRarities, rarityDefinitions, enchantments, itempool, seed)
  //Add uniques to the itempool
  for (let i = 0; i < uniqueCount; i++) {
    const item = uniques[Math.floor(random()*uniques.length)]
    item.rarity = 'Unique'
    itempool.push(item)
  }
  return itempool
}

//This fetches all needed data from dao, validates and generates the itempool for the store
//This needs to be heavily tested to ensure correct behaviour.
const generateItempool = async (gameName: string, storeName: string, userId: string, seed: string | undefined) => {
  const store = await dao.getStoreInfo(storeName, userId)
  const game = await dao.getGameInfo(gameName, userId)
  const enchantments = await dao.getEnchantments({ game: gameName }, userId)
  if (!store || !game || !enchantments || !userId) {
    throw new Error('Invalid args')
  }
  const items = await dao.getItems({ name: storeName }, userId)
  if (!items || items.length === 0)  {
    return []
  }
  //These might throw an errer if store or game are not complete.
  //TODO: Add error handling
  const completeStore: CompleteStore = toCompleteStore(store)
  const completeGame: CompleteGame = toCompleteGame(game)
  const completeEnchantments: CompleteEnchantment[] = []
  const completeItems: CompleteItem[] = []
  //Parse items and enchantments to complete items and enchantments.
  //If it is not complete, it is ignored
  enchantments.forEach(e => {
    try {
      const enchantment = toCompleteEnchantment(e)
      completeEnchantments.push(enchantment)
    } catch (err) {
      () => undefined
    }
  })
  items.forEach(i => {
    try {
      const item = toCompleteItem(i)
      completeItems.push(item)
    } catch (err) {
      () => undefined
    }
  })
  const finishedItems = generateItems(
    completeStore.capacity,
    completeItems,
    completeStore.itemRarityProbabilities,
    completeEnchantments,
    completeGame.rarities,
    seed
  )
  return finishedItems
}

export default {
  generateItemRarities,
  generateEnchantedItem,
  generateItems,
  generateItempool
}




