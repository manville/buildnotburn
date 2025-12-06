
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

type AppState = 'paywall' | 'audit' | 'building';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('paywall');
  const [allHistoricalBricks, setAllHistoricalBricks] = useState<Brick[]>([]);
  const [maxBricks, setMaxBricks] = useState<number | null>(null);
  const [newBrickText, setNewBrickText] = useState("");
  const { toast } = useToast();
  
  useEffect(() => {
    // Load all bricks into state once on mount.
    const { allBricks } = getInitialBricks();
    setAllHistoricalBricks(allBricks);
  }, []);

  const handlePlanSelect = (plan: 'free' | 'paid') => {
    if (plan === 'free') {
      setAppState('audit');
    } else {
      // For paid plan, we skip the audit and allow unlimited bricks
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

  const addBrick = (text: string) => {
    if (!text.trim()) return;

    if (maxBricks !== null && maxBricks !== Infinity && todaysIncompleteBricks.length >= maxBricks) {
      toast({
        variant: "destructive",
        title: "Capacity Reached: A Moment to Prioritize",
        description: "To add a new brick, you must first complete one or move a current one to the burn pile. This is the system.",
      });
      return;
    }

    const newBrick: Brick = {
      id: Date.now(),
      text: text.toUpperCase(),
      isCompleted: false,
      date: todayString,
    };
    
    setAllHistoricalBricks(prevBricks => [...prevBricks, newBrick]);
    setNewBrickText("");
  };
  
  const burnBrick = (id: number) => {
    const brickToBurn = allHistoricalBricks.find(b => b.id === id);
    if (brickToBurn) {
        playSound('thud');
        // We just filter it out from the view, not permanently delete, so it goes to the burn pile
        setAllHistoricalBricks(prev => prev.filter(b => b.id !== id));
        toast({
            title: "Brick Moved to Burn Pile",
            description: `"${brickToBurn.text}" is no longer a priority for today.`,
        });
    }
  };

  const completeBrick = (id: number) => {
    setAllHistoricalBricks(prevBricks =>
      prevBricks.map(brick => {
        if (brick.id === id) {
          playSound('thud');
          return { ...brick, isCompleted: true };
        }
        return brick;
      })
    );
  };
  
  const reorderBricks = (fromId: number, toId: number) => {
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

  const burnPile = allHistoricalBricks.filter(b => b.date !== todayString && !b.isCompleted);

  const renderContent = () => {
    switch (appState) {
      case 'paywall':
        return <Paywall onPlanSelect={handlePlanSelect} />;
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
                disabled={maxBricks !== null && maxBricks !== Infinity && todaysIncompleteBricks.length >= maxBricks} 
              />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
              <div>
                <h2 className="font-headline text-2xl text-primary mb-2">BUILDING</h2>
                <BrickList 
                  bricks={todaysIncompleteBricks} 
                  removeBrick={completeBrick} 
                  burnBrick={burnBrick}
                  reorderBricks={reorderBricks}
                  maxBricks={maxBricks === Infinity ? 99 : maxBricks}
                  onPlaceholderClick={handlePlaceholderClick}
                />
              </div>
              <div>
                <h2 className="font-headline text-2xl text-muted-foreground/50 mb-2">THE BURN PILE</h2>
                <BrickList bricks={burnPile} removeBrick={() => {}} variant="burn" />
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
      <Header />
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
