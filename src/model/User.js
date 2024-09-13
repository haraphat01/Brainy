import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  telegramId: { type: String, unique: true },
  points: { type: Number, default: 0 },
  completedTasks: [String],
  referralPoints: Number,
  level2Points: Number,
  referredBy: String,
  firstName: { type: String },  // New field for first name
  lastName: { type: String },   // New field for last name
  username: { type: String }    // New field for username
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
