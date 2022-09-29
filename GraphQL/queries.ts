import { Game } from '../schemas/game'
import { toName, getUser, toGetItemsParams, toGetStoresParams } from '../utils/parsers'
import { Item } from '../schemas/item'
import { Store } from '../schemas/store'
import { UserInputError } from 'apollo-server-express'

export const Query = {
  getGames: async (_root: unknown, _args: unknown, context: unknown) => {
    const user = await getUser(context)
    const games = await Game.find({ user: user })
    return games
  },
  getGameInfo: async (_root: unknown, args: unknown, context: unknown) => {
    const user = await getUser(context)
    // Parse args
    const name = toName(args)
    const game = await Game.findOne({
      user: user?.id as string,
      name
    })
    return game
  },
  getStores: async (_root: unknown, args: unknown, context: unknown) => {
    const user = await getUser(context)
    //If no game is specified, return all user's stores
    if (!args) {
      const stores = await Store.find({ user })
      return stores
    }
    // Parse args
    const params = toGetStoresParams(args)
    // Check if the user has the game
    const game = await Game.find({
      user: user?.id as string,
      name: params.game
    })
    if (!game) {
      throw new UserInputError('Game not found')
    }
    // Find all user's stores that have the given game in their games
    const stores = await Store.find({
      user: user?.id as string,
      $in: [ game, '$games' ]
    })
    return stores
  },
  getStoreInfo: async (_root: unknown, args: unknown, context: unknown) => {
    const user = await getUser(context)
    //Parse args
    const name = toName(args)
    const store = await Store.findOne({
      user: user?.id as string,
      name
    })
    return store

  },
  getItems: async (_root: unknown, args: unknown, context: unknown) => {
    const user = await getUser(context)
    //If no store is given, return all items
    if (!args) {
      const items = await Item.find({ user })
      return items
    }
    //Parse args
    const params = toGetItemsParams(args)
    //Check if the store exists
    const store = await Store.find({
      user: user?.id as string,
      name: params.name
    })
    if (!store) {
      throw new UserInputError('Store not found')
    }
    // Gets all user's items that have the given store in store pool and all baseItems
    const items = await Item.find({
      user: user?.id as string,
      $or: [
        { baseItem: { $eq: true } },
        { $in: [ store, '$storepool' ] }
      ] }
    )
    return items
  },
  getItemInfo: async (_root: unknown, args: unknown, context: unknown) => {
    const user = await getUser(context)
    const name = toName(args)
    const item = await Item.findOne({
      user: user?.id as string,
      name
    })
    return item
  },
}