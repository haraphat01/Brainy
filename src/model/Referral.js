import mongoose from 'mongoose';

const ReferralSchema = new mongoose.Schema({
  referrerId: { type: String, required: true },  // The ID of the referrer
  referredId: { type: String, required: true, unique: true }, // The ID of the referred person, must be unique
  pointsAwarded: { type: Boolean, default: false }, // To track if points have already been awarded
  referralDate: { type: Date, default: Date.now }
});

export default mongoose.models.Referral || mongoose.model('Referral', ReferralSchema);
