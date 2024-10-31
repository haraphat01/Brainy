import mongoose from 'mongoose';

const ReferralSchema = new mongoose.Schema({
  referrerId: {
    type: String,
    required: [true, 'Referrer ID is required'],
    index: true
  },
  referredId: {
    type: String,
    required: [true, 'Referred ID is required'],
    unique: true,
    index: true
  },
  pointsAwarded: {
    type: Boolean,
    default: false
  },
  referralDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure indexes are created
ReferralSchema.index({ referrerId: 1, referredId: 1 }, { unique: true });

const Referral = mongoose.models.Referral || mongoose.model('Referral', ReferralSchema);

export default Referral;