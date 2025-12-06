
import type { FC } from 'react';
import React, { useState } from 'react';
import type { Brick } from '@/types';
import { Button } from '@/components/ui/button';
import { Check, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';


interface BrickItemProps {
  brick: Brick;
  removeBrick: (id: number) => void;
  readOnly?: boolean;
}

const BrickIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M12 9v6" />
    <path d="M3 9h18" />
    <path d="M3 15h18" />
    <path d="M9 3v18" />
    <path d="M15 3v18" />
  </svg>
);


export const BrickItem: FC<BrickItemProps> = ({ brick, removeBrick, readOnly = false }) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = () => {
    if (readOnly) return;
    setIsCompleting(true);
    // Wait for animation to finish before removing
    setTimeout(() => {
      removeBrick(brick.id);
    }, 700); // Corresponds to animation duration
  };

  const isBuilding = !readOnly && !brick.isCompleted;

  return (
    <li className={cn(
      "group bg-card border border-border rounded-lg p-4 flex justify-between items-center transition-all",
      readOnly ? "border-dashed border-amber-900/60 bg-card/50" : "hover:bg-secondary/50",
      brick.isCompleted && "bg-green-900/30 border-green-700/50",
      isCompleting && "animate-brick-fall"
      )}>
      
      <div className="flex items-center gap-3">
        {readOnly && <Flame className="h-4 w-4 text-amber-600/70" />}
        {isBuilding && <BrickIcon className="h-4 w-4 text-primary/70" />}
        <span className={cn(
          "font-code uppercase",
          readOnly && "text-muted-foreground/60 line-through",
          brick.isCompleted && "line-through text-muted-foreground"
          )}>
          {brick.text}
        </span>
      </div>

      {!readOnly && !brick.isCompleted && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleComplete}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:text-primary hover:bg-primary/10 font-bold uppercase text-xs"
          aria-label={`Complete task: ${brick.text}`}
        >
          <Check className="h-4 w-4 mr-1" />
          Complete
        </Button>
      )}
       {brick.isCompleted && (
        <Check className="h-5 w-5 text-green-500" />
      )}
    </li>
  );
};
