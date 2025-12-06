import type { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, ShieldCheck } from 'lucide-react';

export const Firebreak: FC = () => {
  return (
    <Card className="max-w-xl mx-auto my-8 border-green-500/30 bg-green-900/10 text-center">
      <CardHeader>
        <div className="flex justify-center items-center gap-4">
            <ShieldCheck className="h-10 w-10 text-green-400" />
            <div>
                <CardTitle className="font-headline text-3xl uppercase tracking-wider text-green-400">Firebreak Engaged</CardTitle>
                <CardDescription className="font-code text-xs text-green-400/60">SYSTEM // MENTAL FIREBREAK PROTOCOL</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="font-code text-green-400/80">
        <p>You&apos;ve laid all your bricks for the day. Well done.</p>
        <p className="mt-2">A firebreak stops fire from spreading. A mental firebreak stops work from spreading into your life.</p>
        <p className="font-bold text-lg mt-4">Close the laptop. Do not reopen it.</p>
      </CardContent>
    </Card>
  );
};
