import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    // Item's name must be unique for each user. This is validated in the backend

  },
  // This is the application user, not the user in game
  user: {
    type: String,
    required: true,
  },
  // Which games the items belong to
  games: [String],
  // If item is a baseItem, then it is always in all stores, so then storePool is not set.
  // The storePool is only used to manage where unique items can drop.
  storepool: [String],
  material: String,
  baseCost: Number,
  weight: Number,
  properties: String,
  // Damage is based on how many and what dice are rolled, not a number
  damage: String,
  damageTypes: [String],
  // If item is a baseItem it can have different rarities, uniques cannot
  // Only baseItems are used for item generation
  baseItem: Boolean,
  unique: Boolean,
  weapon: Boolean,
  weaponType: String,
  armor: Boolean,
  armorType: String,
  armorClass: String,
  strength: String,
  stealth: String
})

itemSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export const Item = mongoose.model('Item', itemSchema)