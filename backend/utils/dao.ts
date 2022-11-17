// Point is to give abstraction to data access to mongo so it is easier to, for example, add cache later on
// This also adds the possbility of reusing code for other mutations
// This also makes it possible to test with mocks
// Dao is also responsible for ensuring that only valid data is added
import bcrypt from 'bcrypt'
import { User } from '../schemas/user'
import { SECRET } from './config'
import { Game } from '../schemas/game'
import { Store } from '../schemas/store'
import { Item } from '../schemas/item'
import jwt from 'jsonwebtoken'
import { AuthenticationError, UserInputError, ValidationError } from 'apollo-server-express'
import { GetEnchantmentsParams, GetItemsParams, GetStoresParams, NewEnchantRequest, NewGameRequest, NewItemRequest, NewStoreRequest, UpdateEnchantParams, UpdateGameParams, UpdateItemParams, UpdateStoreParams } from './types'
import { Enchantment } from '../schemas/enchantment'

//Checks if the name is already in use by the user
const validateName = async (name: string | undefined, schemaName: string, userId:string): Promise<boolean> => {
  if (!name) return true
  if (schemaName === 'Game') {
    const games = await Game.findOne({ name, user: userId })
    if (games !== null) {
      return false
    }
  }
  if (schemaName === 'Store') {
    const stores = await Store.findOne({ name, user: userId })
    if (stores !== null) {
      return false
    }
  }
  if (schemaName === 'Item') {
    const items = await Item.findOne({ name, user: userId })
    if (items !== null) {
      return false
    }
  }
  return true
}
const validateGamepool = async (gamepool: string[] | undefined, userId: string): Promise<boolean> => {
  if (!gamepool) return true
  const games = await Game.find({ name: gamepool, user: userId })
  if (games.length !== gamepool.length) {
    return false
  }
  return true
}

const validateStorepool = async (storepool: string[] | undefined, userId: string): Promise<boolean> => {
  if (!storepool) return true
  const stores = await Store.find({ name: storepool, user: userId  })
  if (stores.length !== storepool.length) {
    return false
  }
  return true
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
  // TODO check that all enchantments exist
  // Checking if the name is already in use by other user's game
  if (!await validateName(newGame.name, 'Game', userId)) {
    throw new ValidationError('Name is in use')
  }
  const game = new Game({ ...newGame, user: userId })
  try {
    const savedGame = await game.save()
    return (savedGame)
  } catch (e) {
    throw new UserInputError('Invalid game Info')
  }
}
const addStore = async (newStore: NewStoreRequest, userId: string) => {
  // Checking if the name is already in use by other user's store
  if (!await validateName(newStore.name, 'Store', userId)) {
    throw new ValidationError('Name is in use')
  }
  const gamepool = newStore.games
  //Check if all given games exist, assuming that no duplicate games exist
  if (!await validateGamepool(gamepool, userId)) {
    throw new UserInputError('Invalid gamepool')
  }
  const store = new Store({ ...newStore, user: userId })
  try {
    const savedStore = await store.save()
    return savedStore
  } catch (e){
    throw new UserInputError('Invalid Store Information')
  }
}
const addItem = async (newItem: NewItemRequest, userId: string) => {
  const storepool = newItem.storepool
  const gamepool = newItem.games
  // Checking if the name is already in use by other user's item
  if (!await validateName(newItem.name, 'Item', userId)) {
    throw new ValidationError('Name is in use')
  }
  // Check if all given stores exist, assuming that no duplicate stores exist
  if (!await validateStorepool(storepool, userId)) {
    throw new UserInputError('Invalid storepool')
  }
  //Check if all given games exist, assuming that no duplicate games exist
  if (!await validateGamepool(gamepool, userId)) {
    throw new UserInputError('Invalid gamepool')
  }
  const item = new Item({ ...newItem, user: userId })
  try {
    const savedItem = await item.save()
    return savedItem
  } catch (e) {
    throw new UserInputError('Invalid Item Information')
  }
}
const addEnchantment = async (newEnchant: NewEnchantRequest, userId: string) => {
  const gamepool = newEnchant.games
  //Check if all given games exist, assuming that no duplicate games exist
  if (!await validateGamepool(gamepool, userId)) {
    throw new UserInputError('Invalid gamepool')
  }
  const enchantment = new Enchantment({ ...newEnchant, user: userId })
  try {
    return await enchantment.save()
  } catch (e) {
    throw new UserInputError('Invalid Enchantment information')
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
  const stores = await Store.find({ games: name, user: userId })
  for (const store of stores) {
    // Remove all references to the deleted game
    await Store.findOneAndUpdate({
      _id: store.id as string,
      user: userId
    }, {
      games: store.games.filter(game => game !== name)
    })
  }
  const enchantments = await Enchantment.find({ games: name, user: userId })
  for (const enchantment of enchantments) {
    // Remove all references to the deleted game
    await Enchantment.findOneAndUpdate({
      _id: enchantment.id as string,
      user: userId
    }, {
      games: enchantment.games.filter(game => game !== name)
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
const removeEnchantment = async (id: string, userId: string) => {
  const enchantment = await Enchantment.findOneAndRemove({
    user: userId,
    id
  })
  if (!enchantment) {
    throw new UserInputError('No enchantment found')
  }
  return enchantment
}
const updateGame = async (game: UpdateGameParams, userId: string) => {
  // Checking if the name is already in use by other user's game
  if (!await validateName(game.name, 'Game', userId)) {
    throw new ValidationError('Name is in use')
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
  // Checking if the name is already in use by other user's store
  if (!await validateName(store.name, 'Store', userId)) {
    throw new ValidationError('Name is in use')
  }
  // Checking if all given games exist, assuming no duplicate games exist
  if (!await validateGamepool(store.games, userId)) {
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
  // Checking if the name is already in use by other user's item
  if (!await validateName(item.name, 'Item', userId)) {
    throw new ValidationError('Name is in use')
  }
  if (!await validateStorepool(item.storepool, userId)) {
    throw new UserInputError('Incorrect storepool')
  }
  if (!await validateGamepool(item.games, userId)) {
    throw new UserInputError('Incorrect gamepool')
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
const updateEnchantment = async (enchant: UpdateEnchantParams, userId: string) => {
  if (! await validateGamepool(enchant.games, userId)) {
    throw new UserInputError('Invalid gamepool')
  }
  const updatedEnchantment = await Enchantment.findOneAndUpdate({
    _id: enchant.id,
    user: userId
  }, {
    ...enchant
  })
  return updatedEnchantment
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
  if (!stores) {
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
const getItems = async (args: GetItemsParams | undefined, userId: string) => {
  if (!args) {
    return await Item.find({ user: userId })
  }
  //Check if the store exists
  const store = await Store.findOne({
    user: userId,
    name: args.name
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
const getEnchantments = async (args: GetEnchantmentsParams | undefined, userId: string) => {
  if (!args) {
    return await Enchantment.find({ user: userId })
  }
  if (args.game) {
    const game = await Game.findOne({
      user: userId,
      name: args.game
    })
    if (!game) {
      throw new UserInputError('Game not found')
    }
  } else {
    throw new UserInputError('Invalid arguments')
  }
  return await Enchantment.find({
    user: userId,
    games: args.game
  })
}
export default {
  addUser,
  login,
  addGame,
  addStore,
  addItem,
  addEnchantment,
  removeGame,
  removeStore,
  removeItem,
  removeEnchantment,
  updateGame,
  updateStore,
  updateItem,
  updateEnchantment,
  getGames,
  getGameInfo,
  getStores,
  getStoreInfo,
  getItems,
  getItemInfo,
  getEnchantments
}