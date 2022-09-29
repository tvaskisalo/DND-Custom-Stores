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
    const { username, password } = toLoginRequest(args)
    const passwordHash = await bcrypt.hash(password, 10)
    const user = new User({
      username: username,
      passwordHash
    })
    const savedUser = await user.save()
    if (!savedUser) {
      throw new UserInputError('Invalid input')
    }
    return({ value: savedUser.username })
  },
  login: async (_root: unknown, args: unknown) => {
    const { username, password } = toLoginRequest(args)
    const user = await User.findOne({ username })
    if (!user) {
      throw new AuthenticationError('Invalid username')
    }
    const correctPassword = user === null
      ? false
      : await bcrypt.compare(password, user.passwordHash)
    if (!correctPassword) {
      throw new AuthenticationError('Invalid password')
    }
    const token = jwt.sign({
      username,
      id: user.id as string
    }, SECRET)
    return({ value: token })
  },
  addGame: async (_root:unknown, args: unknown, context: unknown) => {
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
    const newStore = toNewStoreRequest(args)
    const user = await getUser(context)
    const gamepool = newStore.game
    let store
    if (gamepool) {
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
    const newItem = toNewItemRequest(args)
    const storepool = newItem.storepool
    const user = await getUser(context)
    let item
    //Checking if all the given stores in storepool exist, this will be refactored later on
    if (storepool) {
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
    //TODO: Remove refrences from stores to deleted game
    const user = await getUser(context)
    const name = toName(args)
    const game = await Game.findOneAndRemove({
      user: user?.id as string,
      name
    })
    return game
  },
  removeStore: async (_root: unknown, args: unknown, context: unknown) => {
    //TODO: Remove refrences from items to deleted store
    const user = await getUser(context)
    const name = toName(args)
    const store = await Store.findOneAndRemove({
      user: user?.id as string,
      name
    })
    if (!store) {
      throw new UserInputError('No store found')
    }
    return store
  },
  removeItem: async (_root: unknown, args: unknown, context: unknown) => {
    const user = await getUser(context)
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
    // TODO: Checking if updated storepool stores exist
    const user = await getUser(context)
    const params = toUpdateItemParams(args)
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
    // TODO: Check if the games exist
    const user = await getUser(context)
    const params = toUpdateStoreParams(args)
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