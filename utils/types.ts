export type LoginRequest = {
  password: string,
  username: string
}
export type Token = {
  username: string,
  id: string
}
export type NewGameRequest = {
  name: string
}
export type NewStoreRequest = {
  name: string
}
export type NewItemRequest = {
  name: string
}