"use client";

import { useState } from "react";
import { Header } from "@/components/buildnotburn/Header";
import { BrickForm } from "@/components/buildnotburn/BrickForm";
import { BrickList } from "@/components/buildnotburn/BrickList";
import { EnergyAudit } from "@/components/buildnotburn/EnergyAudit";
import { Wall } from "@/components/buildnotburn/Wall";
import type { Brick, AuditAnswers } from "@/types";

const MAX_BRICKS_HIGH = 3;
const MAX_BRICKS_MEDIUM = 2;
const MAX_BRICKS_LOW = 1;

export default function Home() {
  const [bricks, setBricks] = useState<Brick[]>([]);
  const [burnPile, setBurnPile] = useState<Brick[]>([]);
  const [maxBricks, setMaxBricks] = useState<number | null>(null);

  const handleAuditSubmit = (answers: AuditAnswers) => {
    const { sleep, meetings, dread } = answers;
    const score = sleep + meetings + dread;
    if (score <= 3) {
      setMaxBricks(MAX_BRICKS_HIGH);
    } else if (score <= 6) {
      setMaxBricks(MAX_BRICKS_MEDIUM);
    } else {
      setMaxBricks(MAX_BRICKS_LOW);
    }
  };

  const addBrick = (text: string) => {
    if (!text.trim() || maxBricks === null) return;
    const newBrick: Brick = {
      id: Date.now(),
      text: text.toUpperCase(),
      isCompleted: false,
      date: new Date().toISOString().split('T')[0],
    };

    if (bricks.length < maxBricks) {
      setBricks(prevBricks => [...prevBricks, newBrick]);
    } else {
      setBurnPile(prevBurnPile => [...prevBurnPile, newBrick]);
    }
  };

  const removeBrick = (id: number) => {
    setBricks(prevBricks =>
      prevBricks.map(brick =>
        brick.id === id ? { ...brick, isCompleted: true } : brick
      )
    );
  };

  const allBricks = [...bricks, ...burnPile];

  return (
    <main className="container mx-auto max-w-4xl px-4 min-h-screen flex flex-col">
      <Header />
      <div className="w-full flex-grow">
        {maxBricks === null ? (
          <EnergyAudit onSubmit={handleAuditSubmit} />
        ) : (
          <>
            <BrickForm addBrick={addBrick} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
              <div>
                <h2 className="font-headline text-2xl text-primary mb-2">BUILDING</h2>
                <BrickList bricks={bricks} removeBrick={removeBrick} />
              </div>
              <div>
                <h2 className="font-headline text-2xl text-muted-foreground/50 mb-2">BURN PILE</h2>
                <BrickList bricks={burnPile} removeBrick={() => {}} readOnly />
              </div>
            </div>
          </>
        )}
      </div>
      <Wall bricks={allBricks} />
      <footer className="text-center py-8 mt-auto font-code text-xs text-muted-foreground/50">
        <p>
          &copy; {new Date().getFullYear()} BuildNotBurn. All Systems Operational.
        </p>
        <p>Concept reimagined in Next.js & Tailwind CSS.</p>
      </footer>
    </main>
  );
}