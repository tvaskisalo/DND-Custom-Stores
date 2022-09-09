import { gql, useMutation } from '@apollo/client'

const LOGIN =gql`
mutation LOGIN ($username: String!, $password: String!) {
  login(
    username: $username,
    password: $password
  ) {
    value
  }
}
`
const [ login ] = useMutation(LOGIN)


export const loginService = (username: string, password: string) => {
  return (
    'a'
  )
}