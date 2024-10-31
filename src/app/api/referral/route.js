import { NextResponse } from 'next/server';
import { processReferral } from '../../../lib/referralSystem';

export async function POST(req) {
    try {
        const body = await req.json();
        const { referredId, referrerId } = body;

        // Validate input
        if (!referredId || !referrerId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        console.log('Processing referral:', { referredId, referrerId });
        
        const result = await processReferral(referredId, referrerId);
        
        console.log('Referral processed successfully:', result);

        return NextResponse.json({
            message: 'Referral processed successfully',
            ...result
        });
    } catch (error) {
        console.error('Referral error:', error);
        
        const status = error.message.includes('Invalid referral') ? 400 : 500;
        const message = status === 400 ? error.message : 'Internal server error';
        
        return NextResponse.json(
            { error: message },
            { status }
        );
    }
}