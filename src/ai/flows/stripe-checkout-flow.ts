
'use server';

/**
 * @fileOverview A flow for creating a Stripe checkout session.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import Stripe from 'stripe';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
require('dotenv').config();

const CreateCheckoutSessionInputSchema = z.object({
    priceId: z.string().describe('The ID of the Stripe price object.'),
    email: z.string().email().describe('The email of the user.'),
    userId: z.string().describe('The Firebase Auth user ID.'),
    plan: z.string().describe('The selected plan (e.g., "builder", "architect").'),
});

const CreateCheckoutSessionOutputSchema = z.object({
    sessionId: z.string(),
    url: z.string().nullable(),
});

export async function createCheckoutSession(
    input: z.infer<typeof CreateCheckoutSessionInputSchema>
): Promise<z.infer<typeof CreateCheckoutSessionOutputSchema>> {
    return createCheckoutSessionFlow(input);
}


if (getApps().length === 0) {
    initializeApp({
        credential: cert(JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS!))
    });
}

const db = getFirestore();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const createCheckoutSessionFlow = ai.defineFlow(
    {
        name: 'createCheckoutSessionFlow',
        inputSchema: CreateCheckoutSessionInputSchema,
        outputSchema: CreateCheckoutSessionOutputSchema,
    },
    async (input) => {
        const { priceId, email, userId, plan } = input;
        
        const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
        const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/`;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price: priceId,
                quantity: 1,
            }],
            mode: 'subscription',
            success_url: successUrl,
            cancel_url: cancelUrl,
            customer_email: email,
            metadata: {
                firebase_uid: userId,
                plan: plan,
            }
        });
        
        // Store session details in Firestore to link Stripe session to user later
        await db.collection('checkouts').doc(session.id).set({
            email: email,
            userId: userId,
            plan: plan,
            priceId: priceId
        });

        return {
            sessionId: session.id,
            url: session.url,
        };
    }
);
