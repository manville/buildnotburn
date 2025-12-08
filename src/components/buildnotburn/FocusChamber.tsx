
'use client';

import { useState, type FC, useEffect } from 'react';
import type { Brick } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X, Check, Flame, CornerDownLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '@/hooks/use-toast';

interface FocusChamberProps {
  brick: Brick;
  onClose: () => void;
  onComplete: (id: string) => void;
  onBurn: (id: string) => void;
  onSaveNotes: (id: string, notes: string) => void;
}

export const FocusChamber: FC<FocusChamberProps> = ({ brick, onClose, onComplete, onBurn, onSaveNotes }) => {
  const [notes, setNotes] = useState(brick.notes || '');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSaveNotes = () => {
    setIsSaving(true);
    onSaveNotes(brick.id, notes);
    toast({ title: "Notes saved." });
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handleComplete = () => {
    onComplete(brick.id);
    onClose();
  };
  
  const handleBurn = () => {
    onBurn(brick.id);
    onClose();
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in-0"
      onClick={onClose}
    >
        <div className="relative w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <Card className="border-primary shadow-2xl shadow-primary/20 animate-in zoom-in-95">
                <CardHeader>
                    <CardDescription className="font-code text-primary">BRICK IN FOCUS</CardDescription>
                    <CardTitle className="font-headline text-4xl uppercase tracking-wider">
                        {brick.text}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        onBlur={handleSaveNotes}
                        placeholder="// ADD NOTES, THOUGHTS, OR LINKS HERE..."
                        className="min-h-[200px] bg-transparent font-code text-base"
                    />
                     <div className="text-right h-4 mt-2">
                        {isSaving && <p className="text-xs text-muted-foreground animate-pulse">Saving notes...</p>}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="ghost" onClick={onClose} className="text-muted-foreground">
                        <CornerDownLeft className="mr-2 h-4 w-4" />
                        Exit Focus
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="destructive" onClick={handleBurn}>
                            <Flame className="mr-2 h-4 w-4" />
                            Burn It
                        </Button>
                        <Button onClick={handleComplete}>
                            <Check className="mr-2 h-4 w-4" />
                            Mark as Complete
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    </div>
  );
};
