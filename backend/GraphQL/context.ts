import { SECRET } from '../utils/config'
import jwt from 'jsonwebtoken'
import { toToken } from '../utils/parsers'
import { ExpressContext } from 'apollo-server-express'


export const context = (request: ExpressContext) => {
  //Adding authorization automatically to all requests
  const auth = request ? request.req.headers.authorization : null
  //Checking if authorization header exists and is valid
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    try {
      const decodedToken = jwt.verify(
        auth.split(' ')[1], SECRET
      )
      const token = toToken(decodedToken)
      //If authorization was correct, current user can be found in context
      return { username: token.username, id: token.id }
    } catch (e) {
      console.log(e)
      return undefined
    }
  }
}
