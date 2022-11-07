export const addStoreMutation = `mutation addStore(
  $name: String!,
  $itemTypeProbabilities: [ItemTypeProbabilityInput],
  $games: [String]) {
    addStore(
      name: $name,
      itemTypeProbabilities: $itemTypeProbabilities,
      games: $games
    ) {
      name,
      itemTypeProbabilities {
        rarity,
        probability
      },
      games
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
  $itemTypeProbabilities: [ItemTypeProbabilityInput],
  $games: [String]){
    updateStore(
      id: $id,
      name: $name,
      itemTypeProbabilities: $itemTypeProbabilities,
      games: $games
    ) {
      name,
      itemTypeProbabilities {
        rarity,
        probability
      },
      games
    }
  }`

export const getStoresQuery = `query getStores(
  $game: String){
    getStores(
      game: $game
    ) {
      name,
      itemTypeProbabilities {
        rarity,
        probability
      },
      games
    }
  }`

export const getStoreInfoQuery = `query getStoreInfo(
  $name: String!){
    getStoreInfo(
      name: $name
    ) {
      name,
      itemTypeProbabilities {
        rarity,
        probability
      },
      games
    }
  }`


export const addItemMutation = `mutation addItem(
  $name: String!, 
  $games: [String],
  $storepool: [String], 
  $material: String, 
  $baseCost: Int, 
  $weight: Int, 
  $properties: String, 
  $damage: String, 
  $damageTypes: [String], 
  $baseItem: Boolean, 
  $unique: Boolean,
  $weapon: Boolean,
  $weaponType: String,
  $armor: Boolean,
  $armorType: String,
  $armorClass: String
  $strength: String,
  $stealth: String) { 
    addItem (
      name: $name, 
      games: $games,
      storepool: $storepool, 
      material: $material, 
      baseCost: $baseCost, 
      weight: $weight, 
      properties: $properties, 
      damage: $damage, 
      damageTypes: $damageTypes, 
      baseItem: $baseItem, 
      unique: $unique,
      weapon: $weapon,
      weaponType: $weaponType,
      armor: $armor,
      armorType: $armorType,
      armorClass: $armorClass,
      strength: $strength,
      stealth: $stealth,
    ) {
      name,
      games
      storepool,
      material,
      baseCost,
      weight,
      properties,
      damage,
      damageTypes,
      baseItem,
      unique,
      weapon,
      weaponType,
      armor,
      armorType,
      armorClass,
      strength,
      stealth
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
  $games: [String],
  $storepool: [String], 
  $material: String, 
  $baseCost: Int, 
  $weight: Int, 
  $properties: String, 
  $damage: String, 
  $damageTypes: [String], 
  $baseItem: Boolean, 
  $unique: Boolean,
  $weapon: Boolean,
  $weaponType: String,
  $armor: Boolean,
  $armorType: String,
  $armorClass: String
  $strength: String,
  $stealth: String) { 
    updateItem (
      id: $id,
      name: $name, 
      games: $games,
      storepool: $storepool, 
      material: $material, 
      baseCost: $baseCost, 
      weight: $weight, 
      properties: $properties, 
      damage: $damage, 
      damageTypes: $damageTypes, 
      baseItem: $baseItem, 
      unique: $unique,
      weapon: $weapon,
      weaponType: $weaponType,
      armor: $armor,
      armorType: $armorType,
      armorClass: $armorClass,
      strength: $strength,
      stealth: $stealth
      ) {
        name,
        games
        storepool,
        material,
        baseCost,
        weight,
        properties,
        damage,
        damageTypes,
        baseItem,
        unique,
        weapon,
        weaponType,
        armor,
        armorType,
        armorClass,
        strength,
        stealth
    }
  }`

export const getItemsQuery = `query getItems(
  $store: String){
    getItems(
      store: $store
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

export const getItemInfoQuery = `query getItemInfo(
  $name: String!){
    getItemInfo(
      name: $name
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

export const addGameMutation = `mutation addGame(
  $name: String!,
  $enchantments: [String],
  $rarities: [RarityDefinitionInput]) {
    addGame (
      name: $name,
      enchantments: $enchantments
      rarities: $rarities
    ) {
      name,
      enchantments
      rarities {
        rarity,
        enchantmentTiers
      }
    }
  }`

export const removeGameMutation = `mutation removeGame(
  $name: String!) {
    removeGame (
      name: $name
    ) {
      name
    }
  }`

export const updateGameMutation = `mutation updateGame(
  $id: String!
  $name: String,
  $enchantments: [String],
  $rarities: [RarityDefinitionInput]) {
    updateGame (
      id: $id,
      name: $name,
      enchantments: $enchantments
      rarities: $rarities
    ) {
      name
      enchantments
      rarities {
        rarity,
        enchantmentTiers
      }
    }
  }`


export const getGamesQuery = `query getGames{
    getGames{
      name
    }
  }`

export const getGameInfoQuery = `query getGameInfo(
  $name: String!){
    getGameInfo(
      name: $name
    ){
      name
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

