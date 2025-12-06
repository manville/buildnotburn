
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: 'Payment Successful!',
      description: 'Welcome! You are now being redirected.',
    });

    const redirectTimer = setTimeout(() => {
      router.push('/');
    }, 3000); // 3-second delay

    return () => clearTimeout(redirectTimer);
  }, [router, toast]);

  return (
    <main className="container mx-auto max-w-lg px-4 min-h-screen flex flex-col justify-center items-center">
        <Card className="w-full text-center">
            <CardHeader>
                <div className="mx-auto bg-green-500/20 text-green-500 rounded-full p-3 w-fit">
                    <CheckCircle className="h-12 w-12" />
                </div>
                <CardTitle className="font-headline text-3xl uppercase tracking-wider mt-4">Payment Confirmed</CardTitle>
                <CardDescription className="font-code text-sm">Your account is ready. Redirecting you to the app...</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="font-code text-muted-foreground">If you are not redirected automatically, <a href="/" className="text-primary underline">click here</a>.</p>
            </CardContent>
        </Card>
    </main>
  );
}
