import bcrypt from 'bcrypt'
import { toLoginRequest, toNewGameRequest, toNewStoreRequest, toNewItemRequest, getUser, toName, toUpdateItemParams, toUpdateGameParams, toUpdateStoreParams } from '../utils/parsers'
import { User } from '../schemas/user'
import { AuthenticationError, UserInputError } from 'apollo-server-express'
import jwt from 'jsonwebtoken'
import { SECRET } from '../utils/config'
import { Game } from '../schemas/game'
import { Store } from '../schemas/store'
import { Item } from '../schemas/item'

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
    const game = new Game({ name: newGame.name, user: user?._id })
    try {
      const savedGame = await game.save()
      return(savedGame)
    } catch (e) {
      throw new UserInputError('Invalid game Info')
    }
  },
  addStore: async (_root:unknown, args: unknown, context: unknown) => {
    //Parse args
    const newStore = toNewStoreRequest(args)
    const user = await getUser(context)
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
    let item
    if (storepool) {
      // Check if all given stores exist, assuming that no duplicate stores exist
      const stores = await Store.find({ name: { $in: storepool } })
      if (stores.length !== storepool.length) {
        throw new UserInputError('Invalid storepool')
      }
      item = new Item({ ...newItem, user: user?.id as string, storepool: stores })
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
    // Removing all refrences to the deleted game.
    // Yes, this is very inefficient, but it will be a rare case that user deletes a game.
    // Find all stores that refrence the deleted game
    const stores = await Store.find({ $in: [name, '$games' ] })
    for (const store of stores) {
      // Remove all references to the deleted game
      await Store.findOneAndUpdate({
        name: store.name,
        user: user?.id as string
      }, {
        ...store,
        games: store.games.map(game => game === name ? null : store)
      }, { new: true })
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
    // Removing all refrences to the deleted store.
    // Yes, this is very inefficient, but it will be a rare case that user deletes a store.
    // Find all items that refrence the deleted store
    const items = await Item.find({ $in: [name, '$storepool' ] })
    for (const item of items) {
      // Remove all references to the deleted store
      await Item.findOneAndUpdate({
        name: item.name,
        user: user?.id as string
      }, {
        ...item,
        storepool: item.storepool.map(store => store === name ? null : store)
      }, { new: true })
    }

    if (!store) {
      throw new UserInputError('No store found')
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
    // Checking if all given stores exist, assuming no duplicate stores exist
    const stores = await Store.find({ name: { $in: params.storepool } })
    if (stores.length !== params.storepool?.length && params.storepool) {
      throw new UserInputError('Incorrect storepool')
    }
    // No further checks are made, since mongoose will throw error with incorrect types
    const item = await Item.findOneAndUpdate({
      id: params.id,
      user: user?.id as string
    }, {
      ...params,
      id:undefined
    }, { new: true })
    return item
  },
  updateStore: async (_root: unknown, args: unknown, context: unknown) => {
    const user = await getUser(context)
    // Parse args
    const params = toUpdateStoreParams(args)
    // Checking if all given games exist, assuming no duplicate games exist
    const games = await Game.find({ name: { $in: params.games } })
    if (games.length !== params.games?.length && params.games) {
      throw new UserInputError('Invalid games list')
    }
    // No further checks are made, since mongoose will throw error with incorrect types
    const store = await Store.findOneAndUpdate({
      id: params.id,
      user: user?.id as string
    }, {
      ...params,
      id:undefined
    }, { new: true })
    return store
  },
  updateGame: async (_root: unknown, args: unknown, context: unknown) => {
    const user = await getUser(context)
    // Parse args
    const params = toUpdateGameParams(args)
    const game = await Game.findOneAndUpdate({
      id: params.id,
      user: user?.id as string
    }, {
      ...params,
      id:undefined
    }, { new: true })
    return game
  },
}