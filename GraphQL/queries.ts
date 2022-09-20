import { Game } from '../schemas/game'
import {  getUser } from '../utils/parsers'
import { Item } from '../schemas/item'
import { Store } from '../schemas/store'

export const Query = {
  getGames: async (_root: unknown, _args: unknown, context: unknown) => {
    const user = await getUser(context)
    const games = await Game.find({ user: user })
    return games
  },
  getStores: async (_root: unknown, _args: unknown, context: unknown) => {
    const user = await getUser(context)
    const stores = await Store.find({ user: user })
    return stores
  },
  getItems: async (_root: unknown, _args: unknown, context: unknown) => {
    //This needs to be fixed, currently works incorrectly
    const user = await getUser(context)
    const items = await Item.find({ user: user })
    return items
  }
}