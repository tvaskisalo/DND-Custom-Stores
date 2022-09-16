import { User } from '../schemas/user'
import { SECRET } from '../utils/config'
import jwt from 'jsonwebtoken'
import { toToken } from '../utils/parsers'
import { ExpressContext } from 'apollo-server-express'


export const context = async (request: ExpressContext) => {
  //Adding authorization automatically to all requests
  const auth = request ? request.req.headers.authorization : null
  //Checking if authorization header exists and is valid
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    const decodedToken = jwt.verify(
      auth.substring(7), SECRET
    )
    const token = toToken(decodedToken)
    const currentUser = await User.findById(token.id)
    //If authorization was correct, current user can be found in context
    return { currentUser }
  }
}