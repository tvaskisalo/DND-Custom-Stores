import mongoose from 'mongoose'

const enchantmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  games: [String],
  tier: Number,
  damage: String,
  damageTypes: [String],
  description: String
})

enchantmentSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export const Enchantment = mongoose.model('Enchantment', enchantmentSchema)