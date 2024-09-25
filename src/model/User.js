import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  telegramId: { type: String, unique: true, required: true },
  points: { type: Number, default: 0 },
  referralPoints: { type: Number, default: 0 }, // Points from referrals
  completedTasks: [String],
  referrals: [{ type: String }],  // Store telegramIds of referred users
  referredBy: { type: String, default: null }, // The telegramId of the referrer
  firstName: { type: String },
  lastName: { type: String },
  username: { type: String }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
