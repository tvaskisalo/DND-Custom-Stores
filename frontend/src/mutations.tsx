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
  mutation addStore ($name: String!, $itemTypeProbabilities: [ItemTypeProbabilityInput]){
    addStore(
      name: $name,
      itemTypeProbabilities: $itemTypeProbabilities
    ){
      name,
      id,
      itemTypeProbabilities
    }
  }
`

export const ADDITEM = gql`mutation addItem(
  $name: String!, 
  $storePool: [String], 
  $material: String, 
  $baseCost: Int, 
  $weight: Int, 
  $properties: String, 
  $damage: String, 
  $damageTypes: [String], 
  $baseItem: Boolean!, 
  $unique: Boolean!) { 
    addItem (
      name: $name, 
      storePool: $storePool, 
      material: $material, 
      baseCost: $baseCost, 
      weight: $weight, 
      properties: $properties, 
      damage: $damage, 
      damageTypes: $damageTypes, 
      baseItem: $baseItem, 
      unique: $unique
    ) {
      name,
      storePool,
      material,
      baseCost,
      weight,
      properties,
      damage,
      damageTypes,
      baseItem,
      unique
    }
  }`