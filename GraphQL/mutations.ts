import bcrypt from 'bcrypt'
import { toLoginRequest, toNewGameRequest, toNewStoreRequest, toNewItemRequest, getUser, toName } from '../utils/parsers'
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
    const game = new Game({ name: newGame.name, user })
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
      store = new Store({ ...newStore, user, games: gamepool })
    } else {
      store = new Store({ ...newStore, user })
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
      item = new Item({ ...newItem, user, storepool: stores })
    } else {
      item = new Item({ ...newItem , user })
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
    const game = await Game.findOneAndRemove({ $and: [
      { $match: { user } },
      { $match: { name } }
    ] })
    return game
  },
  removeStore: async (_root: unknown, args: unknown, context: unknown) => {
    //TODO: Remove refrences from items to deleted store
    const user = await getUser(context)
    const name = toName(args)
    const store = await Store.findOneAndRemove({ $and: [
      { $match: { user } },
      { $match: { name } }
    ] })
    return store
  },
  removeItem: async (_root: unknown, args: unknown, context: unknown) => {
    const user = await getUser(context)
    console.log(`user is ${user}`)
    const name = toName(args)
    console.log(`name is ${name}`)
    const item = await Item.findOneAndRemove({ $and: [
      { $match: { user } },
      { $match: { name } }
    ] })
    return item
  }
}