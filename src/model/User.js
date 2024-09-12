import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  telegramId: { type: String, unique: true },
  points: { type: Number, default: 0 },
  completedTasks: [String],
  referrals: [String]
})

export default mongoose.models.User || mongoose.model('User', UserSchema)