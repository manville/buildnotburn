
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
import { getInitialBricks, getTodayString } from "@/lib/mock-data";
import { ThemeSwitcher } from "@/components/buildnotburn/ThemeSwitcher";
import { Paywall } from "@/components/buildnotburn/Paywall";
import { useUser, useAuth, useFirestore } from '@/firebase';
import { collection, addDoc, doc, setDoc, deleteDoc, onSnapshot, serverTimestamp, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

type AppState = 'paywall' | 'audit' | 'building';
type Plan = 'trial' | 'builder' | 'architect';

const TRIAL_MAX_BRICKS = 3;

export default function Home() {
  const [appState, setAppState] = useState<AppState>('paywall');
  const [plan, setPlan] = useState<Plan | null>(null);
  const [allHistoricalBricks, setAllHistoricalBricks] = useState<Brick[]>([]);
  const [maxBricks, setMaxBricks] = useState<number | null>(null);
  const [newBrickText, setNewBrickText] = useState("");
  const { toast } = useToast();
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  
  useEffect(() => {
    if (userLoading) return; // Wait until user status is determined

    if (!user) {
      // Not logged in, use local mock data
      const { allBricks } = getInitialBricks();
      setAllHistoricalBricks(allBricks);
      setAppState('paywall');
    } else {
      // User is logged in, fetch from Firestore
      if (!db) return;
      const bricksQuery = query(collection(db, `users/${user.uid}/bricks`));
      const unsubscribe = onSnapshot(bricksQuery, (snapshot) => {
        const bricksFromDb = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Brick));
        setAllHistoricalBricks(bricksFromDb);
      });
      // TODO: Fetch user's plan from their profile
      // For now, let's just let them select a plan.
      if (!plan) {
        setAppState('paywall');
      }

      return () => unsubscribe();
    }
  }, [user, userLoading, db, plan]);

  const handleLogin = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Create user doc if it doesn't exist
      if (db) {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
            id: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
        }, { merge: true });
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Could not sign you in with Google. Please try again.",
      });
    }
  };

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      setPlan(null); // Reset plan on logout
      setAppState('paywall');
    }
  };


  const handlePlanSelect = async (selectedPlan: Plan) => {
    setPlan(selectedPlan);

    // If user is logged in, save their plan selection
    if (user && db) {
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

    if (plan === 'trial' && allHistoricalBricks.length >= TRIAL_MAX_BRICKS) {
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
      userId: user?.uid || 'local',
      createdAt: serverTimestamp() as any,
    };
    
    if (user && db) {
        const bricksCol = collection(db, `users/${user.uid}/bricks`);
        await addDoc(bricksCol, newBrick);
    } else {
        setAllHistoricalBricks(prevBricks => [...prevBricks, { ...newBrick, id: Date.now().toString(), createdAt: new Date().toISOString() }]);
    }
    setNewBrickText("");
  };
  
  const burnBrick = async (id: string) => {
    const brickToBurn = allHistoricalBricks.find(b => b.id === id);
    if (brickToBurn) {
        playSound('thud');
        if (user && db) {
            await deleteDoc(doc(db, `users/${user.uid}/bricks/${id}`));
        } else {
            setAllHistoricalBricks(prev => prev.filter(b => b.id !== id));
        }
        toast({
            title: "Brick Moved to Burn Pile",
            description: `"${brickToBurn.text}" is no longer a priority for today.`,
        });
    }
  };

  const completeBrick = async (id: string) => {
    if (user && db) {
        const brickRef = doc(db, `users/${user.uid}/bricks/${id}`);
        await setDoc(brickRef, { isCompleted: true }, { merge: true });
    } else {
        setAllHistoricalBricks(prevBricks =>
          prevBricks.map(brick => {
            if (brick.id === id) {
              playSound('thud');
              return { ...brick, isCompleted: true };
            }
            return brick;
          })
        );
    }
    playSound('thud');
  };
  
  const reorderBricks = (fromId: string, toId: string) => {
    // Reordering is a UI-only concern for now, not persisted.
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


  const isTrialAndFull = plan === 'trial' && allHistoricalBricks.length >= TRIAL_MAX_BRICKS;
  const isBuilderAndFull = plan === 'builder' && maxBricks !== null && maxBricks !== Infinity && todaysIncompleteBricks.length >= maxBricks;

  const renderContent = () => {
    if (userLoading) {
      return <div className="text-center font-code text-muted-foreground">LOADING SYSTEM...</div>
    }
    switch (appState) {
      case 'paywall':
        return <Paywall onPlanSelect={handlePlanSelect} onLogin={handleLogin} user={user} />;
      case 'audit':
        return <EnergyAudit onSubmit={handleAuditSubmit} />;
      case 'building':
        return (
          <>
            {allDailyBricksCompleted ? (
              <Firebreak onLayMore={handleLayMore} />
            ) : (
              <BrickForm 
                addBrick={addBrick} 
                text={newBrickText}
                setText={setNewBrickText}
                disabled={isTrialAndFull || isBuilderAndFull} 
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
                  maxBricks={(plan === 'trial' || plan === 'builder') && maxBricks ? maxBricks : (plan === 'architect' ? 99 : 0)}
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
      default:
        return null;
    }
  };

  return (
    <main className="container mx-auto max-w-4xl px-4 min-h-screen flex flex-col">
      <Header user={user} onLogout={handleLogout} />
      <div className="w-full flex-grow">
        {renderContent()}
      </div>
      <Wall bricks={allHistoricalBricks} />
      <footer className="text-center py-8 mt-auto font-code text-xs text-muted-foreground/50 flex flex-col items-center gap-4">
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
