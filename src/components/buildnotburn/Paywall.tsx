
'use client';

import { useState, type FC, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Check, BookCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { User } from 'firebase/auth';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';
import { createLemonSqueezyCheckout } from '@/ai/flows/lemonsqueezy-checkout-flow';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '../ui/label';

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
  user: User | null;
  variantIds: VariantIds;
}

const communityImage = PlaceHolderImages.find(p => p.id === 'paywall-community');
const builderImage = PlaceHolderImages.find(p => p.id === 'paywall-builder');
const architectImage = PlaceHolderImages.find(p => p.id === 'paywall-architect');

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.651-3.356-11.303-8H6.306C9.663,35.663,16.318,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.022,35.622,44,30.038,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);


export const Paywall: FC<PaywallProps> = ({ user, variantIds }) => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('annually');
  const [isLoading, setIsLoading] = useState<boolean | string>(false);
  const { toast } = useToast();

  const [showSignupModal, setShowSignupModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{plan: Plan, cycle: BillingCycle | 'free'} | null>(null);

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');

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

  const handlePlanSelect = (plan: Plan) => {
    const cycle = plan === 'trial' ? 'free' : billingCycle;
    if (user) {
      processCheckout(plan, cycle, user.uid, user.email!, user.displayName || '');
    } else {
      setSelectedPlan({ plan, cycle });
      setShowSignupModal(true);
    }
  };

  const handleSignupAndCheckout = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedPlan || !signupEmail || !signupName) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter your name and email to continue.",
      });
      return;
    }
    
    const tempUserId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    processCheckout(selectedPlan.plan, selectedPlan.cycle, tempUserId, signupEmail, signupName);
  }

  const processCheckout = async (plan: Plan, cycle: BillingCycle | 'free', userId: string, email: string, name: string) => {
    setIsLoading(`${plan}-${cycle}`);
    
    try {
        const planDetails = (plans as any)[plan][cycle];
      
      if (!planDetails.variantId || planDetails.variantId.startsWith('REPLACE')) {
        toast({
          variant: "destructive",
          title: "Configuration Error",
          description: "The product variant IDs are not configured. Please add them to your .env file.",
        });
        setIsLoading(false);
        return;
      }
      
      const checkoutResponse = await createLemonSqueezyCheckout({
        variantId: planDetails.variantId,
        email: email,
        name: plan === 'trial' ? 'Newsletter Subscriber' : name,
        userId: userId, // This can be a temp ID or a real one
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Free Newsletter */}
          <Card className="border-border/60 overflow-hidden">
            {communityImage && (
                <div className="bg-card/50">
                  <Image 
                      src={communityImage.imageUrl} 
                      alt={communityImage.description}
                      width={600}
                      height={400}
                      data-ai-hint={communityImage.imageHint}
                      className="object-cover aspect-[3/2]"
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
               <Button variant="outline" className="w-full" onClick={() => handlePlanSelect('trial')} disabled={!!isLoading}>
                    {isLoading === 'trial-free' ? 'Processing...' : 'Join for Free'}
                </Button>
            </CardFooter>
          </Card>

          {/* Builder Plan */}
          <Card className="border-primary border-2 relative shadow-2xl shadow-primary/10 overflow-hidden">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold uppercase px-3 py-1 rounded-full">
              Recommended
            </div>
            {builderImage && (
                <div className="bg-card/50">
                  <Image 
                      src={builderImage.imageUrl} 
                      alt={builderImage.description}
                      width={600}
                      height={400}
                      data-ai-hint={builderImage.imageHint}
                      className="object-cover aspect-[3/2]"
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
              <Button className="w-full font-bold" onClick={() => handlePlanSelect('builder')} disabled={!!isLoading}>
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
                      data-ai-hint={architectImage.imageHint}
                      className="object-cover aspect-[3/2]"
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
              <Button variant="secondary" className="w-full" onClick={() => handlePlanSelect('architect')} disabled={!!isLoading}>
                  {isLoading === `architect-${billingCycle}` ? 'Processing...' : 'Become an Architect'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Dialog open={showSignupModal} onOpenChange={setShowSignupModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl uppercase">One Final Step</DialogTitle>
            <DialogDescription>
              Enter your name and email to proceed. Your account will be created after.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSignupAndCheckout}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full font-bold" disabled={!!isLoading}>
                {isLoading ? 'Processing...' : 'Proceed'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
