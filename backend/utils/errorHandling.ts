import { GraphQLError } from 'graphql'

export const errorHandling = (err: GraphQLError): Error => {
  if (err.message.startsWith('User validation failed')) {
    return new Error('Username already in use')
  }
  return err
}