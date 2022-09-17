import { gql } from '@apollo/client'

export const LOGIN = gql`
  mutation login ($username: String!, $password: String!) {
    login(
      username: $username,
      password: $password
    ) {
      value
    }
  }
  `

export const ADDUSER = gql`
  mutation addUser ($username: String!, $password: String!) {
    addUser(
      username: $username,
      password: $password
    ) {
      value
    }
  }
`

export const ADDGAME = gql`
  mutation addGame ($name: String!){
    addGame(
      name: $name
    ){
      name,
      id
    }
  }
`

export const ADDSTORE = gql`
  mutation addStore ($name: String!){
    addStore(
      name: $name
    ){
      name,
      id
    }
  }
`

export const ADDITEM = gql`
  mutation addItem ($name: String!){
    addItem(
      name: $name
    ){
      name,
      id
    }
  }
`