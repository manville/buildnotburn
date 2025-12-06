'use client';
import { useEffect, useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import type { Brick } from '@/types';
import { AnalyticsDashboard } from '@/components/buildnotburn/AnalyticsDashboard';
import { calculateAnalytics, type AnalyticsData } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Header } from '@/components/buildnotburn/Header';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { Paywall } from '@/components/buildnotburn/Paywall';
import { SignInModal } from '@/components/buildnotburn/SignInModal';

type Plan = 'trial' | 'builder' | 'architect';

export default function ReviewPage() {
    const { user, loading: userLoading } = useUser();
    const db = useFirestore();
    const auth = useAuth();
    const [allBricks, setAllBricks] = useState<Brick[]>([]);
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [plan, setPlan] = useState<Plan | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);


    useEffect(() => {
        if (userLoading) {
            return;
        }
        if (!user || !db) {
            setIsLoading(false);
            return;
        }

        const userRef = doc(db, `users/${user.uid}`);
        const bricksQuery = collection(db, `users/${user.uid}/bricks`);

        const unsubscribeBricks = onSnapshot(bricksQuery, (snapshot) => {
            const bricksFromDb = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Brick));
            setAllBricks(bricksFromDb);
            setAnalytics(calculateAnalytics(bricksFromDb));
        });

        const unsubscribeUser = onSnapshot(userRef, (userDoc) => {
            if (userDoc.exists()) {
                setPlan(userDoc.data().plan || 'trial');
            }
            setIsLoading(false);
        });

        return () => {
            unsubscribeBricks();
            unsubscribeUser();
        };
    }, [user, userLoading, db]);

    const handleLogout = async () => {
        if (auth) {
            await signOut(auth);
        }
    };
    
    const renderContent = () => {
        if (isLoading || userLoading) {
            return <div className="text-center font-code text-muted-foreground">LOADING ANALYTICS...</div>;
        }

        if (!user || plan === 'trial') {
            return (
                 <Paywall 
                    variantIds={{
                        newsletter: process.env.NEXT_PUBLIC_LEMONSQUEEZY_NEWSLETTER_VARIANT_ID!,
                        builderMonthly: process.env.NEXT_PUBLIC_LEMONSQUEEZY_BUILDER_MONTHLY_VARIANT_ID!,
                        builderAnnually: process.env.NEXT_PUBLIC_LEMONSQUEEZY_BUILDER_ANNUALLY_VARIANT_ID!,
                        architectMonthly: process.env.NEXT_PUBLIC_LEMONSQUEEZY_ARCHITECT_MONTHLY_VARIANT_ID!,
                        architectAnnually: process.env.NEXT_PUBLIC_LEMONSQUEEZY_ARCHITECT_ANNUALLY_VARIANT_ID!,
                    }}
                />
            );
        }
        
        if (analytics) {
            return <AnalyticsDashboard analytics={analytics} />;
        }

        return <div className="text-center font-code text-muted-foreground">NO DATA TO ANALYZE.</div>;

    };

    return (
        <>
            <main className="container mx-auto max-w-6xl px-4 min-h-screen flex flex-col">
                <Header user={user} plan={plan} onLogout={handleLogout} onOpenGuide={() => {}} onSignIn={() => setIsSignInModalOpen(true)} />
                <div className="w-full flex-grow">
                <h1 className="font-headline text-4xl uppercase tracking-wider mb-8">Your Review</h1>
                {renderContent()}
                </div>
            </main>
            <SignInModal isOpen={isSignInModalOpen} onClose={() => setIsSignInModalOpen(false)} />
        </>
    );
}
