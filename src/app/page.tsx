
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
import { collection, addDoc, doc, setDoc, updateDoc, onSnapshot, serverTimestamp, query, writeBatch } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { getTodayString, getYesterdayString, getInitialBricks } from "@/lib/mock-data";
import { NewsletterForm } from "@/components/buildnotburn/NewsletterForm";
import { GuideModal } from "@/components/buildnotburn/GuideModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Building, Flame } from "lucide-react";
import Link from "next/link";


type AppState = 'paywall' | 'audit' | 'building';
type Plan = 'trial' | 'builder' | 'architect';

const TRIAL_MAX_BRICKS = 3;

export default function Home() {
  const [appState, setAppState] = useState<AppState>('building');
  const [plan, setPlan] = useState<Plan | null>(null);
  const [allHistoricalBricks, setAllHistoricalBricks] = useState<Brick[]>([]);
  const [maxBricks, setMaxBricks] = useState<number | null>(3);
  const [newBrickText, setNewBrickText] = useState("");
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();

  useEffect(() => {
    setIsMounted(true);
    // On first load, check if the user has seen the guide.
    const hasSeenGuide = localStorage.getItem('hasSeenGuide');
    if (!hasSeenGuide) {
      setIsGuideOpen(true);
    }
  }, []);

  const handleGuideClose = () => {
    localStorage.setItem('hasSeenGuide', 'true');
    setIsGuideOpen(false);
  }

  const syncAnonymousBricks = async (userId: string) => {
    if (!db || allHistoricalBricks.length === 0) return;
    
    const bricksToSync = allHistoricalBricks.filter(brick => 
        typeof brick.id === 'string' && brick.id.startsWith('local-')
    );

    if (bricksToSync.length === 0) return;

    const batch = writeBatch(db);
    const bricksCol = collection(db, `users/${userId}/bricks`);

    bricksToSync.forEach(brick => {
      const newBrickRef = doc(bricksCol);
      const brickData: Omit<Brick, 'id'> & { createdAt: any } = {
        text: brick.text,
        isCompleted: brick.isCompleted,
        date: brick.date,
        userId: userId,
        createdAt: serverTimestamp(),
      };
      batch.set(newBrickRef, brickData);
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
      
      const localBricks = allHistoricalBricks.filter(b => b.userId === 'anonymous');
      if (localBricks.length === 0) {
        const { allBricks: mockBricks } = getInitialBricks();
        setAllHistoricalBricks(mockBricks);
      }
      return;
    }
    if (!db) {
      return;
    }

    if (allHistoricalBricks.some(b => b.userId !== user.uid)) {
        setAllHistoricalBricks([]);
    }

    syncAnonymousBricks(user.uid);
    
    const userRef = doc(db, `users/${user.uid}`);
    const bricksQuery = query(collection(db, `users/${user.uid}/bricks`));

    const unsubscribeBricks = onSnapshot(bricksQuery, (snapshot) => {
      const bricksFromDb = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Brick));
      setAllHistoricalBricks(bricksFromDb);
    }, (error) => {
      console.error("Error fetching bricks:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not load your bricks." });
    });

    const unsubscribeUser = onSnapshot(userRef, (userDoc) => {
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userPlan: Plan = userData.plan || 'trial';
        handlePlanSelect(userPlan, false);
      } else {
        handlePlanSelect('trial', false);
      }
    }, (error) => {
      console.error("Error fetching user data:", error);
      toast({ variant: "destructive", title: "Error", description: "Could not load your user profile." });
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

  const handlePlanSelect = (selectedPlan: Plan, writeToDb = true) => {
    setPlan(selectedPlan);

    if (user && db && writeToDb) {
      const userRef = doc(db, "users", user.uid);
      setDoc(userRef, { plan: selectedPlan }, { merge: true });
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
  const todaysIncompleteBricks = allHistoricalBricks.filter(b => !b.isCompleted && b.date === todayString && (user ? b.userId === user.uid : (b.userId === 'anonymous' || b.userId === 'sample-user')));
  const todaysCompletedBricks = allHistoricalBricks.filter(b => b.isCompleted && b.date === todayString && (user ? b.userId === user.uid : (b.userId === 'anonymous' || b.userId === 'sample-user')));

  const addBrick = async (text: string) => {
    if (!text.trim()) return;
    const upperCaseText = text.toUpperCase();

    if (!user && allHistoricalBricks.some(b => b.userId === 'sample-user')) {
      setAllHistoricalBricks([]);
    }

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
        text: upperCaseText,
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

    if (plan === 'trial' && allHistoricalBricks.filter(b => b.userId === user.uid).length >= TRIAL_MAX_BRICKS) {
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

    const newBrick: Omit<Brick, 'id' | 'createdAt'> & { createdAt: any } = {
      text: upperCaseText,
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
    const brickToBurn = allHistoricalBricks.find(b => b.id === id);
    if (!brickToBurn) return;
  
    playSound('thud');
    toast({
      title: "Brick Moved to Burn Pile",
      description: `"${brickToBurn.text}" is no longer a priority for today.`,
    });
  
    const yesterday = getYesterdayString();
  
    if (!user || !db || id.toString().startsWith('local-')) {
      setAllHistoricalBricks(prev => prev.map(b => 
        b.id === id ? { ...b, date: yesterday } : b
      ));
    } else {
      const brickRef = doc(db, `users/${user.uid}/bricks/${id}`);
      await updateDoc(brickRef, { date: yesterday });
    }
  };

  const completeBrick = async (id: string) => {
    playSound('thud');
    if (!user || !db || id.toString().startsWith('local-')) {
       setAllHistoricalBricks(prev => prev.map(b => b.id === id ? {...b, isCompleted: true} : b));
    } else {
      const brickRef = doc(db, `users/${user.uid}/bricks/${id}`);
      await setDoc(brickRef, { isCompleted: true }, { merge: true });
    }
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
    const isOwner = user ? b.userId === user.uid : (b.userId === 'anonymous' || b.userId === 'sample-user');
    return !isToday && !b.isCompleted && isOwner;
  });

  const isAtBrickLimit = 
      (!user && todaysIncompleteBricks.length >= TRIAL_MAX_BRICKS) ||
      (user && plan === 'trial' && allHistoricalBricks.filter(b => b.userId === user.uid).length >= TRIAL_MAX_BRICKS) ||
      (user && plan === 'builder' && maxBricks !== null && maxBricks !== Infinity && todaysIncompleteBricks.length >= maxBricks);

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
              <div className="flex items-center gap-2 mb-2">
                <h2 className="font-headline text-2xl text-primary">BUILDING</h2>
                {isMounted && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Info className="h-4 w-4 text-primary/50" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                                <h4 className="font-bold font-code flex items-center gap-2"><Building className="h-4 w-4 text-primary" />BUILDING (THE BRICKS)</h4>
                                <p className="text-xs text-foreground/80 mt-1">These tasks compound. They create assets that work for you while you sleep. Examples: Writing code, recording a video, drafting a proposal, automating a manual process.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
              </div>
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
              <div className="flex items-center gap-2 mb-2">
                <h2 className="font-headline text-2xl text-muted-foreground/50">THE BURN PILE</h2>
                {isMounted && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Info className="h-4 w-4 text-muted-foreground/50" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                                <h4 className="font-bold font-code flex items-center gap-2"><Flame className="h-4 w-4 text-amber-500" />BURNING (THE GRAVEL)</h4>
                                <p className="text-xs text-foreground/80 mt-1">These tasks maintain the status quo. They feel productive because they are "busy," but they vanish as soon as you do them. Examples: Answering non-critical emails, Slack scrolling, organizing files, "researching" without output.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
              </div>
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
      <Header user={user} onLogout={handleLogout} onOpenGuide={() => setIsGuideOpen(true)} />
      <div className="w-full flex-grow">
        {renderContent()}
      </div>
      <Wall bricks={allHistoricalBricks} />
      <footer className="text-center py-8 mt-auto font-code text-xs text-muted-foreground/50 flex flex-col items-center gap-8">
        <NewsletterForm />
        <ThemeSwitcher />
        <div className="flex items-center justify-center gap-4">
            <Link href="https://withcabin.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Privacy</Link>
            <button onClick={() => setIsGuideOpen(true)} className="hover:text-primary transition-colors">The Guide</button>
            <Link href="mailto:support@buildnotburn.com" className="hover:text-primary transition-colors">Contact</Link>
        </div>
        <div>
            <p>
            &copy; {new Date().getFullYear()} BuildNotBurn. All Systems Operational.
            </p>
            <p>The Sustainable System for Long-Term Creators.</p>
        </div>
      </footer>
      <GuideModal isOpen={isGuideOpen} onClose={handleGuideClose} />
    </main>
  );
}
