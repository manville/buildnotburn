import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin SDK
if (getApps().length === 0 && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    initializeApp({
        credential: cert(JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS))
    });
}

const db = getFirestore();

export async function POST(req: NextRequest) {
    const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    if (!webhookSecret) {
        console.error('LEMONSQUEEZY_WEBHOOK_SECRET is not set.');
        return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    try {
        const rawBody = await req.text();
        const signature = req.headers.get('x-signature') as string;

        const hmac = crypto.createHmac('sha256', webhookSecret);
        const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'hex');
        const signatureBuffer = Buffer.from(signature, 'hex');

        if (!crypto.timingSafeEqual(digest, signatureBuffer)) {
            console.error('Invalid webhook signature');
            return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 });
        }

        const payload = JSON.parse(rawBody);
        const { meta, data } = payload;

        // We passed the userId in the custom_data during checkout
        const userId = meta.custom_data?.user_id;

        if (!userId) {
             console.error('Webhook received without a user_id in custom_data');
             return NextResponse.json({ error: 'Webhook payload missing user_id.' }, { status: 400 });
        }
        
        const eventName = meta.event_name;
        console.log(`Received Lemon Squeezy event: ${eventName} for user: ${userId}`);

        // Handle 'subscription_created' or 'subscription_updated' events
        if (eventName === 'subscription_created' || eventName === 'subscription_updated') {
            const customerId = data.attributes.customer_id;
            const planVariantId = data.attributes.variant_id;
            const status = data.attributes.status; // e.g., 'active', 'past_due', 'cancelled'
            const renewsAt = data.attributes.renews_at;
            
            const userRef = db.collection('users').doc(userId);

            // This is a simplified mapping. You'll want to make this more robust,
            // perhaps by checking the planVariantId against your known variant IDs.
            const plan = meta.custom_data?.plan || 'builder';

            // Update the user document in Firestore
            await userRef.update({
                lemonSqueezyCustomerId: customerId,
                subscriptionStatus: status,
                renewsAt: renewsAt,
                plan: plan,
            });

            console.log(`Successfully updated user ${userId} to plan ${plan} with status ${status}`);
        }
        
        return NextResponse.json({ received: true });

    } catch (err: any) {
        console.error(`Webhook processing error: ${err.message}`);
        return NextResponse.json({ error: 'Webhook processing failed.' }, { status: 400 });
    }
}
