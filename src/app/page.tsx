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
import { collection, addDoc, doc, setDoc, updateDoc, onSnapshot, serverTimestamp, query } from 'firebase/firestore';
import { getTodayString, getYesterdayString, generateMockWallBricks } from "@/lib/mock-data";
import { GuideModal } from "@/components/buildnotburn/GuideModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Building, Flame } from "lucide-react";
import Link from "next/link";
import { SignInModal } from "@/components/buildnotburn/SignInModal";


type AppState = 'loading' | 'paywall' | 'audit' | 'building';
type Plan = 'trial' | 'builder' | 'architect';

const TRIAL_MAX_BRICKS = 3;

export default function Home() {
  const [appState, setAppState] = useState<AppState>('loading');
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
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [mockWallBricks, setMockWallBricks] = useState<Brick[]>([]);


  useEffect(() => {
    setIsMounted(true);
    setMockWallBricks(generateMockWallBricks());
  }, []);


  useEffect(() => {
    if (userLoading) {
      setAppState('loading');
      return;
    }
  
    if (!user) {
      setAppState('paywall');
      return;
    }
  
    // User is logged in, set up listeners.
    if (db) {
      const userRef = doc(db, `users/${user.uid}`);
      const unsubscribeUser = onSnapshot(userRef, (userDoc) => {
        if (userDoc.exists()) {
          const userPlan: Plan = userDoc.data().plan || 'trial';
          setPlan(userPlan);
  
          // Check if guide should be shown for new paid users
          const hasSeenGuide = localStorage.getItem('hasSeenGuide');
          const isPaid = userPlan === 'builder' || userPlan === 'architect';
          
          // Set app state based on plan
          if (userPlan === 'builder') {
            setAppState('audit');
            setMaxBricks(null);
          } else if (userPlan === 'architect') {
            setAppState('building');
            setMaxBricks(Infinity);
          } else { // Trial plan
            setAppState('building');
            setMaxBricks(TRIAL_MAX_BRICKS);
          }
        } else {
          // Fallback for a user who exists in auth but not in Firestore yet
          setPlan('trial');
          setAppState('building');
          setMaxBricks(TRIAL_MAX_BRICKS);
        }
      }, (error) => {
        console.error("Error fetching user data:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not load your user profile." });
        setAppState('paywall'); // Fallback to paywall on error
      });
  
      const bricksQuery = query(collection(db, `users/${user.uid}/bricks`));
      const unsubscribeBricks = onSnapshot(bricksQuery, (snapshot) => {
        const bricksFromDb = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Brick));
        setAllHistoricalBricks(bricksFromDb);
      }, (error) => {
        console.error("Error fetching bricks:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not load your bricks." });
      });
  
      return () => {
        unsubscribeUser();
        unsubscribeBricks();
      };
    }
  }, [user, userLoading, db, toast]);


  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      setAppState('paywall');
    }
  };


  const handleAuditSubmit = (maxBricksValue: number) => {
    setMaxBricks(maxBricksValue);
    setAppState('building');
  };
  
  const handleGuideClose = () => {
    localStorage.setItem('hasSeenGuide', 'true');
    setIsGuideOpen(false);
  };

  const todayString = getTodayString();
  const todaysIncompleteBricks = allHistoricalBricks.filter(b => !b.isCompleted && b.date === todayString && user && b.userId === user.uid);
  const todaysCompletedBricks = allHistoricalBricks.filter(b => b.isCompleted && b.date === todayString && user && b.userId === user.uid);

  const addBrick = async (text: string) => {
    if (!text.trim() || !user || !db) return;
    const upperCaseText = text.toUpperCase();

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
    if (!brickToBurn || !user || !db) return;
  
    playSound('thud');
    toast({
      title: "Brick Moved to Burn Pile",
      description: `"${brickToBurn.text}" is no longer a priority for today.`,
    });
  
    const yesterday = getYesterdayString();
  
    const brickRef = doc(db, `users/${user.uid}/bricks/${id}`);
    await updateDoc(brickRef, { date: yesterday });
  };

  const completeBrick = async (id: string) => {
    if (!user || !db) return;
    playSound('thud');
    const brickRef = doc(db, `users/${user.uid}/bricks/${id}`);
    await setDoc(brickRef, { isCompleted: true }, { merge: true });
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
    const isOwner = user ? b.userId === user.uid : false;
    return !isToday && !b.isCompleted && isOwner;
  });

  const isAtBrickLimit = 
      (user && plan === 'trial' && allHistoricalBricks.filter(b => b.userId === user.uid).length >= TRIAL_MAX_BRICKS) ||
      (user && plan === 'builder' && maxBricks !== null && maxBricks !== Infinity && todaysIncompleteBricks.length >= maxBricks);
  
  const isPaidUser = plan === 'builder' || plan === 'architect';

  const renderContent = () => {
    if (appState === 'loading') {
      return <div className="text-center font-code text-muted-foreground">LOADING SYSTEM...</div>
    }
    if (appState === 'paywall') {
       return <Paywall 
         variantIds={{
            newsletter: process.env.NEXT_PUBLIC_LEMONSQUEEZY_NEWSLETTER_VARIANT_ID!,
            builderMonthly: process.env.NEXT_PUBLIC_LEMONSQUEEZY_BUILDER_MONTHLY_VARIANT_ID!,
            builderAnnually: process.env.NEXT_PUBLIC_LEMONSQUEEZY_BUILDER_ANNUALLY_VARIANT_ID!,
            architectMonthly: process.env.NEXT_PUBLIC_LEMONSQUEEZY_ARCHITECT_MONTHLY_VARIANT_ID!,
            architectAnnually: process.env.NEXT_PUBLIC_LEMONSQUEEZY_ARCHITECT_ANNUALLY_VARIANT_ID!,
        }}
       />;
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
    <>
      <main className="container mx-auto max-w-4xl px-4 min-h-screen flex flex-col">
        <Header user={user} plan={plan} onLogout={handleLogout} onOpenGuide={() => setIsGuideOpen(true)} onSignIn={() => setIsSignInModalOpen(true)} />
        <div className="w-full flex-grow">
          {renderContent()}
        </div>
        <Wall bricks={user ? allHistoricalBricks : mockWallBricks} />
        <footer className="text-center py-8 mt-auto font-code text-xs text-muted-foreground/50 flex flex-col items-center gap-8">
          <ThemeSwitcher />
          <div className="flex items-center justify-center gap-4">
              <Link href="https://withcabin.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Privacy</Link>
              {isPaidUser && <button onClick={() => setIsGuideOpen(true)} className="hover:text-primary transition-colors">The Guide</button>}
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
      <SignInModal isOpen={isSignInModalOpen} onClose={() => setIsSignInModalOpen(false)} />
    </>
  );
}
