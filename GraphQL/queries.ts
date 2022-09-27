import { Game } from '../schemas/game'
import {  getUser, toGetItemsParams, toGetStoresParams } from '../utils/parsers'
import { Item } from '../schemas/item'
import { Store } from '../schemas/store'
import { UserInputError } from 'apollo-server-express'

export const Query = {
  getGames: async (_root: unknown, _args: unknown, context: unknown) => {
    const user = await getUser(context)
    const games = await Game.find({ user: user })
    return games
  },
  getStores: async (_root: unknown, args: unknown, context: unknown) => {
    const user = await getUser(context)
    if (!args) {
      const stores = await Store.find({ user: user })
      return stores
    }
    const params = toGetStoresParams(args)
    const game = await Game.find({ $and: [
      { user: user },
      { name: params.game }
    ] })
    if (!game) {
      throw new UserInputError('Game not found')
    }
    const stores = await Store.find({ $and: [
      { user: user },
      { game: game }
    ] })
    return stores
  },
  getItems: async (_root: unknown, args: unknown, context: unknown) => {
    const user = await getUser(context)
    //If no store is given, return all items
    if (!args) {
      const items = await Item.find({ user: user })
      return items
    }
    const params = toGetItemsParams(args)
    const store = await Store.find({ $and: [
      { user: user },
      { name: params.name }
    ] })
    if (!store) {
      throw new UserInputError('Store not found')
    }
    // Gets all user's items that have the given store in store pool and all baseItems
    const items = await Item.find({ $and: [
      { user: user },
      { $or: [
        { baseItem: true },
        { storePool: store }
      ] }
    ] })
    return items
  }
}