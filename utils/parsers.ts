// Disabling no explicit any due to this being type check and avoding code with unknown type
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthenticationError } from 'apollo-server-express'
import { User } from '../schemas/user'
import { LoginRequest, NewGameRequest, NewItemRequest, NewStoreRequest, Token } from './types'

const isString = (str: unknown): str is string => {
  return typeof str === 'string' || str instanceof String
}

const parseString = (str: unknown): string => {
  if (!str || !isString(str)) {
    throw new Error('Invalid or missing string' + str)
  }
  return str
}

export const toLoginRequest = (reqData: any): LoginRequest => {
  const loginRequest: LoginRequest = {
    password: parseString(reqData.password),
    username: parseString(reqData.username)
  }
  return loginRequest
}

export const toToken = (reqData: any): Token => {
  const token: Token = {
    username: parseString(reqData.username),
    id: parseString(reqData.id)
  }
  return token
}

export const toNewGameRequest = (reqData: any): NewGameRequest => {
  const newGameRequest: NewGameRequest = {
    name: parseString(reqData.name)
  }
  return newGameRequest
}

export const toNewItemRequest = (reqData: any): NewItemRequest => {
  const newItemRequest: NewItemRequest = {
    name: parseString(reqData.name)
  }
  return newItemRequest
}

export const toNewStoreRequest = (reqData: any): NewStoreRequest => {
  const newStoreRequest: NewStoreRequest = {
    name: parseString(reqData.name)
  }
  return newStoreRequest
}

export const getUser = async (context: unknown) => {
  const token = toToken(context)
  if (!token) {
    throw new AuthenticationError('Invalid token')
  }
  return await User.findOne({ id: token.id })
}