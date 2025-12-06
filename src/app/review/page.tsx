
'use client';
import { useEffect, useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import type { Brick } from '@/types';
import { AnalyticsDashboard } from '@/components/buildnotburn/AnalyticsDashboard';
import { calculateAnalytics, type AnalyticsData } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Header } from '@/components/buildnotburn/Header';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { Paywall } from '@/components/buildnotburn/Paywall';

type Plan = 'trial' | 'builder' | 'architect';

export default function ReviewPage() {
    const { user, loading: userLoading } = useUser();
    const db = useFirestore();
    const auth = useAuth();
    const [allBricks, setAllBricks] = useState<Brick[]>([]);
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [plan, setPlan] = useState<Plan | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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

    const handlePlanSelect = (selectedPlan: Plan) => {
        if (user && db) {
            const userRef = doc(db, "users", user.uid);
            setDoc(userRef, { plan: selectedPlan }, { merge: true });
        }
    }
    
    const renderContent = () => {
        if (isLoading || userLoading) {
            return <div className="text-center font-code text-muted-foreground">LOADING ANALYTICS...</div>;
        }

        if (!user) {
            return (
                <div className="text-center">
                    <h2 className="font-headline text-2xl text-primary">Access Denied</h2>
                    <p className="text-muted-foreground mt-2">You must be logged in to view your review.</p>
                    <Button asChild className="mt-4">
                        <Link href="/">Return Home</Link>
                    </Button>
                </div>
            );
        }
        
        if (plan === 'trial') {
            return <Paywall onPlanSelect={handlePlanSelect} user={user} />;
        }

        if (analytics) {
            return <AnalyticsDashboard analytics={analytics} />;
        }

        return <div className="text-center font-code text-muted-foreground">NO DATA TO ANALYZE.</div>;

    };

    return (
        <main className="container mx-auto max-w-6xl px-4 min-h-screen flex flex-col">
            <Header user={user} onLogout={handleLogout} />
            <div className="w-full flex-grow">
              <h1 className="font-headline text-4xl uppercase tracking-wider mb-8">Your Review</h1>
              {renderContent()}
            </div>
        </main>
    );
}
