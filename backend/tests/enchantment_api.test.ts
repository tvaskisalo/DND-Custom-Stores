import { ApolloServer } from 'apollo-server-express'
import { User } from '../schemas/user'
import { Enchantment } from '../schemas/enchantment'
import { addEnchantmentMutation, getEnchantmentsQuery, removeEnchantmentMutation, updateEnchantmentMutation } from './testQueries'
import testServer from './testServer'

let server: ApolloServer

const initialEnchantments = [
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
  }, {
    name: 'Thunder',
    tier: 1,
    weapon: true,
    armor: false
  }
]

const incorrectEnchantments = [
  {
    name: '',
    tier: 1,
    damage: '1d6',
    damageTypes: ['Fire'],
    description: 'Adds fire damage to a weapon',
    weapon: true,
    armor: false
  },
  {
    tier: 1,
    damage: '1d12',
    damageTypes: ['Frost'],
    description: 'Adds frost damage to a weapon',
    weapon: true,
    armor: false
  }
]

//This is used for testing getters, updating and deleting
const initTest = async () => {
  await Enchantment.deleteMany()
  const user = await User.findOne({ username: 'testUser' })
  const otherUser = await User.findOne({ username: 'otherUser' })
  const enchant1 = new Enchantment({ ...initialEnchantments[0], user: user?.id as string })
  await enchant1.save()
  const enchant2 = new Enchantment({ ...initialEnchantments[1], user: user?.id as string })
  await enchant2.save()
  const enchant3 = new Enchantment({ ...initialEnchantments[2], user: user?.id as string })
  await enchant3.save()
  const enchant4 = new Enchantment({ ...initialEnchantments[3], user: otherUser?.id as string })
  await enchant4.save()
}

beforeAll( async () => {
  // User that is logged in has the username testUser.
  // There exists another user with the username otherUser that is not logged in
  server = await testServer()
}, 10000)

describe('Echantment addition', () => {
  beforeEach(async () => {
    await Enchantment.deleteMany()
  })
  test('Valid enchantment can be added', async () => {
    const enchant = initialEnchantments[0]
    const result = await server.executeOperation(
      {
        query: addEnchantmentMutation,
        variables: { ...enchant }
      }
    )
    expect(result.errors).toBeUndefined()
    expect(result.data).toBeDefined()
    expect(result.data?.addEnchantment).toBeDefined()
    const addedEnchantment = await Enchantment.findOne({})
    expect(addedEnchantment).not.toBe(null)
  })
  test('Some fields can be empty', async () => {
    const enchant = initialEnchantments[2]
    const result = await server.executeOperation(
      {
        query: addEnchantmentMutation,
        variables: { ...enchant }
      }
    )
    expect(result.errors).toBeUndefined()
    expect(result.data).toBeDefined()
    expect(result.data?.addEnchantment).toBeDefined()
    const addedEnchantment = await Enchantment.findOne({})
    expect(addedEnchantment).not.toBe(null)
  })
  test('Name cannot be empty', async () => {
    const enchant = incorrectEnchantments[0]
    const result = await server.executeOperation(
      {
        query: addEnchantmentMutation,
        variables: { ...enchant }
      }
    )
    expect(result.errors).toBeDefined()
    expect(result.data?.addedEnchantment).toBeUndefined()
    const addedEnchantment = await Enchantment.findOne({})
    expect(addedEnchantment).toBe(null)
  })
  test('Name must be defined', async () => {
    const enchant = incorrectEnchantments[1]
    const result = await server.executeOperation(
      {
        query: addEnchantmentMutation,
        variables: { ...enchant }
      }
    )
    expect(result.errors).toBeDefined()
    expect(result.data).toBeUndefined()
    const addedEnchantment = await Enchantment.findOne({})
    expect(addedEnchantment).toBe(null)
  })

})

describe('Enchantment getter', () => {
  beforeEach(async () => {
    await Enchantment.deleteMany()
    await initTest()
  })

  test('Getter returns all enchantments with no game defined', async () => {
    const result = await server.executeOperation(
      {
        query: getEnchantmentsQuery
      }
    )
    expect(result.errors).toBeUndefined()
    expect(result.data?.getEnchantments.length).toBe(3)
  })
})
describe('Enchantment deletion', () => {
  beforeEach(async () => {
    await Enchantment.deleteMany()
    await initTest()
  })

  test('User can delete enchantments', async () => {
    const enchant = await Enchantment.findOne({ name: 'Fire' })
    const result = await server.executeOperation(
      {
        query: removeEnchantmentMutation,
        variables: {
          id: enchant?.id as string
        }
      }
    )
    expect(result.errors).toBeUndefined()
    const removedEnchantment = await Enchantment.findOne({ name: 'Fire' })
    expect(removedEnchantment).toBe(null)
  })

  test('User cant delete other users enchantments', async () => {
    const enchant = await Enchantment.findOne({ name: 'Thunder' })
    const result = await server.executeOperation(
      {
        query: removeEnchantmentMutation,
        variables: {
          id: enchant?.id as string
        }
      }
    )
    expect(result.errors).toBeUndefined()
    const removedEnchantment = await Enchantment.findOne({ name: 'Thunder' })
    expect(removedEnchantment).not.toBe(null)
  })
})
describe('Enchantment updating', () => {
  beforeEach(async () => {
    await Enchantment.deleteMany()
    await initTest()
  })
  test('User can update enchantment', async () => {
    const enchant = await Enchantment.findOne({ name: 'Fire' })
    const result = await server.executeOperation(
      {
        query: updateEnchantmentMutation,
        variables: {
          name: 'Water',
          id: enchant?.id as string
        }
      }
    )
    expect(result.errors).toBeUndefined()
    const updatedEnchant = await Enchantment.findOne({ name: 'Water' })
    expect(updatedEnchant).not.toBe(null)
  })
  test('User can not update enchantment with empty name', async () => {
    const enchant = await Enchantment.findOne({ name: 'Fire' })
    const result = await server.executeOperation(
      {
        query: updateEnchantmentMutation,
        variables: {
          name: '',
          id: enchant?.id as string
        }
      }
    )
    expect(result.errors).toBeUndefined()
    const updatedEnchant = await Enchantment.findOne({ name: 'Fire' })
    expect(updatedEnchant).not.toBe(null)
  })
  test('User can not update other users enchantment', async () => {
    const enchant = await Enchantment.findOne({ name: 'Thunder' })
    const result = await server.executeOperation(
      {
        query: updateEnchantmentMutation,
        variables: {
          name: 'Water',
          id: enchant?.id as string
        }
      }
    )
    expect(result.errors).toBeUndefined()
    const updatedEnchant = await Enchantment.findOne({ name: 'Water' })
    expect(updatedEnchant).toBe(null)
  })

})

afterAll(async () => {
  await server.stop()
  await User.deleteMany()
  await Enchantment.deleteMany()
})


