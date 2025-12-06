
'use client';

import { useState, type FC } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaywallProps {
  onPlanSelect: (plan: 'free' | 'paid') => void;
}

const plans = {
  monthly: {
    price: 5,
    priceId: 'price_monthly_supporter',
  },
  annually: {
    price: 50,
    priceId: 'price_annual_supporter',
  },
};

export const Paywall: FC<PaywallProps> = ({ onPlanSelect }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('annually');

  const handleBillingToggle = () => {
    setBillingCycle(prev => (prev === 'monthly' ? 'annually' : 'monthly'));
  };

  return (
    <div className="max-w-4xl mx-auto my-8">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl sm:text-5xl uppercase tracking-wider">Choose Your Plan</h1>
        <p className="font-code text-muted-foreground mt-2 max-w-2xl mx-auto">
          Start for free, or become an Architect to support the project and unlock unlimited potential.
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Free Plan */}
        <Card className="border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="font-headline text-2xl uppercase">Builder</CardTitle>
            <CardDescription className="font-code text-sm">The essentials for sustainable productivity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground">/ forever</span>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Daily brick limit via Energy Audit</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>The Wall timeline view</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Core system features</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => onPlanSelect('free')}>
              Continue with Builder
            </Button>
          </CardFooter>
        </Card>

        {/* Paid Plan */}
        <Card className="border-primary border-2 relative shadow-2xl shadow-primary/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold uppercase px-3 py-1 rounded-full">
                Best Value
            </div>
          <CardHeader className="pb-4">
            <CardTitle className="font-headline text-2xl uppercase">Architect</CardTitle>
            <CardDescription className="font-code text-sm">Build your masterpiece, one brick at a time.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">${billingCycle === 'monthly' ? plans.monthly.price : plans.annually.price / 12}</span>
              <span className="text-muted-foreground">/ month</span>
            </div>
            <ul className="space-y-2 text-sm text-foreground">
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
               <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Directly support development</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full font-bold" onClick={() => onPlanSelect('paid')}>
              Become an Architect
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div className="text-center mt-8">
          <button onClick={() => onPlanSelect('free')} className="text-sm font-code text-muted-foreground hover:text-primary transition-colors">
            or continue with the limited free plan
          </button>
      </div>
    </div>
  );
};
