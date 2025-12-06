
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';

// Lazily initialize Firebase Admin SDK
function getFirebaseAdminApp(): App {
    if (getApps().length > 0) {
        return getApps()[0];
    }

    const serviceAccountString = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (!serviceAccountString) {
        console.error('Firebase credentials environment variable is not set.');
        // This will be caught by the calling function and result in a 500 error
        throw new Error('Server configuration error: Firebase credentials missing.');
    }
    
    try {
        const serviceAccount = JSON.parse(serviceAccountString);
        return initializeApp({
            credential: cert(serviceAccount)
        });
    } catch (e: any) {
        console.error('Failed to parse Firebase credentials:', e.message);
        throw new Error('Server configuration error with Firebase credentials.');
    }
}


export async function POST(req: NextRequest) {
    const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    const serviceAccountString = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    // Runtime check for environment variables
    if (!webhookSecret || !serviceAccountString) {
        console.error('Missing required environment variables for Lemon Squeezy webhook.');
        return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    try {
        const rawBody = await req.text();
        const signature = req.headers.get('x-signature') as string;

        if (!signature) {
            console.error('Webhook request missing x-signature header');
            return NextResponse.json({ error: 'Signature missing.' }, { status: 401 });
        }

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
            const app = getFirebaseAdminApp();
            const db = getFirestore(app);
            
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
