
"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/buildnotburn/Header";
import { BrickForm } from "@/components/buildnotburn/BrickForm";
import { BrickList } from "@/components/buildnotburn/BrickList";
import { EnergyAudit } from "@/components/buildnotburn/EnergyAudit";
import { Wall } from "@/components/buildnotburn/Wall";
import type { Brick } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { playSound } from "@/lib/play-sound";
import { Firebreak } from "@/components/buildnotburn/Firebreak";
import { ThemeSwitcher } from "@/components/buildnotburn/ThemeSwitcher";
import { Paywall } from "@/components/buildnotburn/Paywall";
import { useUser, useAuth, useFirestore } from '@/firebase';
import { collection, addDoc, doc, setDoc, deleteDoc, onSnapshot, serverTimestamp, query, writeBatch } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { getTodayString } from "@/lib/mock-data";
import { NewsletterForm } from "@/components/buildnotburn/NewsletterForm";

type AppState = 'paywall' | 'audit' | 'building';
type Plan = 'trial' | 'builder' | 'architect';

const TRIAL_MAX_BRICKS = 3;

export default function Home() {
  const [appState, setAppState] = useState<AppState>('building');
  const [plan, setPlan] = useState<Plan | null>(null);
  const [allHistoricalBricks, setAllHistoricalBricks] = useState<Brick[]>([]);
  const [maxBricks, setMaxBricks] = useState<number | null>(3);
  const [newBrickText, setNewBrickText] = useState("");
  const { toast } = useToast();
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();

  const syncAnonymousBricks = async (userId: string) => {
    if (!db || allHistoricalBricks.length === 0) return;
    
    const isDefaultData = allHistoricalBricks.some(b => typeof b.id === 'number');
    if (isDefaultData) {
      setAllHistoricalBricks([]);
      return;
    }

    const batch = writeBatch(db);
    const bricksCol = collection(db, `users/${userId}/bricks`);

    allHistoricalBricks.forEach(brick => {
      if (typeof brick.id === 'string' && brick.id.startsWith('local-')) {
        const newBrickRef = doc(bricksCol);
        const brickData: Omit<Brick, 'id'> = {
          text: brick.text,
          isCompleted: brick.isCompleted,
          date: brick.date,
          userId: userId,
          createdAt: serverTimestamp(),
        };
        batch.set(newBrickRef, brickData);
      }
    });

    try {
      await batch.commit();
    } catch (error) {
      console.error("Error syncing bricks:", error);
      toast({
        variant: "destructive",
        title: "Sync Error",
        description: "Could not save your initial bricks.",
      });
    }
  };

  useEffect(() => {
    if (userLoading) {
      return; 
    }
    if (!user) {
      setAppState('building');
      setPlan('trial'); 
      setMaxBricks(TRIAL_MAX_BRICKS);
      return;
    }
    if (!db) {
      return;
    }

    syncAnonymousBricks(user.uid);
    
    const userRef = doc(db, `users/${user.uid}`);
    const bricksQuery = query(collection(db, `users/${user.uid}/bricks`));

    const unsubscribeBricks = onSnapshot(bricksQuery, (snapshot) => {
      const bricksFromDb = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Brick));
      setAllHistoricalBricks(bricksFromDb);
    });

    const unsubscribeUser = onSnapshot(userRef, (userDoc) => {
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userPlan: Plan = userData.plan || 'trial';
        handlePlanSelect(userPlan, false);
      } else {
        setDoc(userRef, { plan: 'trial' }, { merge: true }).then(() => {
            handlePlanSelect('trial', false);
        });
      }
    });

    return () => {
      unsubscribeBricks();
      unsubscribeUser();
    }
  }, [user, userLoading, db]);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      setAllHistoricalBricks([]);
      setAppState('building');
      setPlan(null);
    }
  };

  const handlePlanSelect = async (selectedPlan: Plan, writeToDb = true) => {
    setPlan(selectedPlan);

    if (user && db && writeToDb) {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { plan: selectedPlan }, { merge: true });
    }
    
    if (selectedPlan === 'trial') {
      setMaxBricks(TRIAL_MAX_BRICKS);
      setAppState('building');
    } else if (selectedPlan === 'builder') {
      setAppState('audit');
    } else if (selectedPlan === 'architect') {
      setMaxBricks(Infinity); 
      setAppState('building');
    }
  };

  const handleAuditSubmit = (maxBricksValue: number) => {
    setMaxBricks(maxBricksValue);
    setAppState('building');
  };

  const todayString = getTodayString();
  const todaysIncompleteBricks = allHistoricalBricks.filter(b => !b.isCompleted && b.date === todayString);
  const todaysCompletedBricks = allHistoricalBricks.filter(b => b.isCompleted && b.date === todayString);

  const addBrick = async (text: string) => {
    if (!text.trim()) return;

    if (!user) {
      if (todaysIncompleteBricks.length >= TRIAL_MAX_BRICKS) {
        toast({
          title: "Save Your Progress!",
          description: "Sign in to save your bricks and lay more.",
        });
        setAppState('paywall');
        return;
      }
      const newLocalBrick: Brick = {
        id: `local-${Date.now()}`,
        text: text.toUpperCase(),
        isCompleted: false,
        date: todayString,
        userId: 'anonymous',
        createdAt: new Date().toISOString(),
      };
      setAllHistoricalBricks(prev => [...prev, newLocalBrick]);
      setNewBrickText("");
      return;
    }

    if (!db) return;

    if (plan === 'trial' && allHistoricalBricks.length >= TRIAL_MAX_BRICKS) {
      setAppState('paywall');
      toast({
        variant: "destructive",
        title: "Trial Limit Reached",
        description: "You've laid your 3 trial bricks! Upgrade to continue.",
      });
      return;
    }

    if (maxBricks !== null && maxBricks !== Infinity && todaysIncompleteBricks.length >= maxBricks) {
      toast({
        variant: "destructive",
        title: "Capacity Reached",
        description: "To add a new brick, you must first complete one or move it to the burn pile.",
      });
      return;
    }

    const newBrick: Omit<Brick, 'id'> = {
      text: text.toUpperCase(),
      isCompleted: false,
      date: todayString,
      userId: user.uid,
      createdAt: serverTimestamp(),
    };
    
    const bricksCol = collection(db, `users/${user.uid}/bricks`);
    await addDoc(bricksCol, newBrick);
    setNewBrickText("");
  };
  
  const burnBrick = async (id: string) => {
    if (!user || !db) {
      const brickToBurn = allHistoricalBricks.find(b => b.id === id);
      if (brickToBurn) {
        setAllHistoricalBricks(prev => prev.filter(b => b.id !== id));
        playSound('thud');
        toast({
          title: "Brick Moved to Burn Pile",
          description: `"${brickToBurn.text}" is no longer a priority for today.`,
        });
      }
      return;
    }

    const brickToBurn = allHistoricalBricks.find(b => b.id === id);
    if (brickToBurn) {
      playSound('thud');
      await deleteDoc(doc(db, `users/${user.uid}/bricks/${id}`));
      toast({
        title: "Brick Moved to Burn Pile",
        description: `"${brickToBurn.text}" is no longer a priority for today.`,
      });
    }
  };

  const completeBrick = async (id: string) => {
    if (!user || !db) {
       setAllHistoricalBricks(prev => prev.map(b => b.id === id ? {...b, isCompleted: true} : b));
       playSound('thud');
       return;
    }
    const brickRef = doc(db, `users/${user.uid}/bricks/${id}`);
    await setDoc(brickRef, { isCompleted: true }, { merge: true });
    playSound('thud');
  };
  
  const reorderBricks = (fromId: string, toId: string) => {
    const fromIndex = allHistoricalBricks.findIndex(b => b.id === fromId);
    const toIndex = allHistoricalBricks.findIndex(b => b.id === toId);

    if (fromIndex === -1 || toIndex === -1) return;

    const newBricks = [...allHistoricalBricks];
    const [movedBrick] = newBricks.splice(fromIndex, 1);
    newBricks.splice(toIndex, 0, movedBrick);
    setAllHistoricalBricks(newBricks);
  };

  const handleLayMore = () => {
    setMaxBricks(prev => (prev ? prev + 1 : 1));
  };

  const handlePlaceholderClick = (text: string) => {
    setNewBrickText(text);
  };
  
  const allDailyBricksCompleted = maxBricks !== null && 
                                  maxBricks !== Infinity &&
                                  todaysIncompleteBricks.length === 0 &&
                                  todaysCompletedBricks.length >= maxBricks;

  const burnPile = allHistoricalBricks.filter(b => {
    const isToday = b.date === todayString;
    return !isToday && !b.isCompleted;
  });

  const isAtBrickLimit = 
      (plan === 'trial' && todaysIncompleteBricks.length >= TRIAL_MAX_BRICKS) ||
      (plan === 'builder' && maxBricks !== null && maxBricks !== Infinity && todaysIncompleteBricks.length >= maxBricks);

  const renderContent = () => {
    if (userLoading) {
      return <div className="text-center font-code text-muted-foreground">LOADING SYSTEM...</div>
    }
    if (appState === 'paywall') {
       return <Paywall onPlanSelect={(p) => handlePlanSelect(p, true)} user={user} />;
    }
    if (appState === 'audit') {
      return <EnergyAudit onSubmit={handleAuditSubmit} />;
    }
    if (appState === 'building') {
      return (
        <>
          {allDailyBricksCompleted ? (
            <Firebreak onLayMore={handleLayMore} />
          ) : (
            <BrickForm 
              addBrick={addBrick} 
              text={newBrickText}
              setText={setNewBrickText}
              disabled={!!isAtBrickLimit} 
            />
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            <div>
              <h2 className="font-headline text-2xl text-primary mb-2">BUILDING</h2>
              <BrickList 
                bricks={todaysIncompleteBricks} 
                completeBrick={completeBrick} 
                burnBrick={burnBrick}
                reorderBricks={reorderBricks}
                maxBricks={maxBricks}
                onPlaceholderClick={handlePlaceholderClick}
              />
            </div>
            <div>
              <h2 className="font-headline text-2xl text-muted-foreground/50 mb-2">THE BURN PILE</h2>
              <BrickList bricks={burnPile} variant="burn" />
            </div>
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <main className="container mx-auto max-w-4xl px-4 min-h-screen flex flex-col">
      <Header user={user} onLogout={handleLogout} />
      <div className="w-full flex-grow">
        {renderContent()}
      </div>
      <Wall bricks={allHistoricalBricks} />
      <footer className="text-center py-8 mt-auto font-code text-xs text-muted-foreground/50 flex flex-col items-center gap-8">
        <NewsletterForm />
        <ThemeSwitcher />
        <div>
            <p>
            &copy; {new Date().getFullYear()} BuildNotBurn. All Systems Operational.
            </p>
            <p>The Sustainable System for Long-Term Creators.</p>
        </div>
      </footer>
    </main>
  );
}
