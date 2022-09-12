import dotenv from 'dotenv'

dotenv.config()

export const MONGODB = process.env.NODE_ENV === 'test'
  ? process.env.MONGODB_URI_TEST as string
  : process.env.MONGODB_URI as string

export const PORT = process.env.PORT as number | undefined

export const SECRET = process.env.JWT_SECRET as string