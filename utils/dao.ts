// Point is to give abstraction to data access to mongo, so it is easier to for example add cache later on
// This also adds the possbility of reusing code for other mutations
// This also makes it possible to test with mocks
// Dao is also responsible for ensuring that only valid data is added
import bcrypt from 'bcrypt'
import { User } from '../schemas/user'
import { SECRET } from '../utils/config'
import { Game } from '../schemas/game'
import { Store } from '../schemas/store'
import { Item } from '../schemas/item'
import jwt from 'jsonwebtoken'
import { AuthenticationError, UserInputError, ValidationError } from 'apollo-server-express'
import { GetItemsParams, GetStoresParams, NewGameRequest, NewItemRequest, NewStoreRequest, UpdateGameParams, UpdateItemParams, UpdateStoreParams } from './types'

//Checks if the name is already in use by the user
const validateName = async (userid: string, name: string, schemaName: string): Promise<boolean> => {
  if (schemaName === 'Game') {
    const games = await Game.findOne({ name, user: userid })
    if (games !== null) {
      return new Promise<boolean>((resolve, _reject) => {
        setTimeout(() => {
          resolve(false)
        },300)
      })
    }
  }
  if (schemaName === 'Store') {
    const stores = await Store.findOne({ name, user: userid })
    if (stores !== null) {
      return new Promise<boolean>((resolve, _reject) => {
        setTimeout(() => {
          resolve(false)
        },300)
      })
    }
  }
  if (schemaName === 'Item') {
    const items = await Item.findOne({ name, user: userid })
    if (items !== null) {
      return new Promise<boolean>((resolve, _reject) => {
        setTimeout(() => {
          resolve(false)
        },300)
      })
    }
  }
  return new Promise<boolean>((resolve, _reject) => {
    setTimeout(() => {
      resolve(true)
    },300)
  })
}

const addUser = async (username: string, password: string): Promise<string> => {
  const passwordHash = await bcrypt.hash(password, 10)
  const user = new User({
    username,
    passwordHash
  })
  const savedUser = await user.save()
  if (!savedUser) {
    throw new UserInputError('Invalid input')
  }
  return savedUser.username
}
const login = async (username: string, password: string): Promise<string> => {
  const user = await User.findOne({ username })
  if (!user) {
    throw new AuthenticationError('Invalid username')
  }
  //Check is user exists and validity of password
  const correctPassword = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)
  if (!correctPassword) {
    throw new AuthenticationError('Invalid password')
  }
  // Create token with username and id
  const token = jwt.sign({
    username,
    id: user.id as string
  }, SECRET)
  return token
}
const addGame = async (newGame: NewGameRequest, userId: string) => {
  // Checking if the name is already in use by other user's game
  if (!await validateName(userId, newGame.name, 'Game')) {
    throw new ValidationError('Name is in use')
  }
  const game = new Game({ ...newGame, user: userId })
  try {
    const savedGame = await game.save()
    return(savedGame)
  } catch (e) {
    console.log(e)
    throw new UserInputError('Invalid game Info')
  }
}
const addStore = async (newStore: NewStoreRequest, userId: string) => {
  // Checking if the name is already in use by other user's store
  if (!await validateName(userId, newStore.name, 'Store')) {
    throw new ValidationError('Name is in use')
  }
  const gamepool = newStore.games
  let store
  if (gamepool) {
    //Check if all given games exist, assuming that no duplicate games exist
    const games = await Game.find({ name: { $in: gamepool } })
    if (games.length !== gamepool.length) {
      throw new UserInputError('Invalid gamepool')
    }
    store = new Store({ ...newStore, user: userId, games: gamepool })
  } else {
    store = new Store({ ...newStore, user: userId })
  }
  try {
    const savedStore = await store.save()
    return savedStore
  } catch(e){
    throw new UserInputError('Invalid Store Information')
  }
}
const addItem = async (newItem: NewItemRequest, userId:string) => {
  const storepool = newItem.storepool
  // Checking if the name is already in use by other user's item
  if(!await validateName(userId, newItem.name, 'Item')) {
    throw new ValidationError('Name is in use')
  }
  let item
  if (storepool) {
    // Check if all given stores exist, assuming that no duplicate stores exist
    const stores = await Store.find({ name: storepool, user: userId  })
    if (stores.length !== storepool.length) {
      throw new UserInputError('Invalid storepool')
    }
    item = new Item({ ...newItem, user: userId, storepool })
  } else {
    item = new Item({ ...newItem , user: userId })
  }
  try {
    const savedItem = await item.save()
    return savedItem
  } catch(e) {
    throw new UserInputError('Invalid Item Information')
  }
}
const removeGame = async (name: string, userId: string) => {
  const game = await Game.findOneAndRemove({
    user: userId,
    name
  })
  if (!game) {
    throw new UserInputError('No game found')
  }
  // Removing all refrences to the deleted game.
  // Yes, this is very inefficient, but it will be a rare case that user deletes a game.
  // Honestly I should have used relational database for this project
  // Find all stores that refrence the deleted game
  const stores = await Store.find({ games: name })
  for (const store of stores) {
    // Remove all references to the deleted game
    await Store.findOneAndUpdate({
      _id: store.id as string,
      user: userId
    }, {
      games: store.games.filter(game => game !== name)
    })
  }
  return game
}
const removeStore = async (name: string, userId: string) => {
  const store = await Store.findOneAndRemove({
    user: userId,
    name
  })
  if (!store) {
    throw new UserInputError('No store found')
  }
  // Removing all refrences to the deleted store.
  // Yes, this is very inefficient, but it will be a rare case that user deletes a store.
  // Find all items that refrence the deleted store
  const items = await Item.find({ storepool: name })
  for (const item of items) {
    // Remove all references to the deleted store
    await Item.findOneAndUpdate({
      _id: item.id as string,
      user: userId
    }, {
      storepool: item.storepool.filter(store => store !== name)
    })
  }
  return store
}
const removeItem = async (name: string, userId: string) => {
  const item = await Item.findOneAndRemove({
    user: userId,
    name
  })
  if (!item) {
    throw new UserInputError('No item found')
  }
  return item
}
const updateGame = async (game: UpdateGameParams, userId: string) => {
  if (game.name) {
    // Checking if the name is already in use by other user's game
    if(!await validateName(userId, game.name, 'Game')){
      throw new ValidationError('Name is in use')
    }
  }
  const updatedGame = await Game.findOneAndUpdate({
    _id: game.id,
    user: userId
  }, {
    ...game
  })
  return updatedGame
}
const updateStore = async (store: UpdateStoreParams, userId: string) => {
  if (store.name) {
    // Checking if the name is already in use by other user's store
    if(!await validateName(userId, store.name, 'Store')){
      throw new ValidationError('Name is in use')
    }
  }
  // Checking if all given games exist, assuming no duplicate games exist
  const games = await Game.find({ name: { $in: store.games }, user: userId })
  if (games.length !== store.games?.length && store.games) {
    throw new UserInputError('Invalid games list')
  }
  // No further checks are made, since mongoose will throw error with incorrect types
  const updatedStore = await Store.findOneAndUpdate({
    _id: store.id,
    user: userId
  }, {
    ...store
  })
  return updatedStore
}
const updateItem = async (item: UpdateItemParams, userId: string) => {
  if (item.name) {
    // Checking if the name is already in use by other user's item
    if(!await validateName(userId, item.name, 'Item')) {
      throw new ValidationError('Name is in use')
    }
  }
  // Checking if all given stores exist, assuming no duplicate stores exist
  const stores = await Store.find({ name: item.storepool, user:userId })
  if (stores.length !== item.storepool?.length && item.storepool) {
    throw new UserInputError('Incorrect storepool')
  }
  // No further checks are made, since mongoose will throw error with incorrect types
  const updatedItem = await Item.findOneAndUpdate({
    _id: item.id,
    user: userId
  }, {
    ...item
  })
  return updatedItem
}
const getGames = async (userId: string) => {
  const games = await Game.find({ user: userId })
  return games
}
const getGameInfo = async (name: string, userId: string) => {
  const game = await Game.findOne({
    user: userId,
    name
  })
  return game
}
const getStores = async (stores: GetStoresParams | undefined, userId: string) => {
  if(!stores) {
    return await Store.find({ user: userId })
  }
  // Check if the user has the game
  const game = await Game.findOne({
    user: userId,
    name: stores.game
  })
  if (game === null) {
    throw new UserInputError('Game not found')
  }
  // Find all user's stores that have the given game in their games
  return await Store.find({
    user: userId,
    games: game.name
  })
}
const getStoreInfo = async (name: string, userId: string) => {
  const store = await Store.findOne({
    user: userId,
    name
  })
  return store
}
const getItems = async (items: GetItemsParams | undefined,userId: string) => {
  if (!items) {
    return await Item.find({ user: userId })
  }
  //Check if the store exists
  const store = await Store.findOne({
    user: userId,
    name: items.name
  })
  if (!store) {
    throw new UserInputError('Store not found')
  }
  // Gets all user's items that have the given store in store pool and all baseItems
  return await Item.find({
    user: userId,
    $or: [
      { baseItem: true },
      { storepool: store.name }
    ] }
  )
}
const getItemInfo = async (name: string, userId: string) => {
  const item = await Item.findOne({
    user: userId,
    name
  })
  return item
}
const generateItempool = async (name: string, userId:string) => {
  //This function does not work currently, it is under development
  const store = await Store.findOne({ name, user: userId })
  if (!store) {
    throw new UserInputError('Store not found')
  }
  const items = await getItems({ name }, userId)
  return items
  // This will be implemented later on in the store schema
  //const storeCapacity = 10
  // Now we have a list of rarities that will be in the store.
  // E.g. if itemRarities is ['Common','Common', 'Rare'] the store will have two common items and one rare item
  //const itemRarities = generateItemRarities(storeCapacity, store.itemTypeProbabilities)
}
export default {
  addUser,
  login,
  addGame,
  addStore,
  addItem,
  removeGame,
  removeStore,
  removeItem,
  updateGame,
  updateStore,
  updateItem,
  getGames,
  getGameInfo,
  getStores,
  getStoreInfo,
  getItems,
  getItemInfo,
  generateItempool
}