
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [status, setStatus] = useState('Verifying...');

  useEffect(() => {
    if (!auth) {
        return;
    }

    const savedEmail = window.localStorage.getItem('emailForSignIn');
    
    if (isSignInWithEmailLink(auth, window.location.href) && savedEmail) {
      signInWithEmailLink(auth, savedEmail, window.location.href)
        .then(() => {
          setStatus('Success! Redirecting...');
          toast({
            title: 'Signed In',
            description: 'Welcome back!',
          });
          window.localStorage.removeItem('emailForSignIn');
          router.push('/');
        })
        .catch((error) => {
          setStatus('Error signing in.');
          toast({
            variant: 'destructive',
            title: 'Sign In Failed',
            description: error.message || 'The link may have expired. Please try again.',
          });
           router.push('/');
        });
    } else {
        setStatus('Invalid sign-in link.');
        toast({
            variant: 'destructive',
            title: 'Invalid Link',
            description: 'This sign-in link is not valid. Please request a new one.',
          });
        router.push('/');
    }
  }, [auth, router, toast]);

  return (
    <main className="container mx-auto max-w-lg px-4 min-h-screen flex flex-col justify-center items-center">
        <Card className="w-full">
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-3xl uppercase tracking-wider">Signing In</CardTitle>
                <CardDescription className="font-code text-sm">Please wait while we verify your sign-in link.</CardDescription>
            </CardHeader>
            <CardContent className="text-center font-code text-muted-foreground">
                <p>{status}</p>
            </CardContent>
        </Card>
    </main>
  );
}
