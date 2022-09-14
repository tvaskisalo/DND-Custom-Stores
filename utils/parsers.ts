import { LoginRequest } from './types'

const isString = (str: unknown): str is string => {
  return typeof str === 'string' || str instanceof String
}

const parseString = (str: unknown): string => {
  if (!str || !isString(str)) {
    throw new Error('Invalid or missing string' + str)
  }
  return str
}


// Disabling no explicit any due to this being type check and avodint code with unknown type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toLoginRequest = (reqData: any): LoginRequest => {
  const loginRequest: LoginRequest = {
    password: parseString(reqData.password),
    username: parseString(reqData.username)
  }
  return loginRequest
}