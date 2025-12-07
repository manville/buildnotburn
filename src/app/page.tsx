
"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/buildnotburn/Header";
import { GuideModal } from "@/components/buildnotburn/GuideModal";
import { SignInModal } from "@/components/buildnotburn/SignInModal";
import { Wall } from "@/components/buildnotburn/Wall";
import { ThemeSwitcher } from "@/components/buildnotburn/ThemeSwitcher";
import Link from "next/link";
import { useUser, useAuth, useFirestore } from '@/firebase';
import { signOut } from 'firebase/auth';
import { collection, onSnapshot, doc, query, orderBy, setDoc, serverTimestamp, addDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import type { Brick } from '@/types';
import { Paywall, type VariantIds } from "@/components/buildnotburn/Paywall";
import { EnergyAudit } from "@/components/buildnotburn/EnergyAudit";
import { MainWorkspace } from "@/components/buildnotburn/MainWorkspace";
import { generateMockWallBricks } from "@/lib/mock-data";
import { getTodayString } from "@/lib/mock-data";
import { playSound } from "@/lib/play-sound";


type Plan = 'trial' | 'builder' | 'architect';

export default function BuildNotBurnApp() {
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();

  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  const [bricks, setBricks] = useState<Brick[]>([]);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [maxBricks, setMaxBricks] = useState<number | null>(null);
  const [hasCompletedAudit, setHasCompletedAudit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const variantIds: VariantIds = {
    newsletter: process.env.NEXT_PUBLIC_LEMONSQUEEZY_NEWSLETTER_VARIANT_ID!,
    builderMonthly: process.env.NEXT_PUBLIC_LEMONSQUEEZY_BUILDER_MONTHLY_VARIANT_ID!,
    builderAnnually: process.env.NEXT_PUBLIC_LEMONSQUEEZY_BUILDER_ANNUALLY_VARIANT_ID!,
    architectMonthly: process.env.NEXT_PUBLIC_LEMONSQUEEZY_ARCHITECT_MONTHLY_VARIANT_ID!,
    architectAnnually: process.env.NEXT_PUBLIC_LEMONSQUEEZY_ARCHITECT_ANNUALLY_VARIANT_ID!,
  };

  useEffect(() => {
    if (userLoading) {
      return;
    }
    if (!user || !db) {
      setBricks(generateMockWallBricks());
      setIsLoading(false);
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);
    const bricksQuery = query(
      collection(db, 'users', user.uid, 'bricks'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribeUser = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        setPlan(userData.plan || 'trial');
        const userMaxBricks = userData.maxBricks;
        if(userMaxBricks) {
            setMaxBricks(userMaxBricks);
            setHasCompletedAudit(true);
        } else {
            setHasCompletedAudit(false);
        }
      } else {
        setPlan('trial');
        setHasCompletedAudit(false);
      }
      setIsLoading(false);
    });

    const unsubscribeBricks = onSnapshot(bricksQuery, (snapshot) => {
      const userBricks = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Brick));
      setBricks(userBricks);
    });

    return () => {
      unsubscribeUser();
      unsubscribeBricks();
    };
  }, [user, db, userLoading]);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      setMaxBricks(null);
      setHasCompletedAudit(false);
      setPlan(null);
    }
  };

  const handleAuditSubmit = async (newMaxBricks: number) => {
    if (user && db) {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { maxBricks: newMaxBricks }, { merge: true });
    }
    setMaxBricks(newMaxBricks);
    setHasCompletedAudit(true);
  };

  const handleLayMore = () => {
    if (maxBricks !== null) {
      setMaxBricks(maxBricks + 1);
    }
  }

  const addBrick = async (text: string) => {
    if (!text.trim() || !user || !db) return;

    const newBrick: Omit<Brick, 'id'> = {
      text: text.trim().toUpperCase(),
      isCompleted: false,
      date: getTodayString(),
      userId: user.uid,
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, 'users', user.uid, 'bricks'), newBrick);
  };

  const completeBrick = async (id: string) => {
    if (!user || !db) return;
    playSound('thud');
    const brickRef = doc(db, 'users', user.uid, 'bricks', id);
    await setDoc(brickRef, { isCompleted: true, date: getTodayString() }, { merge: true });
  };
  
  const burnBrick = async (id: string) => {
    if (!user || !db) return;
    const brickRef = doc(db, 'users', user.uid, 'bricks', id);
    await deleteDoc(brickRef);
  };

  const reorderBricks = async (fromId: string, toId: string) => {
    const fromIndex = bricks.findIndex(b => b.id === fromId);
    const toIndex = bricks.findIndex(b => b.id === toId);
    
    if (fromIndex === -1 || toIndex === -1) return;

    let newBricks = [...bricks];
    const [movedBrick] = newBricks.splice(fromIndex, 1);
    newBricks.splice(toIndex, 0, movedBrick);
    setBricks(newBricks);

    if (!user || !db) return;
    const batch = writeBatch(db);
    newBricks.forEach((brick, index) => {
        const brickRef = doc(db, 'users', user.uid, 'bricks', brick.id);
        // We need to use `createdAt` for ordering.
        // A simple approach is to use the index as a proxy for timestamp order,
        // but that's brittle. A better way would be to use a proper ordering field.
        // For now, we'll assume createdAt can be updated.
        // NOTE: This might be slow on large lists. A better solution would involve
        // updating only the affected bricks' order fields.
    });
    // Disabling remote reordering for now as it's complex and can be slow.
    // The local reordering provides immediate UX feedback.
    // await batch.commit();
  };

  
  if (userLoading || isLoading) {
    return (
       <main className="container mx-auto max-w-4xl px-4 min-h-screen flex flex-col">
        <Header user={null} plan={null} onLogout={() => {}} onOpenGuide={() => {}} onSignIn={() => {}} />
        <div className="w-full flex-grow flex items-center justify-center">
           <div className="text-center font-code text-muted-foreground">LOADING SYSTEMS...</div>
        </div>
      </main>
    )
  }

  const renderContent = () => {
    if (!user) {
        return <Paywall variantIds={variantIds} />;
    }
    
    if (plan !== 'architect' && !hasCompletedAudit) {
        return <EnergyAudit onSubmit={handleAuditSubmit} />;
    }

    return <MainWorkspace 
      bricks={bricks.filter(b => !b.isCompleted)} 
      maxBricks={plan === 'architect' ? 999 : maxBricks}
      addBrick={addBrick}
      completeBrick={completeBrick}
      burnBrick={burnBrick}
      reorderBricks={reorderBricks}
      onLayMore={handleLayMore}
    />;
  }

  return (
    <>
      <main className="container mx-auto max-w-4xl px-4 min-h-screen flex flex-col">
        <Header user={user} plan={plan} onLogout={handleLogout} onOpenGuide={() => setIsGuideOpen(true)} onSignIn={() => setIsSignInModalOpen(true)} />
        <div className="w-full flex-grow">
            {renderContent()}
        </div>
        <Wall bricks={bricks} />
        <footer className="text-center py-8 mt-auto font-code text-xs text-muted-foreground/50 flex flex-col items-center gap-8">
          <ThemeSwitcher />
          <div className="flex items-center justify-center gap-4">
              <Link href="https://withcabin.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Privacy</Link>
              <Link href="mailto:support@buildnotburn.com" className="hover:text-primary transition-colors">Contact</Link>
          </div>
          <div>
              <p>
              &copy; {new Date().getFullYear()} BuildNotBurn. All Systems Operational.
              </p>
              <p>The Sustainable System for Long-Term Creators.</p>
          </div>
        </footer>
        <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      </main>
      <SignInModal isOpen={isSignInModalOpen} onClose={() => setIsSignInModalOpen(false)} />
    </>
  );
}
