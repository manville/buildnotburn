
'use client';

import { useState, type FC } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Check, BookCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { createLemonSqueezyCheckout } from '@/ai/flows/lemonsqueezy-checkout-flow';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { SignInModal } from './SignInModal';

type Plan = 'trial' | 'builder' | 'architect';
type BillingCycle = 'monthly' | 'annually';

export interface VariantIds {
    newsletter: string;
    builderMonthly: string;
    builderAnnually: string;
    architectMonthly: string;
    architectAnnually: string;
}

interface PaywallProps {
  variantIds: VariantIds;
}

const communityImage = PlaceHolderImages.find(p => p.id === 'paywall-community');
const builderImage = PlaceHolderImages.find(p => p.id === 'paywall-builder');
const architectImage = PlaceHolderImages.find(p => p.id === 'paywall-architect');

export const Paywall: FC<PaywallProps> = ({ variantIds }) => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('annually');
  const [isLoading, setIsLoading] = useState<boolean | string>(false);
  const { toast } = useToast();
  
  const [selectedPlan, setSelectedPlan] = useState<{plan: Plan, cycle: BillingCycle | 'free'} | null>(null);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const plans = {
    trial: {
        free: { price: 0, variantId: variantIds.newsletter },
    },
    builder: {
      monthly: { price: 8, variantId: variantIds.builderMonthly },
      annually: { price: 80, variantId: variantIds.builderAnnually },
    },
    architect: {
      monthly: { price: 15, variantId: variantIds.architectMonthly },
      annually: { price: 150, variantId: variantIds.architectAnnually },
    },
  };


  const handleBillingToggle = () => {
    setBillingCycle(prev => (prev === 'monthly' ? 'annually' : 'monthly'));
  };

  const handlePlanSelect = (plan: Plan, cycle: BillingCycle | 'free') => {
      setSelectedPlan({ plan, cycle });
      setIsSignupModalOpen(true); 
  };


  const handleSignupAndCheckout = async (name: string, email: string) => {
    if (!selectedPlan) return;
    
    // We create a temporary ID to associate the checkout, and our webhook
    // will need to be smart enough to handle this by creating a new user.
    const tempUserId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    await processCheckout(selectedPlan.plan, selectedPlan.cycle, tempUserId, email, name);
  };

  const processCheckout = async (plan: Plan, cycle: BillingCycle | 'free', userId: string, email: string, name: string) => {
    setIsLoading(`${plan}-${cycle}`);
    
    try {
        const planDetails = (plans as any)[plan][cycle];
      
      if (!planDetails.variantId || planDetails.variantId.includes('REPLACE')) {
        toast({
          variant: "destructive",
          title: "Configuration Error",
          description: "The product variant IDs are not configured correctly in the application.",
        });
        setIsLoading(false);
        setIsSignupModalOpen(false);
        return;
      }
      
      const checkoutResponse = await createLemonSqueezyCheckout({
        variantId: planDetails.variantId,
        email: email,
        name: plan === 'trial' ? '' : name,
        userId: userId,
        plan: plan,
      });

      if (checkoutResponse.checkoutUrl) {
        window.location.href = checkoutResponse.checkoutUrl;
      } else {
        throw new Error('Could not create a checkout session.');
      }
    } catch (error: any) {
      console.error("Checkout failed:", error);
      toast({
        variant: "destructive",
        title: "Checkout Error",
        description: error.message || "There was a problem redirecting you to checkout. Please try again.",
      });
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="max-w-6xl mx-auto my-8">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl sm:text-5xl uppercase tracking-wider">Choose Your System</h1>
          <p className="font-code text-muted-foreground mt-2 max-w-2xl mx-auto">
            Start for free by subscribing to the newsletter, or purchase a plan to get the complete system.
          </p>
        </div>

        <div className="flex justify-center items-center gap-4 mb-10">
          <span className={cn('font-medium', billingCycle === 'monthly' && 'text-primary')}>Monthly</span>
          <Switch
            checked={billingCycle === 'annually'}
            onCheckedChange={handleBillingToggle}
            aria-label="Toggle between monthly and annual billing"
          />
          <span className={cn('font-medium', billingCycle === 'annually' && 'text-primary')}>
            Annually <span className="text-xs text-green-500 font-bold">(Save ~17%)</span>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start lg:pt-4">
          {/* Free Newsletter */}
          <Card className="border-border/60 overflow-hidden">
            {communityImage && (
                <div className="bg-card/50">
                  <Image 
                      src={communityImage.imageUrl} 
                      alt={communityImage.description}
                      width={600}
                      height={400}
                      className="object-cover aspect-[3/2]"
                      data-ai-hint={communityImage.aiHint}
                  />
                </div>
            )}
            <CardHeader className="pb-4">
              <CardTitle className="font-headline text-2xl uppercase">The Community</CardTitle>
              <CardDescription className="font-code text-sm">Insights on sustainable creativity.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/ forever</span>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground min-h-[140px]">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Weekly insights & tips</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Join the community</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Use the app with a 3-brick limit</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
               <Button variant="outline" className="w-full" onClick={() => handlePlanSelect('trial', 'free')} disabled={!!isLoading}>
                    {isLoading === 'trial-free' ? 'Processing...' : 'Join for Free'}
                </Button>
            </CardFooter>
          </Card>

          {/* Builder Plan */}
          <Card className="border-primary border-2 relative shadow-2xl shadow-primary/10 transform lg:-translate-y-4">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold uppercase px-3 py-1 rounded-full">
              Recommended
            </div>
            {builderImage && (
                <div className="bg-card/50 overflow-hidden rounded-t-lg">
                  <Image 
                      src={builderImage.imageUrl} 
                      alt={builderImage.description}
                      width={600}
                      height={400}
                      className="object-cover aspect-[3/2]"
                      data-ai-hint={builderImage.aiHint}
                  />
                </div>
            )}
            <CardHeader className="pb-4">
              <CardTitle className="font-headline text-2xl uppercase">Builder</CardTitle>
              <CardDescription className="font-code text-sm">The sustainable daily practice.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">${billingCycle === 'monthly' ? plans.builder.monthly.price : Math.round(plans.builder.annually.price / 12)}</span>
                <span className="text-muted-foreground">/ month</span>
              </div>
              <ul className="space-y-2 text-sm text-foreground min-h-[140px]">
                <li className="flex items-center gap-2">
                  <BookCheck className="h-4 w-4 text-primary" />
                  <span className="font-medium">The Field Guide (Digital)</span>
                </li>
                <li className="flex items-center gap-2">
                  <BookCheck className="h-4 w-4 text-primary" />
                  <span className="font-medium">The Daily Worksheet (Printable)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="font-medium">The BuildNotBurn Web App</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Daily brick limit via Energy Audit</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Review Dashboard Analytics</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full font-bold" onClick={() => handlePlanSelect('builder', billingCycle)} disabled={!!isLoading}>
                  {isLoading === `builder-${billingCycle}` ? 'Processing...' : 'Get the System'}
              </Button>
            </CardFooter>
          </Card>

          {/* Architect Plan */}
          <Card className="border-border/60 overflow-hidden">
            {architectImage && (
                <div className="bg-card/50">
                  <Image 
                      src={architectImage.imageUrl} 
                      alt={architectImage.description}
                      width={600}
                      height={400}
                      className="object-cover aspect-[3/2]"
                      data-ai-hint={architectImage.aiHint}
                  />
                </div>
            )}
            <CardHeader className="pb-4">
              <CardTitle className="font-headline text-2xl uppercase">Architect</CardTitle>
              <CardDescription className="font-code text-sm">For the prolific creator.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">${billingCycle === 'monthly' ? plans.architect.monthly.price : Math.round(plans.architect.annually.price / 12)}</span>
                <span className="text-muted-foreground">/ month</span>
              </div>
              <ul className="space-y-2 text-sm text-foreground min-h-[140px]">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="font-medium">Everything in Builder, plus:</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Unlimited daily bricks</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Advanced Analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Priority support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" className="w-full" onClick={() => handlePlanSelect('architect', billingCycle)} disabled={!!isLoading}>
                  {isLoading === `architect-${billingCycle}` ? 'Processing...' : 'Become an Architect'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <SignInModal 
        isOpen={isSignupModalOpen} 
        onClose={() => setIsSignupModalOpen(false)}
        onEmailSubmit={handleSignupAndCheckout}
        variant="signup"
      />
    </>
  );
};
