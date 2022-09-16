// Disabling no explicit any due to this being type check and avoding code with unknown type
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Document } from 'mongoose'
import { LoginRequest, Token } from './types'

const isString = (str: unknown): str is string => {
  return typeof str === 'string' || str instanceof String
}

const parseString = (str: unknown): string => {
  if (!str || !isString(str)) {
    throw new Error('Invalid or missing string' + str)
  }
  return str
}

const isDocument = (doc: unknown): doc is Document => {
  return doc instanceof Document
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

export const getCurrentUser = (reqData: any): Document| undefined => {
  if (reqData) {
    return parseDocument(reqData)
  } else {
    return undefined
  }
}

export const parseDocument = (doc: unknown): Document => {
  if (!doc || !isDocument(doc)) {
    throw new Error('Invalid or missing document object' + doc)
  }
  return doc
}