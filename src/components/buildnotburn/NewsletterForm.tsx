
'use client';

import { useState, type FormEvent } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createLemonSqueezyCheckout } from '@/ai/flows/lemonsqueezy-checkout-flow';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const NewsletterForm = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email) {
            toast({
                variant: 'destructive',
                title: 'Email is required',
            });
            return;
        }
        
        setIsLoading(true);

        const newsletterVariantId = process.env.NEXT_PUBLIC_LEMONSQUEEZY_NEWSLETTER_VARIANT_ID;

        if (!newsletterVariantId) {
            console.error('Newsletter variant ID is not set in environment variables.');
            toast({
                variant: 'destructive',
                title: 'Configuration Error',
                description: 'The newsletter is not configured correctly. Please try again later.',
            });
            setIsLoading(false);
            return;
        }

        try {
            const checkoutResponse = await createLemonSqueezyCheckout({
                variantId: newsletterVariantId,
                email: email,
                name: 'Newsletter Subscriber', // A generic name
                userId: `newsletter-${Date.now()}`, // A unique but anonymous ID
                plan: 'newsletter',
            });

            if (checkoutResponse.checkoutUrl) {
                // Since it's a free product, we can redirect.
                // Lemon Squeezy will show a "Get for free" page and then handle the email confirmation.
                window.location.href = checkoutResponse.checkoutUrl;
            } else {
                throw new Error('Could not create a checkout session.');
            }
        } catch (error: any) {
            console.error("Newsletter signup failed:", error);
            toast({
                variant: "destructive",
                title: "Signup Error",
                description: error.message || "There was a problem signing you up. Please try again.",
            });
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-4 rounded-lg bg-card/50 border border-border">
            <p className="font-headline text-lg uppercase text-center">Join The Creator's System</p>
            <p className="text-xs text-muted-foreground text-center mb-4">Get the guide, plus weekly insights on sustainable creativity.</p>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="bg-background/70 border-border"
                    disabled={isLoading}
                />
                <Button type="submit" variant="default" size="icon" disabled={isLoading}>
                    {isLoading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div> : <ArrowRight className="h-4 w-4" />}
                </Button>
            </form>
        </div>
    );
};

