import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  // This is the application user, not the user in game
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // If item is a baseItem, then it is always in all stores, so then storePool is not set.
  // The storePool is only used to manage where unique items can drop.
  storePool: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store'
  }],
  material: {
    type: String
  },
  baseCost: {
    type: Number
  },
  weight: {
    type: Number
  },
  properties: {
    type: String
  },
  // Damage is based on how many and what dice are rolled, not a number
  damage: {
    type: String
  },
  damageType: [{
    type: String
  }],
  baseItem: {
    type: Boolean
  },
  unique: {
    type: Boolean
  }
})

itemSchema.plugin(uniqueValidator)

itemSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export const Item = mongoose.model('Item', itemSchema)