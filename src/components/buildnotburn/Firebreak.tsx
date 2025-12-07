'use client';
import type { FC } from 'react';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, ShieldCheck, Forward, PlusCircle, MinusCircle, Plus, Minus } from 'lucide-react';

const INITIAL_BREAK_DURATION = 900; // 15 minutes in seconds

interface FirebreakProps {
    onLayMore: () => void;
}

export const Firebreak: FC<FirebreakProps> = ({ onLayMore }) => {
  const [breakState, setBreakState] = useState<'idle' | 'breaking' | 'finished'>('idle');
  const [timer, setTimer] = useState(INITIAL_BREAK_DURATION);
  const [isDoneForReal, setIsDoneForReal] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (breakState === 'breaking' && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer <= 0 && breakState === 'breaking') {
      setBreakState('finished');
    }
    return () => clearInterval(interval);
  }, [breakState, timer]);

  const handleStartBreak = () => {
    setBreakState('breaking');
  };
  
  const handleLayMore = () => {
    onLayMore();
    setBreakState('idle');
    setTimer(INITIAL_BREAK_DURATION);
  }

  const handleTimeChange = (amount: number) => {
    setTimer(prev => Math.max(0, prev + amount));
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };
  
  if (isDoneForReal) {
     return (
        <Card className="max-w-xl mx-auto my-8 border-green-500/30 bg-green-900/10 text-center">
            <CardHeader>
                <div className="flex justify-center items-center gap-4">
                    <ShieldCheck className="h-10 w-10 text-green-400" />
                    <div>
                        <CardTitle className="font-headline text-3xl uppercase tracking-wider text-green-400">Firebreak Engaged</CardTitle>
                        <CardDescription className="font-code text-xs text-green-400/60">SYSTEM // MENTAL FIREBREAK PROTOCOL</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="font-code text-green-400/80">
                <p>You&apos;ve laid all your bricks for the day. Well done.</p>
                <p className="mt-2">A firebreak stops fire from spreading. A mental firebreak stops work from spreading into your life.</p>
                <p className="font-bold text-lg mt-4">Close the laptop. Do not reopen it.</p>
            </CardContent>
        </Card>
     )
  }

  return (
    <Card className="max-w-xl mx-auto my-8 border-primary/30 bg-card text-center">
      <CardHeader>
         <div className="flex justify-center items-center gap-4">
            <ShieldCheck className="h-10 w-10 text-primary" />
            <div>
                <CardTitle className="font-headline text-3xl uppercase tracking-wider text-primary">Daily Limit Reached</CardTitle>
                <CardDescription className="font-code text-xs text-primary/60">Acknowledge Completion. Rest is required.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="font-code text-muted-foreground">
        {breakState === 'idle' && (
          <div>
            <p>You&apos;ve laid all your scheduled bricks. A firebreak is recommended.</p>
            <div className="flex items-center justify-center gap-4 my-4">
                <Button variant="outline" size="icon" onClick={() => handleTimeChange(-300)}>
                    <Minus className="h-4 w-4" />
                </Button>
                <p className="font-bold text-5xl text-primary tabular-nums">{formatTime(timer)}</p>
                <Button variant="outline" size="icon" onClick={() => handleTimeChange(300)}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            <p className="text-xs text-muted-foreground/70">Adjust break time in 5-minute increments.</p>
          </div>
        )}
        {breakState === 'breaking' && (
          <div>
            <p>Break in progress. Disconnect.</p>
            <p className="font-bold text-5xl text-primary my-4 tabular-nums">{formatTime(timer)}</p>
            <p>Step away from the screen.</p>
          </div>
        )}
        {breakState === 'finished' && (
          <div>
             <p>Break complete. Energy levels reassessed.</p>
             <p className="font-bold mt-2">Choose your next action.</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-4">
        {breakState === 'idle' && (
            <Button onClick={handleStartBreak} className="w-full" size="lg" disabled={timer <= 0}>
                <Forward className="mr-2 h-4 w-4"/>
                Start Break
            </Button>
        )}
        {breakState === 'finished' && (
            <>
                <Button onClick={() => setIsDoneForReal(true)} variant="secondary" className="w-full">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    I&apos;m Done For The Day
                </Button>
                <Button onClick={handleLayMore} className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    Lay One More Brick
                </Button>
            </>
        )}

      </CardFooter>
    </Card>
  );
};
