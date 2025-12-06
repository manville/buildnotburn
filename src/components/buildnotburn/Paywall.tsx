
'use client';

import { useState, type FC } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type Plan = 'trial' | 'builder' | 'architect';

interface PaywallProps {
  onPlanSelect: (plan: Plan) => void;
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

export const Paywall: FC<PaywallProps> = ({ onPlanSelect }) => {
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
                <span>Cloud data sync (Coming Soon)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Priority support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="secondary" className="w-full" onClick={() => onPlanSelect('architect')}>
              Become an Architect
            </Button>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
};
