import itemGenerator from '../utils/itemGenerator'
import { CompleteEnchantment, CompleteItem, itemRarityProbability, RarityDefinition } from '../utils/types'
const items: CompleteItem[] = [
  {
    name: 'Dagger',
    damage: '1d4',
    damageTypes: ['Puncture'],
    weapon: true,
    armor: false,
    properties: 'Basic dagger',
    baseItem: true,
    unique: false
  },
  {
    name: 'Long Sword',
    damage: '1d8',
    damageTypes: ['Piercing'],
    weapon: true,
    armor: false,
    baseItem: true,
    unique: false
  },
  {
    name: 'Staff',
    damage: '1d10',
    damageTypes: ['Magical'],
    weapon: true,
    armor: false,
    baseItem: true,
    unique: false
  },
  {
    name: 'Chestplate',
    weapon: false,
    armor: true,
    strength: '1d4',
    stealth: '1d6',
    baseItem: true,
    unique: false
  },
  {
    name: 'Shoulderguards',
    weapon: false,
    armor: true,
    strength: '1d4',
    stealth: '1d6',
    baseItem: true,
    unique: false
  },
  {
    name: 'Spiked Shield',
    damage: '1d4',
    damageTypes: ['Puncture'],
    weapon: true,
    armor: true,
    strength: '1d4',
    stealth: '1d6',
    baseItem: true,
    unique: false
  },
  {
    name: 'Master Sword',
    damage: '1d20',
    damageTypes: ['Holy'],
    weapon: true,
    armor: false,
    baseItem: false,
    unique: true
  }
]
const enchantments: CompleteEnchantment[] = [
  {
    name: 'Fire',
    tier: 1,
    damage: '1d6',
    damageTypes: ['Fire'],
    description: 'Adds fire damage to a weapon',
    weapon: true,
    armor: false
  },
  {
    name: 'Frost',
    tier: 1,
    damage: '1d12',
    damageTypes: ['Frost'],
    description: 'Adds frost damage to a weapon',
    weapon: true,
    armor: false
  },
  {
    name: 'Blessing',
    tier: 2,
    damage: '1d10',
    damageTypes: ['Holy'],
    description: 'Adds holy damage to a weapon',
    weapon: true,
    armor: false
  },
  {
    name: 'Curse',
    tier: 2,
    damage: '1d10',
    damageTypes: ['Evil'],
    description: 'Adds evil damage to a weapon',
    weapon: true,
    armor: false
  },
]
describe('Generating item rarities', () => {
  test('Capacity 1, itemrarities 1', () => {
    const capacity = 1
    const itemRarityProbabilities: itemRarityProbability[] = [
      {
        rarity: 'Common',
        probability: 100
      }
    ]
    const itemRarities = itemGenerator.generateItemRarities(capacity, itemRarityProbabilities, undefined)
    expect(itemRarities.length).toBe(1)
    expect(itemRarities[0]).toBe('Common')
  })
  test('Capacity 4, itemrarities 2, constant seed', () => {
    const capacity = 4
    const itemRarityProbabilities: itemRarityProbability[] = [
      {
        rarity: 'Common',
        probability: 50
      },
      {
        rarity: 'Uncommon',
        probability: 50
      }
    ]
    const seed = 'test'
    const itemRarities = itemGenerator.generateItemRarities(capacity, itemRarityProbabilities, seed)
    expect(itemRarities.length).toBe(4)
    expect(itemRarities).toEqual(['Uncommon', 'Common', 'Uncommon', 'Common'])
  })
  test('Capacity 10, itemrarities: 6, consant seed', () => {
    const capacity = 10
    const itemRarityProbabilities: itemRarityProbability[] = [
      {
        rarity: 'Common',
        probability: 25
      },
      {
        rarity: 'Uncommon',
        probability: 25
      },
      {
        rarity: 'Rare',
        probability: 20
      },
      {
        rarity: 'Very Rare',
        probability: 15
      },
      {
        rarity: 'Legendary',
        probability: 10
      },
      {
        rarity: 'Unique',
        probability: 5
      },
    ]
    const seed = 'test'
    const itemRarities = itemGenerator.generateItemRarities(capacity, itemRarityProbabilities, seed)
    expect(itemRarities.length).toBe(10)
    expect(itemRarities).toEqual([
      'Legendary', 'Uncommon',
      'Unique',    'Uncommon',
      'Uncommon',  'Uncommon',
      'Uncommon',  'Common',
      'Very Rare', 'Uncommon'
    ])
  })
  //This might fail due to variance, but it should be REALLY unlikely. If it fails check your code to be sure
  test('Capacity 1000000, itemRarities 6', () => {
    const capacity = 1000000
    const itemRarityProbabilities: itemRarityProbability[] = [
      {
        rarity: 'Common',
        probability: 25
      },
      {
        rarity: 'Uncommon',
        probability: 25
      },
      {
        rarity: 'Rare',
        probability: 20
      },
      {
        rarity: 'Very Rare',
        probability: 15
      },
      {
        rarity: 'Legendary',
        probability: 10
      },
      {
        rarity: 'Unique',
        probability: 5
      },
    ]
    const itemRarities = itemGenerator.generateItemRarities(capacity, itemRarityProbabilities, undefined)
    expect(itemRarities.length).toBe(capacity)
    //This tests that each rarity shows up in the array the correct amount of times compared to its probability
    const commons = itemRarities.filter(r => r==='Common')
    expect(Math.round((commons.length/capacity)*100)).toBe(25)

    const uncommons = itemRarities.filter(r => r==='Uncommon',)
    expect(Math.round((uncommons.length/capacity)*100)).toBe(25)

    const rares = itemRarities.filter(r => r==='Rare',)
    expect(Math.round((rares.length/capacity)*100)).toBe(20)

    const veryRares = itemRarities.filter(r => r==='Very Rare')
    expect(Math.round((veryRares.length/capacity)*100)).toBe(15)

    const legendaries = itemRarities.filter(r => r==='Legendary')
    expect(Math.round((legendaries.length/capacity)*100)).toBe(10)

    const uniques = itemRarities.filter(r => r==='Unique')
    expect(Math.round((uniques.length/capacity)*100)).toBe(5)
  })
})

describe('Enchanting items', () => {
  test('Enchanting a weapon with one enchantment, test 1', () => {
    const n = 1
    const item = items[0]
    const enchantment = enchantments.slice(0,1)
    const seed = 'test'
    const generatedItem = itemGenerator.generateEnchantedItem(n, item, enchantment, seed)
    expect(generatedItem.name).toBe('Fire Dagger')
    expect(generatedItem.damage).toContain('1d4')
    expect(generatedItem.damage).toContain('1d6')
    expect(generatedItem.damageTypes).toContain('Fire')
    expect(generatedItem.damageTypes).toContain('Puncture')
    expect(generatedItem.properties).toContain('Basic dagger')
    expect(generatedItem.properties).toContain('Adds fire damage to a weapon')
  })

  test('Enchanting a weapon with one enchantment, test 2', () => {
    const n = 1
    const item = items[0]
    const enchantment = enchantments.slice(0,2)
    const seed = 'test'
    const generatedItem = itemGenerator.generateEnchantedItem(n, item, enchantment, seed)
    expect(generatedItem.name).toBe('Fire Dagger')
    expect(generatedItem.damage).toContain('1d4')
    expect(generatedItem.damage).toContain('1d6')
    expect(generatedItem.damageTypes).toContain('Fire')
    expect(generatedItem.damageTypes).toContain('Puncture')
    expect(generatedItem.properties).toContain('Basic dagger')
    expect(generatedItem.properties).toContain('Adds fire damage to a weapon')
  })

  test('Enchanting a weapon with two enchantments', () => {
    const n = 2
    const item = items[1]
    const enchantment = enchantments.slice(0,3)
    const seed = 'test'
    const generatedItem = itemGenerator.generateEnchantedItem(n, item, enchantment, seed)
    expect(generatedItem.name).toBe('Frost Fire Long Sword')
    expect(generatedItem.damage).toContain('1d8')
    expect(generatedItem.damage).toContain('1d6')
    expect(generatedItem.damage).toContain('1d12')
    expect(generatedItem.damageTypes).toContain('Fire')
    expect(generatedItem.damageTypes).toContain('Piercing')
    expect(generatedItem.damageTypes).toContain('Frost')
    expect(generatedItem.properties).toContain('Adds fire damage to a weapon')
    expect(generatedItem.properties).toContain('Adds frost damage to a weapon')
  })
})

test('Itempool generation', () => {
  const capacity = 10
  const itemRarityProbabilities: itemRarityProbability[] = [
    {
      rarity: 'Common',
      probability: 25
    },
    {
      rarity: 'Uncommon',
      probability: 25
    },
    {
      rarity: 'Rare',
      probability: 20
    },
    {
      rarity: 'Very Rare',
      probability: 15
    },
    {
      rarity: 'Legendary',
      probability: 15
    }
  ]
  const rarityDefinitions: RarityDefinition[] = [
    {
      rarity: 'Common',
      enchantmentTiers: [0],
      enchantmentCount: 0
    },
    {
      rarity: 'Uncommon',
      enchantmentTiers: [1],
      enchantmentCount: 1
    },
    {
      rarity: 'Rare',
      enchantmentTiers: [1],
      enchantmentCount: 2
    },
    {
      rarity: 'Very Rare',
      enchantmentTiers: [2],
      enchantmentCount: 1
    },
    {
      rarity: 'Legendary',
      enchantmentTiers: [2],
      enchantmentCount: 2
    }
  ]
  const seed = undefined
  const itempool = itemGenerator.generateItemPool(capacity, items, itemRarityProbabilities, enchantments, rarityDefinitions, seed)
  console.log(itempool)
  expect(false)
})

test('itempool generation with uniques', () => {
  const capacity = 4
  const itemRarityProbabilities: itemRarityProbability[] = [
    {
      rarity: 'Common',
      probability: 50
    },
    {
      rarity: 'Unique',
      probability: 50
    }
  ]
  const rarityDefs: RarityDefinition[] = [
    {
      rarity: 'Common',
      enchantmentTiers: [1],
      enchantmentCount: 2
    }
  ]
  const seed = 'test'
  const itempool = itemGenerator.generateItemPool(capacity, items, itemRarityProbabilities, enchantments, rarityDefs, seed)
  console.log(itempool)
  expect(false)
})