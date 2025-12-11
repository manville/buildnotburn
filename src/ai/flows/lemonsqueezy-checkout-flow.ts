
'use server';

/**
 * @fileOverview A flow for creating a Lemon Squeezy checkout URL.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const CreateCheckoutUrlInputSchema = z.object({
    variantId: z.string().describe('The ID of the Lemon Squeezy product variant.'),
    email: z.string().email().describe('The email of the user.'),
    name: z.string().describe('The name of the user.'),
    userId: z.string().describe('The Firebase Auth user ID.'),
    plan: z.string().describe('The selected plan (e.g., "builder", "architect").'),
});

const CreateCheckoutUrlOutputSchema = z.object({
    checkoutUrl: z.string().nullable(),
});

export async function createLemonSqueezyCheckout(
    input: z.infer<typeof CreateCheckoutUrlInputSchema>
): Promise<z.infer<typeof CreateCheckoutUrlOutputSchema>> {
    return createCheckoutUrlFlow(input);
}

const createCheckoutUrlFlow = ai.defineFlow(
    {
        name: 'createCheckoutUrlFlow',
        inputSchema: CreateCheckoutUrlInputSchema,
        outputSchema: CreateCheckoutUrlOutputSchema,
    },
    async (input) => {
        const apiKey = process.env.LEMONSQUEEZY_API_KEY;
        const storeId = process.env.LEMONSQUEEZY_STORE_ID;

        if (!apiKey || !storeId) {
            throw new Error('LEMONSQUEEZY_API_KEY and LEMONSQUEEZY_STORE_ID must be set in environment variables.');
        }

        const { variantId, email, name, userId, plan } = input;
        
        const isFreeTier = plan === 'trial';
        const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'}/checkout/success`;

        // Conditionally build attributes. For free products, LS doesn't want checkout_data with email/name.
        const attributes: { redirect_url: string; checkout_data?: any } = {
            redirect_url: redirectUrl,
        };
        
        const customData = {
            user_id: userId,
            plan: plan,
        };

        if (isFreeTier) {
            // For free products, only send custom data. Lemon Squeezy handles email collection.
             attributes.checkout_data = {
                custom: customData,
            };
        } else {
            // For paid products, pre-fill user info.
            attributes.checkout_data = {
                email: email,
                name: name,
                custom: customData,
            };
        }


        const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                data: {
                    type: 'checkouts',
                    attributes: attributes,
                    relationships: {
                        store: {
                            data: {
                                type: 'stores',
                                id: storeId,
                            },
                        },
                        variant: {
                            data: {
                                type: 'variants',
                                id: variantId,
                            },
                        },
                    },
                },
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Lemon Squeezy API Error:", error);
            const errorDetail = error.errors?.[0]?.detail || response.statusText;
            throw new Error(`Failed to create checkout: ${errorDetail}`);
        }

        const checkout = await response.json();
        const checkoutUrl = checkout.data.attributes.url;

        return {
            checkoutUrl: checkoutUrl,
        };
    }
);
