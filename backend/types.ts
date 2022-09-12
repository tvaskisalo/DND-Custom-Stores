export type LoginRequest = {
  password: string,
  username: string
}

export type NewUserSchema = {
  username: string,
  passwordHash: string
}