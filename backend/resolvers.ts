import bcrypt from 'bcrypt'
import { toLoginRequest } from './utils'
import { User } from './schemas/user'
import { AuthenticationError, UserInputError } from 'apollo-server-express'
import jwt from 'jsonwebtoken'
import { SECRET } from './config'

export const resolvers = {
  Mutation: {
    addUser: async (root: unknown, args: unknown) => {
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
    login: async (root: unknown, args: unknown) => {
      const { username, password } = toLoginRequest(args)
      const user = await User.findOne({ username })
      if (!user) {
        throw new AuthenticationError('Incorrect username')
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
    }
  },
  Query: {
    getUser: () => 'todo'
  }
}