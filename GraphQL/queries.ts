import { toName, getUser, toGetItemsParams, toGetStoresParams, toGetEnchantmentsParams } from '../utils/parsers'
import dao from '../utils/dao'

export const Query = {
  getGames: async (_root: unknown, _args: unknown, context: unknown) => {
    const user = await getUser(context)
    const games = await dao.getGames(user?.id as string)
    return games
  },
  getGameInfo: async (_root: unknown, args: unknown, context: unknown) => {
    const user = await getUser(context)
    // Parse args
    const name = toName(args)
    const game = await dao.getGameInfo(name, user?.id as string)
    return game
  },
  // We have to set args as any, instead of unknow so that TypeScript does not complain about checking the nullish value
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getStores: async (_root: unknown, args: any, context: unknown) => {
    const user = await getUser(context)
    //If no game is specified, return all user's stores
    // Enable unsafe argument to check nullish value. I do not see a better way
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (Object.keys(args).length === 0) {
      const stores = await dao.getStores(undefined, user?.id as string)
      return stores
    }
    // Parse args
    const params = toGetStoresParams(args)
    const stores = await dao.getStores(params, user?.id as string)
    return stores
  },
  getStoreInfo: async (_root: unknown, args: unknown, context: unknown) => {
    const user = await getUser(context)
    //Parse args
    const name = toName(args)
    const store = await dao.getStoreInfo(name, user?.id as string)
    return store
  },
  // We have to set args as any, instead of unknow so that TypeScript does not complain about checking the nullish value
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getItems: async (_root: unknown, args: any, context: unknown) => {
    const user = await getUser(context)
    //If no store is given, return all items
    // Enable unsafe argument to check nullish value. I do not see a better way
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (Object.keys(args).length === 0) {
      const items = await dao.getItems(undefined, user?.id as string)
      return items
    }
    //Parse args
    const params = toGetItemsParams(args)
    const items = await dao.getItems(params, user?.id as string)
    return items
  },
  getItemInfo: async (_root: unknown, args: unknown, context: unknown) => {
    const user = await getUser(context)
    const name = toName(args)
    const item = await dao.getItemInfo(name, user?.id as string)
    return item
  },
  //Same thing as above
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getEnchantments: async (_root: unknown, args: any, context: unknown) => {
    const user = await getUser(context)
    // If no game is given, return all user's enchantments
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (Object.keys(args).length === 0) {
      const enchantments = await dao.getEnchantments(undefined, user?.id as string)
      return enchantments
    }

    //Parse args
    const params = toGetEnchantmentsParams(args)
    const enchantments = await dao.getEnchantments(params, user?.id as string)
    return enchantments
  }
}