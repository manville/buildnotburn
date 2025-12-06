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
        const eventName = meta.event_name;
        
        console.log(`Received Lemon Squeezy event: ${eventName}`);

        // Handle the 'subscription_created' or 'subscription_updated' event
        if (eventName === 'subscription_created' || eventName === 'subscription_updated') {
            const customerId = data.attributes.customer_id;
            const userEmail = data.attributes.user_email;
            const planId = data.attributes.variant_id; // Or product_id, depending on your setup
            const status = data.attributes.status; // e.g., 'active'
            const endsAt = data.attributes.ends_at;
            const renewsAt = data.attributes.renews_at;

            // Find the user by email in your database
            const usersRef = db.collection('users');
            const userQuery = await usersRef.where('email', '==', userEmail).limit(1).get();
            
            if (userQuery.empty) {
                console.error(`Webhook error: User with email ${userEmail} not found.`);
                return NextResponse.json({ error: 'User not found.' }, { status: 404 });
            }
            
            const userDoc = userQuery.docs[0];
            const userId = userDoc.id;

            // Determine plan from variant ID (you might need to map this)
            // This is a placeholder, you'll need your own logic to map variantId to 'builder' or 'architect'
            const plan = 'builder'; // Replace with your logic

            // Update the user document in Firestore
            await db.collection('users').doc(userId).update({
                lemonSqueezyCustomerId: customerId,
                subscriptionStatus: status,
                renewsAt: renewsAt || endsAt,
                plan: plan
            });

            console.log(`Successfully updated user ${userId} to plan ${plan} with status ${status}`);
        }
        
        return NextResponse.json({ received: true });

    } catch (err: any) {
        console.error(`Webhook processing error: ${err.message}`);
        return NextResponse.json({ error: 'Webhook processing failed.' }, { status: 400 });
    }
}
