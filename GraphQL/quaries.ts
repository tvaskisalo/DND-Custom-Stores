import { parseDocument } from '../utils/parsers'
import { Game } from '../schemas/game'
export const Query = {
  getGames: async (_root: unknown, _args: unknown, context: unknown) => {
    if (!context) {
      throw new Error('Unauthorized request')
    }
    const user = parseDocument(context)
    const games = await Game.find({ user: user })
    return games
  }
}