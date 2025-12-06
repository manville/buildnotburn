
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
require('dotenv').config();

// Initialize Firebase Admin SDK
if (getApps().length === 0) {
    initializeApp({
        credential: cert(JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS!))
    });
}

const db = getFirestore();

export async function POST(req: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    console.error('STRIPE_SECRET_KEY is not set.');
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }
  const stripe = new Stripe(stripeSecretKey);

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set.');
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  const buf = await req.text();
  const sig = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const { firebase_uid, plan } = session.metadata!;
    const customerEmail = session.customer_details?.email;
    const stripeCustomerId = session.customer as string;

    if (!firebase_uid || !plan || !customerEmail) {
        console.error('Webhook received with missing metadata:', session.metadata);
        return NextResponse.json({ error: 'Missing metadata in session.'}, { status: 400 });
    }

    try {
      // Update user document in Firestore with the plan and Stripe customer ID
      const userRef = db.collection('users').doc(firebase_uid);
      await userRef.update({
        plan: plan,
        stripeCustomerId: stripeCustomerId,
      });

      console.log(`Successfully updated user ${firebase_uid} to plan ${plan}`);
    } catch (error) {
      console.error('Error updating user in Firestore:', error);
      return NextResponse.json({ error: 'Failed to update user plan.' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
