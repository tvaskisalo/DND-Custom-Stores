export const addStoreMutation = `mutation addStore(
  $name: String!,
  $itemTypeProbabilities: [ItemTypeProbabilityInput]) {
    addStore(
      name: $name,
      itemTypeProbabilities: $itemTypeProbabilities
    ) {
      name,
      itemTypeProbabilities {
        rarity,
        probability
      }
    }
  }`

export const removeStoreMutation = `mutation removeStore(
  $name: String!) {
    removeStore(
      name: $name
    ) {
      name
    }
  }`

export const updateStoreMutation = `mutation updateStore(
  $id: String!,
  $name: String,
  $itemTypeProbabilities: [ItemTypeProbabilityInput]){
    updateStore(
      id: $id,
      name: $name,
      itemTypeProbabilities: $itemTypeProbabilities
    ) {
      name,
      itemTypeProbabilities {
        rarity,
        probability
      }
    }
  }`


export const addItemMutation = `mutation addItem(
  $name: String!, 
  $storepool: [String], 
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
      storepool: $storepool, 
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
      storepool,
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

export const removeItemMutation = `mutation removeItem(
  $name: String!) {
    removeItem(
      name: $name
    ) {
      name
    }
  }`

export const updateItemMutation = `mutation updateItem(
  $id: String!,
  $name: String,
  $storepool: [String], 
  $material: String, 
  $baseCost: Int, 
  $weight: Int, 
  $properties: String, 
  $damage: String, 
  $damageTypes: [String], 
  $baseItem: Boolean, 
  $unique: Boolean) { 
    updateItem (
      id: $id,
      name: $name, 
      storepool: $storepool, 
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
      storepool,
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


export const addUserMutation = `mutation addUser(
  $username: String!,
  $password: String!) {
    addUser(
      username: $username,
      password: $password 
      ) {
         value 
      } 
    }`

export const login = `mutation login(
  $username: String!,
  $password: String!) {
    login (
      username: $username,
      password: $password
      ) { 
        value 
      } 
    }`