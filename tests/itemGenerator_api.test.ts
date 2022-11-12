import { ApolloServer } from 'apollo-server-express'
import { User } from '../schemas/user'
import { Item } from '../schemas/item'
import { Store } from '../schemas/store'
import { Game } from '../schemas/game'
import { Enchantment } from '../schemas/enchantment'
import testServer from './testServer'
import { generateItempool } from './testQueries'
let server: ApolloServer

const initialItems = [
  {
    name: 'Dagger',
    damage: '1d4',
    damageTypes: ['Puncture'],
    weapon: true,
    armor: false,
    properties: 'Basic dagger',
    storepool: ['testStore1', 'testStore2'],
    baseItem: true,
    unique: false
  },
  {
    name: 'Long Sword',
    damage: '1d8',
    damageTypes: ['Piercing'],
    weapon: true,
    armor: false,
    storepool: ['testStore1', 'testStore2'],
    baseItem: true,
    unique: false
  },
  {
    name: 'Staff',
    damage: '1d10',
    damageTypes: ['Magical'],
    weapon: true,
    armor: false,
    storepool: ['testStore1', 'testStore2'],
    baseItem: true,
    unique: false
  },
  {
    name: 'Chestplate',
    weapon: false,
    armor: true,
    strength: '1d4',
    stealth: '1d4',
    storepool: ['testStore1'],
    baseItem: true,
    unique: false
  },
  {
    name: 'Shoulderguards',
    weapon: false,
    armor: true,
    strength: '1d4',
    stealth: '1d4',
    storepool: ['testStore1'],
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
    stealth: '1d4',
    storepool: ['testStore1'],
    baseItem: true,
    unique: false
  },
  {
    name: 'Master Sword',
    damage: '1d20',
    damageTypes: ['Holy'],
    weapon: true,
    armor: false,
    storepool: ['testStore1', 'testStore2'],
    baseItem: false,
    unique: true
  }
]

const otherUsersInitialItems = [
  {
    name: 'Fake Dagger',
    damage: '1d4',
    damageTypes: ['Puncture'],
    weapon: true,
    armor: false,
    properties: 'Basic dagger',
    storepool: ['testStore3'],
    baseItem: true,
    unique: false
  },
  {
    name: 'Fake Long Sword',
    damage: '1d8',
    damageTypes: ['Piercing'],
    weapon: true,
    armor: false,
    storepool: ['testStore3'],
    baseItem: true,
    unique: false
  },
  {
    name: 'Fake Staff',
    damage: '1d10',
    damageTypes: ['Magical'],
    weapon: true,
    armor: false,
    storepool: ['testStore3'],
    baseItem: true,
    unique: false
  },
  {
    name: 'Fake Chestplate',
    weapon: false,
    armor: true,
    strength: '1d4',
    stealth: '1d4',
    storepool: ['testStore3'],
    baseItem: true,
    unique: false
  },
  {
    name: 'Fake Shoulderguards',
    weapon: false,
    armor: true,
    strength: '1d4',
    stealth: '1d4',
    storepool: ['testStore3'],
    baseItem: true,
    unique: false
  },
  {
    name: 'Fake Spiked Shield',
    damage: '1d4',
    damageTypes: ['Puncture'],
    weapon: true,
    armor: true,
    strength: '1d4',
    stealth: '1d4',
    storepool: ['testStore3'],
    baseItem: true,
    unique: false
  },
  {
    name: 'Fake Master Sword',
    damage: '1d20',
    damageTypes: ['Holy'],
    weapon: true,
    armor: false,
    storepool: ['testStore3'],
    baseItem: false,
    unique: true
  }
]

const initialEnchantments = [
  {
    name: 'Fire',
    tier: 1,
    damage: '1d6',
    damageTypes: ['Fire'],
    games: ['testGame1'],
    description: 'Adds fire damage to a weapon',
    weapon: true,
    armor: false
  },
  {
    name: 'Frost',
    tier: 1,
    damage: '1d12',
    damageTypes: ['Frost'],
    games: ['testGame1'],
    description: 'Adds frost damage to a weapon',
    weapon: true,
    armor: false
  },
  {
    name: 'Blessing',
    tier: 2,
    damage: '1d10',
    damageTypes: ['Holy'],
    games: ['testGame1'],
    description: 'Adds holy damage to a weapon',
    weapon: true,
    armor: false
  },
  {
    name: 'Curse',
    tier: 2,
    damage: '1d10',
    damageTypes: ['Evil'],
    games: ['testGame1'],
    description: 'Adds evil damage to a weapon',
    weapon: true,
    armor: false
  },
  {
    name: 'Sturdy',
    tier: 1,
    games: ['testGame1'],
    description: 'Makes armor sturdier',
    strength: '1d6',
    weapon: false,
    armor: true
  },
  {
    name: 'Vigilant',
    tier: 1,
    games: ['testGame1'],
    description: 'Makes armor stealthier',
    stealth: '1d6',
    weapon: false,
    armor: true
  },
  {
    name: 'Unbreakable',
    tier: 2,
    games: ['testGame1'],
    description: 'Makes armor very strong',
    strength: '1d8',
    weapon: false,
    armor: true
  },
  {
    name: 'Hidden',
    tier: 2,
    games: ['testGame1'],
    description: 'Makes armor very stealthy',
    stealth: '1d8',
    weapon: false,
    armor: true
  },
  {
    name: 'Streamlined',
    tier: 3,
    games: ['testGame1'],
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
    games: ['testGame1'],
    description: 'Item is well-made'
  }
]

const otherUsersInitialEnchantments = [
  {
    name: 'Fake Fire',
    tier: 1,
    damage: '1d6',
    damageTypes: ['Fire'],
    games: ['testGame1'],
    description: 'Adds fire damage to a weapon',
    weapon: true,
    armor: false
  },
  {
    name: 'Fake Frost',
    tier: 1,
    damage: '1d12',
    damageTypes: ['Frost'],
    games: ['testGame1'],
    description: 'Adds frost damage to a weapon',
    weapon: true,
    armor: false
  },
  {
    name: 'Fake Blessing',
    tier: 2,
    damage: '1d10',
    damageTypes: ['Holy'],
    games: ['testGame1'],
    description: 'Adds holy damage to a weapon',
    weapon: true,
    armor: false
  },
  {
    name: 'Fake Curse',
    tier: 2,
    damage: '1d10',
    damageTypes: ['Evil'],
    games: ['testGame1'],
    description: 'Adds evil damage to a weapon',
    weapon: true,
    armor: false
  },
  {
    name: 'Fake Sturdy',
    tier: 1,
    games: ['testGame1'],
    description: 'Makes armor sturdier',
    strength: '1d6',
    weapon: false,
    armor: true
  },
  {
    name: 'Fake Vigilant',
    tier: 1,
    games: ['testGame1'],
    description: 'Makes armor stealthier',
    stealth: '1d6',
    weapon: false,
    armor: true
  },
  {
    name: 'Fake Unbreakable',
    tier: 2,
    games: ['testGame1'],
    description: 'Makes armor very strong',
    strength: '1d8',
    weapon: false,
    armor: true
  },
  {
    name: 'Fake Hidden',
    tier: 2,
    games: ['testGame1'],
    description: 'Makes armor very stealthy',
    stealth: '1d8',
    weapon: false,
    armor: true
  },
  {
    name: 'Fake Streamlined',
    tier: 3,
    games: ['testGame1'],
    description: 'Makes armor sturdy and stealthy',
    stealth: '1d4',
    strength: '1d4',
    weapon: false,
    armor: true
  },
  {
    name: 'Fake Well-made',
    tier: 5,
    weapon: true,
    armor: true,
    games: ['testGame1'],
    description: 'Item is well-made'
  }
]

//testStore3 belongs to otherUser, not testUser
const initialStores = [
  {
    name: 'testStore1',
    itemRarityProbabilities: [
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
    ],
    capacity: 10
  },
  {
    name: 'testStore2',
    itemRarityProbabilities: [
      {
        rarity: 'Common',
        probability: 100
      }
    ]
  },
  {
    name: 'testStore3',
    itemRarityProbabilities: [
      {
        rarity: 'Common',
        probability: 100
      }
    ],
    capacity: 100
  }
]

//testGame3 belongs to otherUser, not testUser
const initialGames = [
  {
    name: 'testGame1',
    rarities: [
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
  },
  {
    name: 'testGame2',
    rarities: [
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
  },
  {
    name: 'testGame3',
    rarities: [
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
  }
]

beforeAll( async () => {
  server = await testServer()
}, 10000)

const initTest = async () => {
  await Item.deleteMany()
  await Store.deleteMany()
  await Game.deleteMany()
  await Enchantment.deleteMany()
  const otherUser = await User.findOne({ username: 'otherUser' })
  const user = await User.findOne({ username: 'testUser' })
  const game1 = new Game({ ...initialGames[0], user: user?.id as string })
  await game1.save()
  const game2 = new Game({ ...initialGames[1], user: user?.id as string })
  await game2.save()
  const game3 = new Game({ ...initialGames[2], user: otherUser?.id as string })
  await game3.save()

  const store1 = new Store({ ...initialStores[0], user: user?.id as string })
  await store1.save()
  const store2 = new Store({ ...initialStores[1], user: user?.id as string })
  await store2.save()
  const store3 = new Store({ ...initialStores[2], user: otherUser?.id as string })
  await store3.save()

  for (let i = 0; i < initialItems.length; i++) {
    const item = new Item({ ...initialItems[i], user: user?.id as string })
    const otherItem = new Item({ ...otherUsersInitialItems[i], user: otherUser?.id as string })
    await item.save()
    await otherItem.save()
  }
  for (let i = 0; i < initialEnchantments.length; i++) {
    const enchant = new Enchantment({ ...initialEnchantments[i], user: user?.id as string })
    const otherEnchant = new Enchantment({ ...otherUsersInitialEnchantments[i], user: otherUser?.id as string })
    await enchant.save()
    await otherEnchant.save()
  }
}

describe('Simple case', () => {
  beforeEach(async() => {
    await initTest()
  })

  test('Simple case', async () => {
    const result = await server.executeOperation(
      {
        query: generateItempool,
        variables: {
          store: 'testStore1',
          game: 'testGame1',
          seed: 'test'
        }
      }
    )
    console.log(result.data?.generateItempool)
    expect(true).toBe(false)
  })
})