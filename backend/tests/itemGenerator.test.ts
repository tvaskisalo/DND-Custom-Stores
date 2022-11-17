import itemGenerator from '../utils/itemGenerator'
import { CompleteEnchantment, CompleteItem, itemRarityProbability, RarityDefinition } from '../utils/types'
const items: CompleteItem[] = [
  {
    id:'1',
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
    id: '2',
    name: 'Long Sword',
    damage: '1d8',
    damageTypes: ['Piercing'],
    weapon: true,
    armor: false,
    baseItem: true,
    unique: false
  },
  {
    id: '3',
    name: 'Staff',
    damage: '1d10',
    damageTypes: ['Magical'],
    weapon: true,
    armor: false,
    baseItem: true,
    unique: false
  },
  {
    id: '3',
    name: 'Chestplate',
    weapon: false,
    armor: true,
    strength: '1d4',
    stealth: '1d4',
    baseItem: true,
    unique: false
  },
  {
    id: '4',
    name: 'Shoulderguards',
    weapon: false,
    armor: true,
    strength: '1d4',
    stealth: '1d4',
    baseItem: true,
    unique: false
  },
  {
    id: '5',
    name: 'Spiked Shield',
    damage: '1d4',
    damageTypes: ['Puncture'],
    weapon: true,
    armor: true,
    strength: '1d4',
    stealth: '1d4',
    baseItem: true,
    unique: false
  },
  {
    id: '6',
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
  {
    name: 'Sturdy',
    tier: 1,
    description: 'Makes armor sturdier',
    strength: '1d6',
    weapon: false,
    armor: true
  },
  {
    name: 'Vigilant',
    tier: 1,
    description: 'Makes armor stealthier',
    stealth: '1d6',
    weapon: false,
    armor: true
  },
  {
    name: 'Unbreakable',
    tier: 2,
    description: 'Makes armor very strong',
    strength: '1d8',
    weapon: false,
    armor: true
  },
  {
    name: 'Hidden',
    tier: 2,
    description: 'Makes armor very stealthy',
    stealth: '1d8',
    weapon: false,
    armor: true
  },
  {
    name: 'Streamlined',
    tier: 3,
    description: 'Makes armor sturdy and stealthy',
    stealth: '1d4',
    strength: '1d4',
    weapon: false,
    armor: true
  },
  {
    name: 'Well-made',
    tier: 5,
    weapon: true,
    armor: true,
    description: 'Item is well-made'
  }
]
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
    const commons = itemRarities.filter(r => r === 'Common')
    expect(Math.round((commons.length / capacity) * 100)).toBe(25)

    const uncommons = itemRarities.filter(r => r === 'Uncommon')
    expect(Math.round((uncommons.length / capacity) * 100)).toBe(25)

    const rares = itemRarities.filter(r => r === 'Rare')
    expect(Math.round((rares.length / capacity) * 100)).toBe(20)

    const veryRares = itemRarities.filter(r => r === 'Very Rare')
    expect(Math.round((veryRares.length / capacity) * 100)).toBe(15)

    const legendaries = itemRarities.filter(r => r === 'Legendary')
    expect(Math.round((legendaries.length / capacity) * 100)).toBe(10)

    const uniques = itemRarities.filter(r => r === 'Unique')
    expect(Math.round((uniques.length / capacity) * 100)).toBe(5)
  })
})

describe('Enchanting items', () => {
  //Note: generateEnchantedItem assumes that you give it correct items and enchantments
  //It is up to the developer to ensure that no armor enchantments are given with a weapon to the function.
  test('Enchanting a weapon with one enchantment, test 1', () => {
    const n = 1
    const item = items[0]
    const enchantmentList = enchantments.slice(0, 1)
    const seed = 'test'
    const generatedItem = itemGenerator.generateEnchantedItem(n, item, enchantmentList, seed)
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
    const enchantmentList = enchantments.slice(0, 2)
    const seed = 'test'
    const generatedItem = itemGenerator.generateEnchantedItem(n, item, enchantmentList, seed)
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
    const enchantmentList = enchantments.slice(0, 3)
    const seed = 'test'
    const generatedItem = itemGenerator.generateEnchantedItem(n, item, enchantmentList, seed)
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

  test('Enchanting an armor with one enchantment', () => {
    const n = 1
    const item = items[3]
    const enchantmentList = enchantments.slice(4, 5)
    const seed = 'test'
    const generatedItem = itemGenerator.generateEnchantedItem(n, item, enchantmentList, seed)
    expect(generatedItem.name).toBe('Sturdy Chestplate')
    expect(generatedItem.stealth).toContain('1d4')
    expect(generatedItem.strength).toContain('1d4')
    expect(generatedItem.strength).toContain('1d6')
    expect(generatedItem.properties).toContain('Sturdy')
    expect(generatedItem.properties).toContain('Makes armor sturdier')
  })

  test('Enchanting an armor with two enchantments', () => {
    const n = 2
    const item = items[4]
    const enchantmentList = enchantments.slice(4, 6)
    const seed = 'test'
    const generatedItem = itemGenerator.generateEnchantedItem(n, item, enchantmentList, seed)
    expect(generatedItem.name).toBe('Vigilant Sturdy Shoulderguards')
    expect(generatedItem.stealth).toContain('1d4')
    expect(generatedItem.stealth).toContain('1d6')
    expect(generatedItem.strength).toContain('1d4')
    expect(generatedItem.strength).toContain('1d6')
    expect(generatedItem.properties).toContain('Sturdy')
    expect(generatedItem.properties).toContain('Vigilant')
    expect(generatedItem.properties).toContain('Makes armor sturdier')
    expect(generatedItem.properties).toContain('Makes armor stealthier')
  })

  test('Generator handles trying to add too many enchantments properly', () => {
    const n = 10
    const item = items[0]
    const enchantmentList = enchantments.slice(0, 1)
    const seed = 'test'
    const generatedItem = itemGenerator.generateEnchantedItem(n, item, enchantmentList, seed)
    expect(generatedItem.name).toBe('Fire Dagger')
    expect(generatedItem.damage).toContain('1d4')
    expect(generatedItem.damage).toContain('1d6')
    expect(generatedItem.damageTypes).toContain('Fire')
    expect(generatedItem.damageTypes).toContain('Puncture')
    expect(generatedItem.properties).toContain('Basic dagger')
    expect(generatedItem.properties).toContain('Adds fire damage to a weapon')
  })

  test('If generator is given no enchantments, it does nothing to the item', () => {
    const n = 1
    const item = items[0]
    const enchantmentList = enchantments.slice(0, 0)
    const seed = 'test'
    const generatedItem = itemGenerator.generateEnchantedItem(n, item, enchantmentList, seed)
    expect(generatedItem).toBe(item)
  })
  test('Enchanting an item which is armor and weapon with 10 enchantments', () => {
    const n = 10
    const item = items[5]
    const generatedItem = itemGenerator.generateEnchantedItem(n, item, enchantments, undefined)
    expect(generatedItem.damageTypes?.length).toBe(5)
    expect(generatedItem.properties?.split('/n').length).toBe(10)
  })
})

describe('Itempool generator', () => {
  test('Generator generates itempool with correct size, without uniques', () => {
    const capacity = 100
    const seed = 'test'
    const itempool = itemGenerator.generateItems(capacity, items, itemRarityProbabilities, enchantments, rarityDefinitions, seed)
    expect(itempool.length).toBe(100)
  })
  test('Generator generates itempool with correct size, with uniques', () => {
    const capacity = 100
    const seed = 'test'
    const iRP: itemRarityProbability[] = [
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
      }
    ]
    const itempool = itemGenerator.generateItems(capacity, items, iRP, enchantments, rarityDefinitions, seed)
    expect(itempool.length).toBe(100)
  })
  //This might fail due to variance, but it should be REALLY unlikely. If it fails check your code to be sure
  test('Generator generates itempool with correct amount of rarities', () => {
    const capacity = 100000
    const iRP: itemRarityProbability[] = [
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
      }
    ]
    const seed = undefined
    const itempool = itemGenerator.generateItems(capacity, items, iRP, enchantments, rarityDefinitions, seed)
    const commons = itempool.filter(r => r.rarity === 'Common')
    expect(Math.round((commons.length / capacity) * 100)).toBe(25)

    const uncommons = itempool.filter(r => r.rarity === 'Uncommon',)
    expect(Math.round((uncommons.length / capacity) * 100)).toBe(25)

    const rares = itempool.filter(r => r.rarity === 'Rare',)
    expect(Math.round((rares.length / capacity) * 100)).toBe(20)

    const veryRares = itempool.filter(r => r.rarity === 'Very Rare')
    expect(Math.round((veryRares.length / capacity) * 100)).toBe(15)

    const legendaries = itempool.filter(r => r.rarity === 'Legendary')
    expect(Math.round((legendaries.length / capacity) * 100)).toBe(10)

    const uniques = itempool.filter(r => r.rarity === 'Unique')
    expect(Math.round((uniques.length / capacity) * 100)).toBe(5)
  })
  test('If generator is given only weapons and armor enchantments, it gives weapons rarity, but no enchantments', () => {
    const capacity = 2
    const seed = 'test'
    const weapons = items.slice(0, 3)
    const enchantmentList = enchantments.slice(4, 9)
    const itempool = itemGenerator.generateItems(capacity, weapons, itemRarityProbabilities, enchantmentList, rarityDefinitions, seed)
    expect(itempool[0].name).toBe('Legendary Staff')
    expect(itempool[1].name).toBe('Uncommon Long Sword')
    expect(itempool[0].properties).toBeUndefined()
    expect(itempool[1].properties).toBeUndefined()
    expect(itempool[0].rarity).toBe('Legendary')
    expect(itempool[1].rarity).toBe('Uncommon')
  })
  test('If generator is given only armor and weapon enchantments, it gives armor rarity, but no enchantments', () => {
    const capacity = 2
    const seed = 'test'
    const armor = items.slice(3, 5)
    const enchantmentList = enchantments.slice(0, 4)
    const itempool = itemGenerator.generateItems(capacity, armor, itemRarityProbabilities, enchantmentList, rarityDefinitions, seed)
    expect(itempool[0].name).toBe('Legendary Shoulderguards')
    expect(itempool[1].name).toBe('Uncommon Chestplate')
    expect(itempool[0].properties).toBeUndefined()
    expect(itempool[1].properties).toBeUndefined()
    expect(itempool[0].rarity).toBe('Legendary')
    expect(itempool[1].rarity).toBe('Uncommon')
  })
  test('Unique items are not enchanted', () => {
    const capacity = 1
    const uniqueRarityProbability: itemRarityProbability[] = [
      {
        rarity: 'Unique',
        probability: 100
      }
    ]
    const seed = 'test'
    const weapon = items.slice(6, 7)
    const itempool = itemGenerator.generateItems(capacity, weapon, uniqueRarityProbability, enchantments, rarityDefinitions, seed)
    expect(itempool[0].name).toBe('Master Sword')
    expect(itempool[0].properties).toBeUndefined()
    expect(itempool[0].rarity).toBe('Unique')
  })
  test('Enchanted Items are given correct amount of enchantments, test 1', () => {
    const capacity = 1
    const seed = 'test'
    const itemList = items.slice(0, 1)
    const iRP: itemRarityProbability[] = [
      {
        rarity: 'Common',
        probability: 100
      }
    ]
    const rD: RarityDefinition[] = [
      {
        rarity: 'Common',
        enchantmentTiers: [1],
        enchantmentCount: 0
      }
    ]
    const itempool = itemGenerator.generateItems(capacity, itemList, iRP, enchantments,  rD, seed)
    expect(itempool[0].name).toBe('Common Dagger')
    expect(itempool[0].properties).toBe('Basic dagger')
  })
  test('Enchanted Items are given correct amount of enchantments, test 2', () => {
    const capacity = 1
    const seed = 'test'
    const itemList = items.slice(0, 1)
    const iRP: itemRarityProbability[] = [
      {
        rarity: 'Common',
        probability: 100
      }
    ]
    const rD: RarityDefinition[] = [
      {
        rarity: 'Common',
        enchantmentTiers: [1],
        enchantmentCount: 2
      }
    ]
    const itempool = itemGenerator.generateItems(capacity, itemList, iRP, enchantments,  rD,  seed)
    expect(itempool[0].name).toBe('Frost Fire Common Dagger')
    expect(itempool[0].properties?.split('/n').length).toBe(3)
  })
  test('Enchantments are given correcty based on tier and rarityDefinitions, test 1', () => {
    const seed = 'test'
    const capacity = 1
    const itemList = items.slice(0, 1)
    const iRP: itemRarityProbability[] = [
      {
        rarity: 'Common',
        probability: 100
      }
    ]
    const rD: RarityDefinition[] = [
      {
        rarity: 'Common',
        enchantmentTiers: [2],
        enchantmentCount: 2
      }
    ]
    const enchantmentList = enchantments.slice(0, 1)
    const itempool = itemGenerator.generateItems(capacity, itemList, iRP, enchantmentList,  rD,  seed)
    expect(itempool[0].name).toBe('Common Dagger')
  })
  test('Enchantments are given correcty based on tier and rarityDefinitions, test 2', () => {
    const seed = 'test'
    const capacity = 1
    const itemList = items.slice(0, 1)
    const iRP: itemRarityProbability[] = [
      {
        rarity: 'Common',
        probability: 100
      }
    ]
    const rD: RarityDefinition[] = [
      {
        rarity: 'Common',
        enchantmentTiers: [1, 5],
        enchantmentCount: 6
      }
    ]
    const itempool = itemGenerator.generateItems(capacity, itemList, iRP, enchantments,  rD,  seed)
    expect(itempool[0].name).toBe('Well-made Frost Fire Common Dagger')
  })
})
