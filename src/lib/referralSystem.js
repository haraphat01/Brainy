import dbConnect from './dbConnect';
import Referral from '../model/Referral';

export async function processReferral(referredId, referrerId) {
    if (!referredId || !referrerId) {
        throw new Error('Invalid referral: Both referredId and referrerId are required');
    }

    // Prevent self-referral
    if (referredId === referrerId) {
        throw new Error('Invalid referral: Cannot refer yourself');
    }

    await dbConnect();

    try {
        // Check if this user has already been referred
        const existingReferral = await Referral.findOne({ referredId });
        if (existingReferral) {
            throw new Error('Invalid referral: User has already been referred');
        }

        // Create new referral
        const referral = new Referral({
            referrerId,
            referredId,
            pointsAwarded: false
        });

        await referral.save();

        return {
            success: true,
            referral
        };
    } catch (error) {
        console.error('Error in processReferral:', error);
        throw error;
    }
} 