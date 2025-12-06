
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  const router = useRouter();

  return (
    <main className="container mx-auto max-w-lg px-4 min-h-screen flex flex-col justify-center items-center">
        <Card className="w-full text-center">
            <CardHeader>
                <div className="mx-auto bg-green-500/20 text-green-500 rounded-full p-3 w-fit">
                    <CheckCircle className="h-12 w-12" />
                </div>
                <CardTitle className="font-headline text-3xl uppercase tracking-wider mt-4">Success!</CardTitle>
                <CardDescription className="font-code text-sm">Your account is ready. Welcome to BuildNotBurn.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={() => router.push('/')} size="lg" className="w-full font-bold">
                    Start Building
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="font-code text-muted-foreground text-xs mt-4">If you have any issues, please sign in using the link sent to your email.</p>
            </CardContent>
        </Card>
    </main>
  );
}
