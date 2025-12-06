
'use client';

import { useState, type FC } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { User } from 'firebase/auth';

type Plan = 'trial' | 'builder' | 'architect';

interface PaywallProps {
  onPlanSelect: (plan: Plan) => void;
  onLogin: () => void;
  user: User | null;
}

const plans = {
  builder: {
    monthly: { price: 5, priceId: 'price_monthly_builder' },
    annually: { price: 50, priceId: 'price_annual_builder' },
  },
  architect: {
    monthly: { price: 10, priceId: 'price_monthly_architect' },
    annually: { price: 100, priceId: 'price_annual_architect' },
  },
};

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.012,35.846,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);


export const Paywall: FC<PaywallProps> = ({ onPlanSelect, onLogin, user }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('annually');

  const handleBillingToggle = () => {
    setBillingCycle(prev => (prev === 'monthly' ? 'annually' : 'monthly'));
  };

  return (
    <div className="max-w-6xl mx-auto my-8">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl sm:text-5xl uppercase tracking-wider">Choose Your System</h1>
        <p className="font-code text-muted-foreground mt-2 max-w-2xl mx-auto">
          Commit to a sustainable process. Start for free or become a supporter to unlock your full potential.
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
          Annually <span className="text-xs text-green-500 font-bold">(Save 17%)</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Free Plan */}
        <Card className="border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="font-headline text-2xl uppercase">Trial</CardTitle>
            <CardDescription className="font-code text-sm">A taste of the system.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground">/ forever</span>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground h-[150px]">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>3 total bricks, lifetime</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>The Wall timeline view</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => onPlanSelect('trial')}>
              Start Trial
            </Button>
          </CardFooter>
        </Card>

        {/* Builder Plan */}
        <Card className="border-primary border-2 relative shadow-2xl shadow-primary/10">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold uppercase px-3 py-1 rounded-full">
            Recommended
          </div>
          <CardHeader className="pb-4">
            <CardTitle className="font-headline text-2xl uppercase">Builder</CardTitle>
            <CardDescription className="font-code text-sm">The sustainable daily practice.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">${billingCycle === 'monthly' ? plans.builder.monthly.price : Math.round(plans.builder.annually.price / 12)}</span>
              <span className="text-muted-foreground">/ month</span>
            </div>
            <ul className="space-y-2 text-sm text-foreground h-[150px]">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="font-medium">Daily brick limit via Energy Audit</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Full access to The Wall</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Directly support development</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full font-bold" onClick={() => onPlanSelect('builder')}>
              Become a Builder
            </Button>
          </CardFooter>
        </Card>

        {/* Architect Plan */}
        <Card className="border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="font-headline text-2xl uppercase">Architect</CardTitle>
            <CardDescription className="font-code text-sm">For the prolific creator.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline gap-2">
               <span className="text-4xl font-bold">${billingCycle === 'monthly' ? plans.architect.monthly.price : Math.round(plans.architect.annually.price / 12)}</span>
              <span className="text-muted-foreground">/ month</span>
            </div>
            <ul className="space-y-2 text-sm text-foreground h-[150px]">
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
                <span className='font-bold text-primary'>Cloud data sync</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Priority support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
             {user ? (
                <Button variant="secondary" className="w-full" onClick={() => onPlanSelect('architect')}>
                    Become an Architect
                </Button>
             ) : (
                <Button variant="secondary" className="w-full" onClick={onLogin}>
                    <GoogleIcon className="mr-2"/>
                    Sign in to Continue
                </Button>
             )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
