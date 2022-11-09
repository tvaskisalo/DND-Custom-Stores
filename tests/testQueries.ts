export const addStoreMutation = `mutation addStore(
  $name: String!,
  $itemTypeProbabilities: [ItemTypeProbabilityInput],
  $games: [String]) {
    addStore(
      name: $name,
      itemTypeProbabilities: $itemTypeProbabilities,
      games: $games
    ) {
      id,
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
      id,
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
      id,
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
      id,
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
      id,
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
      id,
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
      id,
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
        id,
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
      id,
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
      id,
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
      id,
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
      id,
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
      id,
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

export const addEnchantmentMutation = `mutation addEnchantment(
  $name: String!,
  $games: [String],
  $tier: Int,
  $damage: String
  $damageTypes: [String],
  $description: String
  ) {
    addEnchantment (
      name: $name,
      games: $games,
      tier: $tier,
      damage: $damage,
      damageTypes: $damageTypes,
      description: $description
    ) {
      id,
      name,
      games,
      tier,
      damage,
      damageTypes,
      description
    }
  }`

export const removeEnchantmentMutation = `mutation removeEnchantment(
  $id: String!
  ) {
    removeEnchantment (
      id: $id
    ) {
      id,
      name,
      games,
      tier,
      damage,
      damageTypes,
      description
    }
  }`

export const updateEnchantmentMutation = `mutation updateEnchantment(
  $id: String!
  $name: String,
  $games: [String],
  $tier: Int,
  $damage: String
  $damageTypes: [String],
  $description: String
  ) {
    updateEnchantment (
      id: $id,
      name: $name,
      games: $games,
      tier: $tier,
      damage: $damage,
      damageTypes: $damageTypes,
      description: $description
    ) {
      id,
      name,
      games,
      tier,
      damage,
      damageTypes,
      description
    }
  }`

export const getEnchantmentsQuery = `query getEnchantments(
  $game: String
  ) {
    getEnchantments (
      game: $game
    ) {
      id,
      name,
      games,
      tier,
      damage,
      damageTypes,
      description
    }
  }
`

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

