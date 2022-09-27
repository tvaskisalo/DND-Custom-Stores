import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  games: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  }],
  itemTypeProbabilities: [
    {
      rarity: {
        type: String
      },
      probability: {
        type: Number
      }
    }
  ]
})

storeSchema.plugin(uniqueValidator)

storeSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export const Store = mongoose.model('Store', storeSchema)