import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';

// Lazily initialize Firebase Admin SDK
function getFirebaseAdminApp(): App {
    if (getApps().length > 0) {
        return getApps()[0];
    }

    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        // This will only be thrown at runtime if the variable is missing
        throw new Error('GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.');
    }
    
    try {
        const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
        return initializeApp({
            credential: cert(serviceAccount)
        });
    } catch (e: any) {
        // This will catch the JSON.parse error during build, but allow runtime errors to surface
        if (process.env.NODE_ENV === 'production') {
            console.error('Failed to parse GOOGLE_APPLICATION_CREDENTIALS:', e.message);
            throw new Error('Server configuration error with Firebase credentials.');
        }
        // During build, we can create a dummy app to satisfy the type system
        // but it won't be used.
        return initializeApp();
    }
}


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
