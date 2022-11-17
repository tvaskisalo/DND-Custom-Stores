import mongoose from 'mongoose'

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
    // Game's name must be unique for each user. This is validated in the backend
  },
  user: {
    type: String,
    required: true,
  },
  rarities: [
    {
      rarity: String,
      enchantmentTiers: [Number],
      enchantmentCount: Number
    }
  ]
})

gameSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export const Game = mongoose.model('Game', gameSchema)