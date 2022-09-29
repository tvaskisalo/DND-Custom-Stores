// This test expects that user_api.test.ts passes'
import { ApolloServer } from 'apollo-server-express'
import { User } from '../schemas/user'
import { Item } from '../schemas/item'
import { Store } from '../schemas/store'
import { addItemMutation, removeItemMutation, updateItemMutation } from './testQueries'
import testServer from './testServer'

let server: ApolloServer

beforeAll( async () => {
  // User that is logged in has the name testName.
  // There exists another user with the name otherUser that is not logged in
  server = await testServer()
},100000)

describe('Item addition', () => {
  beforeEach(async () => {
    await Item.deleteMany()
  })

  test('Valid item can be added', async () => {
    //Valid storepools are tested elsewhere
    const item = {
      name: 'testName',
      material: 'testMaterial',
      baseCost: 100,
      weight: 10,
      properties: 'testProperties',
      damage: 'testDamage',
      damageTypes: ['testDamageType'],
      baseItem: true,
      unique: false
    }
    const result = await server.executeOperation(
      {
        query: addItemMutation,
        variables: { ...item }
      }
    )
    expect(result.errors).toBeUndefined()
    expect(result.data).toBeDefined()
    expect(result.data?.addItem).toBeDefined()
  })

  test('Some fields can be empty', async () => {
    const item = {
      name: 'testName',
      baseItem: false,
      unique: true
    }
    const result = await server.executeOperation(
      {
        query: addItemMutation,
        variables: { ...item }
      }
    )
    expect(result.errors).toBeUndefined()
    expect(result.data).toBeDefined()
    expect(result.data?.addItem).toBeDefined()
  })

  test('Name can not be empty', async () => {
    const item = {
      name: '',
      baseItem: false,
      unique: true
    }
    const result = await server.executeOperation(
      {
        query: addItemMutation,
        variables: { ...item }
      }
    )
    expect(result.errors).toBeDefined()
    expect(result.data?.addItem).toEqual(null)
  })

  test('Field name must be defined', async () => {
    const item = {
      baseItem: false,
      unique: true
    }
    const result = await server.executeOperation(
      {
        query: addItemMutation,
        variables: { ...item }
      }
    )
    expect(result.errors).toBeDefined()
  })

  test('Field baseItem must be defined', async () => {
    const item = {
      name: 'testName',
      unique: true
    }
    const result = await server.executeOperation(
      {
        query: addItemMutation,
        variables: { ...item }
      }
    )
    expect(result.errors).toBeDefined()
    expect(result.data?.addItem).toBeUndefined()
  })

  test('Field unique must be defined', async () => {
    const item = {
      name: 'testName',
      baseItem: false
    }
    const result = await server.executeOperation(
      {
        query: addItemMutation,
        variables: { ...item }
      }
    )
    expect(result.errors).toBeDefined()
    expect(result.data?.addItem).toBeUndefined()
  })

  test('Name must be unique', async () => {
    const item = {
      name: 'testName',
      baseItem: false,
      unique: true
    }
    const user = await User.findOne({ username: 'testUser' })
    const newItem = new Item({ ...item, user })
    await newItem.save()

    const result = await server.executeOperation(
      {
        query: addItemMutation,
        variables: { ...item }
      }
    )
    expect(result.errors).toBeDefined()
  })
})

describe('Item deletion', () => {
  beforeEach(async () => {
    await Item.deleteMany()
    const item1 = {
      name: 'testName1',
      baseItem: false,
      unique: true
    }
    const item2 = {
      name: 'testName2',
      baseItem: true,
      unique: true
    }
    const item3 = {
      name: 'testName3',
      baseItem: true,
      unique: true
    }
    const otherUser = await User.findOne({ username: 'otherUser' })
    const user = await User.findOne({ username: 'testUser' })
    const newItem1 = new Item({ ...item1, user: user?.id as string })
    await newItem1.save()
    const newItem2 = new Item({ ...item2, user: user?.id as string })
    await newItem2.save()
    const newItem3 = new Item({ ...item3, user: otherUser?.id as string })
    await newItem3.save()
  })

  test('Correct item gets deleted', async () => {
    const result = await server.executeOperation(
      {
        query: removeItemMutation,
        variables: { name: 'testName1' }
      }
    )
    expect(result.errors).toBeUndefined()
    const items = await Item.find({})
    expect(items.length).toEqual(2)
    if (items && items[0] && items[0].name && items[1] && items[1].name) {
      expect(items[0].name).not.toEqual('testName1')
      expect(items[1].name).not.toEqual('testName1')
    }
  })

  test('User can not delete other users items', async () => {
    const result = await server.executeOperation(
      {
        query: removeItemMutation,
        variables: { name: 'testName3' }
      }
    )
    expect(result.errors).toBeDefined()
    const items = await Item.find({})
    expect(items.length).toEqual(3)
  })
})

describe('Item updating', () => {
  beforeEach(async() => {
    await Store.deleteMany()
    await Item.deleteMany()
    const item1 = {
      name: 'testName1',
      baseItem: false,
      unique: true
    }
    const item2 = {
      name: 'testName2',
      baseItem: true,
      unique: true
    }
    const item3 = {
      name: 'testName3',
      baseItem: true,
      unique: true
    }
    const otherUser = await User.findOne({ username: 'otherUser' })
    const user = await User.findOne({ username: 'testUser' })
    const newItem1 = new Item({ ...item1, user: user?.id as string })
    await newItem1.save()
    const newItem2 = new Item({ ...item2, user: user?.id as string })
    await newItem2.save()
    const newItem3 = new Item({ ...item3, user: otherUser?.id as string })
    await newItem3.save()
  })

  test('Correct update request is succesful', async () => {
    const item1 = await Item.findOne({ name: 'testName1' })
    const result = await server.executeOperation({
      query: updateItemMutation,
      variables: {
        id: item1?.id as string,
        name: 'UpdatedItem',
        material: 'testMaterial',
        baseCost: 100,
        weight: 10,
        properties: 'testProperties',
        damage: 'testDamage',
        damageTypes: ['testDamageType'],
        baseItem: true,
        unique: false
      }
    })
    expect(result.errors).toBeUndefined()
    // For some reason this is needed here but nowhere else. I am confused
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = result.data?.updateItem
    expect(data.name).toBe('UpdatedItem')
    expect(data.material).toEqual('testMaterial')
    expect(data.baseCost).toEqual(100)
    expect(data.weight).toEqual(10)
    expect(data.properties).toEqual('testProperties')
    expect(data.damage).toEqual('testDamage')
    expect(data.damageTypes.length).toEqual(1)
    expect(data.damageTypes[0]).toEqual('testDamageType')
    expect(data.baseItem).toEqual(true)
    expect(data.unique).toEqual(false)
  })

  test('User cant update another users items', async () => {
    const item1 = await Item.findOne({ name: 'testName3' })
    const result = await server.executeOperation({
      query: updateItemMutation,
      variables: {
        id: item1?.id as string,
        name: 'UpdatedItem',
        material: 'testMaterial',
        baseCost: 100,
        weight: 10,
        properties: 'testProperties',
        damage: 'testDamage',
        damageTypes: ['testDamageType'],
        baseItem: false,
        unique: false
      }
    })
    expect(result.errors).toBeUndefined()
    const updatedStore = await Item.findOne({ name: 'testName3' })
    expect(updatedStore?.name).toBe('testName3')
    expect(updatedStore?.material).toBeUndefined()
    expect(updatedStore?.baseCost).toBeUndefined()
    expect(updatedStore?.weight).toBeUndefined()
    expect(updatedStore?.properties).toBeUndefined()
    expect(updatedStore?.damage).toBeUndefined()
    expect(updatedStore?.damageTypes.length).toBe(0)
    expect(updatedStore?.baseItem).toEqual(true)
    expect(updatedStore?.unique).toEqual(true)
  })
})


afterAll(async () => {
  //I found some undefined behavior and this should fix it
  await server.stop()
  await User.deleteMany()
  await Store.deleteMany()
  await Item.deleteMany()
})