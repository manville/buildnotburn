
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
import { getInitialBricks } from "@/lib/mock-data";

export default function Home() {
  const [bricks, setBricks] = useState<Brick[]>([]);
  const [burnPile, setBurnPile] = useState<Brick[]>([]);
  const [completedBricks, setCompletedBricks] = useState<Brick[]>([]);
  const [maxBricks, setMaxBricks] = useState<number | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const { completed, incomplete } = getInitialBricks();
    setBricks(incomplete);
    setCompletedBricks(completed);
  }, []);


  const handleAuditSubmit = (maxBricksValue: number) => {
    setMaxBricks(maxBricksValue);
  };

  const addBrick = (text: string) => {
    if (!text.trim()) return;

    if (maxBricks !== null && bricks.length >= maxBricks) {
      toast({
        variant: "destructive",
        title: "Capacity Reached: A Moment to Prioritize",
        description: "To add a new brick, you must move a current one to the burn pile. This forces prioritization.",
      });
      return;
    }

    const newBrick: Brick = {
      id: Date.now(),
      text: text.toUpperCase(),
      isCompleted: false,
      date: new Date().toISOString().split('T')[0],
    };
    
    setBricks(prevBricks => [...prevBricks, newBrick]);
  };
  
  const burnBrick = (id: number) => {
    const brickToBurn = bricks.find(b => b.id === id);
    if (brickToBurn) {
      setBricks(bricks.filter(b => b.id !== id));
      setBurnPile(prev => [...prev, { ...brickToBurn, isCompleted: false }]);
      toast({
        title: "Brick Moved to Burn Pile",
        description: `"${brickToBurn.text}" is no longer a priority for today.`,
      });
    }
  };

  const removeBrick = (id: number) => {
    let completedBrick: Brick | undefined;
    const newBricks = bricks.filter(brick => {
      if (brick.id === id) {
        completedBrick = { ...brick, isCompleted: true, date: new Date().toISOString().split('T')[0] };
        return false;
      }
      return true;
    });

    setBricks(newBricks);
    if (completedBrick) {
      playSound('thud');
      setCompletedBricks(prev => [...prev, completedBrick!]);
    }
  };
  
  const reorderBricks = (fromId: number, toId: number) => {
    const fromIndex = bricks.findIndex(b => b.id === fromId);
    const toIndex = bricks.findIndex(b => b.id === toId);

    if (fromIndex === -1 || toIndex === -1) return;

    const newBricks = [...bricks];
    const [movedBrick] = newBricks.splice(fromIndex, 1);
    newBricks.splice(toIndex, 0, movedBrick);
    setBricks(newBricks);
  };

  const handleLayMore = () => {
    setMaxBricks(prev => (prev ? prev + 1 : 1));
  };


  const allBricksForWall = [...completedBricks, ...bricks.filter(b => b.isCompleted)];
  
  const allDailyBricksCompleted = maxBricks !== null && bricks.length === 0;

  return (
    <main className="container mx-auto max-w-4xl px-4 min-h-screen flex flex-col">
      <Header />
      <div className="w-full flex-grow">
        {maxBricks === null ? (
          <EnergyAudit onSubmit={handleAuditSubmit} />
        ) : (
          <>
            {allDailyBricksCompleted ? (
              <Firebreak onLayMore={handleLayMore} />
            ) : (
              <BrickForm addBrick={addBrick} disabled={maxBricks !== null && bricks.length >= maxBricks} />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
              <div>
                <h2 className="font-headline text-2xl text-primary mb-2">BUILDING</h2>
                <BrickList 
                  bricks={bricks} 
                  removeBrick={removeBrick} 
                  burnBrick={burnBrick}
                  reorderBricks={reorderBricks}
                  maxBricks={maxBricks}
                />
              </div>
              <div>
                <h2 className="font-headline text-2xl text-muted-foreground/50 mb-2">THE BURN PILE</h2>
                <BrickList bricks={burnPile} removeBrick={() => {}} variant="burn" />
              </div>
            </div>
          </>
        )}
      </div>
      <Wall bricks={allBricksForWall} />
      <footer className="text-center py-8 mt-auto font-code text-xs text-muted-foreground/50">
        <p>
          &copy; {new Date().getFullYear()} BuildNotBurn. All Systems Operational.
        </p>
        <p>Concept reimagined in Next.js & Tailwind CSS.</p>
      </footer>
    </main>
  );
}
