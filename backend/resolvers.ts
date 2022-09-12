import bcrypt from 'bcrypt'
import { toLoginRequest } from './utils'
import { User } from './schemas/user'

export const resolvers = {
  Mutation: {
    login: async (root: unknown, args: unknown) => {
      const userData = toLoginRequest(args)
      const passwordHash = await bcrypt.hash(userData.password, 10)
      const user = new User({
        username: userData.username,
        passwordHash
      })
      await user.save()
      console.log(passwordHash)
      return 'todo'
    }
  },
  Query: {
    getUser: () => 'todo'
  }
}