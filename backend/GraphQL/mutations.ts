import { toLoginRequest, toNewGameRequest, toNewStoreRequest, toNewItemRequest, getUser, toName, toUpdateItemParams, toUpdateGameParams, toUpdateStoreParams, toId, toUpdateEnchantmentParams, toNewEnchantmentRequest } from '../utils/parsers'
import dao from '../utils/dao'

export const Mutation = {
  addUser: async (_root: unknown, args: unknown) => {
    //Parse params
    const { username, password } = toLoginRequest(args)
    const newUsername = await dao.addUser(username, password)
    return ({ value: newUsername })
  },
  login: async (_root: unknown, args: unknown) => {
    // Parse params
    const { username, password } = toLoginRequest(args)
    const token = await dao.login(username, password)
    return ({ value: token })
  },
  addGame: async (_root:unknown, args: unknown, context: unknown) => {
    //Parse params
    const newGame = toNewGameRequest(args)
    const user = await getUser(context)
    const game = await dao.addGame(newGame, user?.id as string)
    return game
  },
  addStore: async (_root:unknown, args: unknown, context: unknown) => {
    //Parse params
    const newStore = toNewStoreRequest(args)
    const user = await getUser(context)
    const store = await dao.addStore(newStore, user?.id as string)
    return store
  },
  addItem: async (_root:unknown, args: unknown, context: unknown) => {
    // Parse params
    const newItem = toNewItemRequest(args)
    const user = await getUser(context)
    const item = await dao.addItem(newItem, user?.id as string)
    return item
  },
  addEnchantment: async (_root:unknown, args: unknown, context: unknown) => {
    // Parse params
    const newEnchant = toNewEnchantmentRequest(args)
    const user = await getUser(context)
    const enchantment = await dao.addEnchantment(newEnchant, user?.id as string)
    return enchantment
  },
  removeGame: async (_root:unknown, args: unknown, context: unknown) => {
    const user = await getUser(context)
    // Parse params
    const name = toName(args)
    const game = await dao.removeGame(name, user?.id as string)
    return game
  },
  removeStore: async (_root: unknown, args: unknown, context: unknown) => {
    const user = await getUser(context)
    // Parse params
    const name = toName(args)
    const store = await dao.removeStore(name, user?.id as string)
    return store
  },
  removeItem: async (_root: unknown, args: unknown, context: unknown) => {
    const user = await getUser(context)
    // Parse params
    const name = toName(args)
    const item = await dao.removeItem(name, user?.id as string)
    return item
  },
  removeEnchantment: async (_root: unknown, args: unknown, context: unknown) => {
    const user = await getUser(context)
    // Parse params
    const id = toId(args)
    const enchantment = await dao.removeEnchantment(id, user?.id as string)
    return enchantment
  },
  updateGame: async (_root: unknown, args: unknown, context: unknown) => {
    const user = await getUser(context)
    // Parse params
    const params = toUpdateGameParams(args)
    const game = await dao.updateGame(params, user?.id as string)
    return game
  },
  updateStore: async (_root: unknown, args: unknown, context: unknown) => {
    const user = await getUser(context)
    // Parse params
    const params = toUpdateStoreParams(args)
    const store = await dao.updateStore(params, user?.id as string)
    return store
  },
  updateItem: async (_root: unknown, args: unknown, context: unknown) => {
    const user = await getUser(context)
    // Parse params
    const params = toUpdateItemParams(args)
    const item = await dao.updateItem(params, user?.id as string)
    return item
  },
  updateEnchantment: async (_root: unknown, args: unknown, context: unknown) => {
    const user = await getUser(context)
    // Parse params
    const params = toUpdateEnchantmentParams(args)
    const enchantment = await dao.updateEnchantment(params, user?.id as string)
    return enchantment
  }
}