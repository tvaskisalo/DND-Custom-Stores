import { GraphQLError } from 'graphql'

export const errorHandling = (err: GraphQLError): Error => {
  console.log(err)
  if (err.message.startsWith('User validation failed')) {
    return new Error('Username already in use')
  }
  return err
}