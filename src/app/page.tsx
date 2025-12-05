"use client";

import { useState } from "react";
import { Header } from "@/components/buildnotburn/Header";
import { BrickForm } from "@/components/buildnotburn/BrickForm";
import { BrickList } from "@/components/buildnotburn/BrickList";
import type { Brick } from "@/types";

const initialBricks: Brick[] = [
  { id: 1, text: "INITIALIZE THE REACTOR CORE" },
  { id: 2, text: "CALIBRATE THE FLUX CAPACITOR" },
  { id: 3, text: "POLISH THE WARP DRIVE" },
];

export default function Home() {
  const [bricks, setBricks] = useState<Brick[]>(initialBricks);

  const addBrick = (text: string) => {
    if (!text.trim()) return;
    const newBrick: Brick = {
      id: Date.now(), // Using timestamp for unique ID
      text: text.toUpperCase()
    };
    setBricks(prevBricks => [...prevBricks, newBrick]);
  };

  const removeBrick = (id: number) => {
    setBricks(prevBricks => prevBricks.filter(brick => brick.id !== id));
  };

  return (
    <main className="container mx-auto max-w-2xl px-4 min-h-screen flex flex-col">
      <Header />
      <div className="w-full">
        <BrickForm addBrick={addBrick} />
        <BrickList bricks={bricks} removeBrick={removeBrick} />
      </div>
      <footer className="text-center py-8 mt-auto font-code text-xs text-muted-foreground/50">
        <p>
          &copy; {new Date().getFullYear()} BuildNotBurn. All Systems Operational.
        </p>
        <p>HTMX/CFML concept rendered in Next.js & Tailwind CSS.</p>
      </footer>
    </main>
  );
}
