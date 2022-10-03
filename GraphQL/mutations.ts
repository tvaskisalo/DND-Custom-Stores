import bcrypt from 'bcrypt'
import { toLoginRequest, toNewGameRequest, toNewStoreRequest, toNewItemRequest, getUser, toName, toUpdateItemParams, toUpdateGameParams, toUpdateStoreParams } from '../utils/parsers'
import { User } from '../schemas/user'
import { AuthenticationError, UserInputError, ValidationError } from 'apollo-server-express'
import jwt from 'jsonwebtoken'
import { SECRET } from '../utils/config'
import { Game } from '../schemas/game'
import { Store } from '../schemas/store'
import { Item } from '../schemas/item'

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
export const Mutation = {
  addUser: async (_root: unknown, args: unknown) => {
    //Parse args
    const { username, password } = toLoginRequest(args)
    const passwordHash = await bcrypt.hash(password, 10)
    const user = new User({
      username,
      passwordHash
    })
    const savedUser = await user.save()
    if (!savedUser) {
      throw new UserInputError('Invalid input')
    }
    return({ value: savedUser.username })
  },
  login: async (_root: unknown, args: unknown) => {
    // Parse args
    const { username, password } = toLoginRequest(args)
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
    return({ value: token })
  },
  addGame: async (_root:unknown, args: unknown, context: unknown) => {
    //Parse args
    const newGame = toNewGameRequest(args)
    const user = await getUser(context)
    // Checking if the name is already in use by other user's game
    if (!await validateName(user?.id as string, newGame.name, 'Game')) {
      throw new ValidationError('Name is in use')
    }
    const game = new Game({ name: newGame.name, user: user?.id as string })
    try {
      const savedGame = await game.save()
      return(savedGame)
    } catch (e) {
      console.log(e)
      throw new UserInputError('Invalid game Info')
    }
  },
  addStore: async (_root:unknown, args: unknown, context: unknown) => {
    //Parse args
    const newStore = toNewStoreRequest(args)
    const user = await getUser(context)
    // Checking if the name is already in use by other user's store
    if (!await validateName(user?.id as string, newStore.name, 'Store')) {
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
      store = new Store({ ...newStore, user: user?.id as string, games: gamepool })
    } else {
      store = new Store({ ...newStore, user: user?.id as string })
    }
    try {
      const savedStore = await store.save()
      return savedStore
    } catch(e){
      throw new UserInputError('Invalid Store Information')
    }
  },
  addItem: async (_root:unknown, args: unknown, context: unknown) => {
    // Parse args
    const newItem = toNewItemRequest(args)
    const storepool = newItem.storepool
    const user = await getUser(context)
    // Checking if the name is already in use by other user's item
    if(!await validateName(user?.id as string, newItem.name, 'Item')) {
      throw new ValidationError('Name is in use')
    }
    let item
    if (storepool) {
      // Check if all given stores exist, assuming that no duplicate stores exist
      const stores = await Store.find({ name: storepool, user: user?.id as string  })
      if (stores.length !== storepool.length) {
        throw new UserInputError('Invalid storepool')
      }
      item = new Item({ ...newItem, user: user?.id as string, storepool })
    } else {
      item = new Item({ ...newItem , user: user?.id as string })
    }
    try {
      const savedItem = await item.save()
      return savedItem
    } catch(e) {
      throw new UserInputError('Invalid Item Information')
    }
  },
  removeGame: async (_root:unknown, args: unknown, context: unknown) => {
    const user = await getUser(context)
    // Parse args
    const name = toName(args)
    const game = await Game.findOneAndRemove({
      user: user?.id as string,
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
        user: user?.id as string
      }, {
        games: store.games.filter(game => game !== name)
      })
    }
    return game
  },
  removeStore: async (_root: unknown, args: unknown, context: unknown) => {
    const user = await getUser(context)
    // Parse args
    const name = toName(args)
    const store = await Store.findOneAndRemove({
      user: user?.id as string,
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
        user: user?.id as string
      }, {
        storepool: item.storepool.filter(store => store !== name)
      })
    }
    return store
  },
  removeItem: async (_root: unknown, args: unknown, context: unknown) => {
    const user = await getUser(context)
    // Parse args
    const name = toName(args)
    const item = await Item.findOneAndRemove({
      user: user?.id as string,
      name
    })
    if (!item) {
      throw new UserInputError('No item found')
    }
    return item
  },
  updateItem: async (_root: unknown, args: unknown, context: unknown) => {
    const user = await getUser(context)
    // Parse args
    const params = toUpdateItemParams(args)
    if (params.name) {
      // Checking if the name is already in use by other user's item
      if(!await validateName(user?.id as string, params.name, 'Item')) {
        throw new ValidationError('Name is in use')
      }
    }
    // Checking if all given stores exist, assuming no duplicate stores exist
    const stores = await Store.find({ name: params.storepool, user:user?.id as string })
    if (stores.length !== params.storepool?.length && params.storepool) {
      throw new UserInputError('Incorrect storepool')
    }
    // No further checks are made, since mongoose will throw error with incorrect types
    const item = await Item.findOneAndUpdate({
      _id: params.id,
      user: user?.id as string
    }, {
      ...params
    })
    return item
  },
  updateStore: async (_root: unknown, args: unknown, context: unknown) => {
    const user = await getUser(context)
    // Parse args
    const params = toUpdateStoreParams(args)
    if (params.name) {
      // Checking if the name is already in use by other user's store
      if(!await validateName(user?.id as string, params.name, 'Store')){
        throw new ValidationError('Name is in use')
      }
    }
    // Checking if all given games exist, assuming no duplicate games exist
    const games = await Game.find({ name: { $in: params.games }, user: user?.id as string })
    if (games.length !== params.games?.length && params.games) {
      throw new UserInputError('Invalid games list')
    }
    // No further checks are made, since mongoose will throw error with incorrect types
    const store = await Store.findOneAndUpdate({
      _id: params.id,
      user: user?.id as string
    }, {
      ...params
    })
    return store
  },
  updateGame: async (_root: unknown, args: unknown, context: unknown) => {
    const user = await getUser(context)
    // Parse args
    const params = toUpdateGameParams(args)
    if (params.name) {
      // Checking if the name is already in use by other user's game
      if(!await validateName(user?.id as string, params.name, 'Game')){
        throw new ValidationError('Name is in use')
      }
    }
    const game = await Game.findOneAndUpdate({
      _id: params.id,
      user: user?.id as string
    }, {
      ...params
    })
    return game
  },
}