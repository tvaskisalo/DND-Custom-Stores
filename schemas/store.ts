import mongoose from 'mongoose'
const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    // Store's name must be unique for each user. This is validated in the backend
  },
  user: {
    type: String
  },
  games: [{
    type: String
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

storeSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export const Store = mongoose.model('Store', storeSchema)