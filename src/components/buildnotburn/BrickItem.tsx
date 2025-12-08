
import type { FC, DragEvent } from 'react';
import React, { useState } from 'react';
import type { Brick } from '@/types';
import { Button } from '@/components/ui/button';
import { Check, Flame, Crosshair, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { playSound } from '@/lib/play-sound';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


interface BrickItemProps {
  brick: Brick;
  completeBrick: (id: string) => void;
  burnBrick?: (id: string) => void;
  onFocusBrick?: (id: string) => void;
  readOnly?: boolean;
  onDragStart?: (e: DragEvent<HTMLLIElement>, id: string) => void;
  onDragEnter?: (e: DragEvent<HTMLLIElement>, id: string) => void;
  onDragEnd?: (e: DragEvent<HTMLLIElement>) => void;
  isDragging?: boolean;
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
    <path d="M18 9V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4" />
    <path d="M18 9h-5a1 1 0 0 1-1-1V5" />
    <path d="M6 9H3a1 1 0 0 0-1 1v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10a1 1 0 0 0-1-1h-3" />
    <path d="M10 14h4" />
    <path d="M8 18h8" />
  </svg>
);


export const BrickItem: FC<BrickItemProps> = ({ 
  brick, 
  completeBrick, 
  burnBrick,
  onFocusBrick,
  readOnly = false,
  onDragStart,
  onDragEnter,
  onDragEnd,
  isDragging
}) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isBurning, setIsBurning] = useState(false);

  const handleComplete = () => {
    if (readOnly) return;
    setIsCompleting(true);
    setTimeout(() => {
      completeBrick(brick.id);
    }, 700);
  };
  
  const handleBurn = () => {
    if (burnBrick) {
      setIsBurning(true);
      playSound('thud');
      setTimeout(() => {
        burnBrick(brick.id);
      }, 500); // Animation duration
    }
  }

  const isBuilding = !readOnly && !brick.isCompleted;

  return (
    <li 
      draggable={isBuilding}
      onDragStart={(e) => onDragStart?.(e, brick.id)}
      onDragEnter={(e) => onDragEnter?.(e, brick.id)}
      onDragEnd={onDragEnd}
      className={cn(
        "group bg-card border border-border rounded-lg p-3 flex justify-between items-center transition-all",
        readOnly ? "border-dashed border-amber-900/60 bg-card/50" : "hover:bg-secondary/50",
        brick.isCompleted && "bg-green-900/30 border-green-700/50",
        isCompleting && "animate-brick-fall",
        isBurning && "animate-brick-burn",
        isDragging && "opacity-50",
        isBuilding && "cursor-grab"
      )}
      aria-label={brick.text}
    >
      <div className="flex items-center gap-3">
        {readOnly ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Flame className="h-4 w-4 text-amber-600/70" />
              </TooltipTrigger>
              <TooltipContent>
                <p>This brick is in the burn pile.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <BrickIcon className="h-4 w-4 text-primary/70" />
        )}
        <span className={cn(
          "font-code uppercase",
          readOnly && "text-muted-foreground/60 line-through",
          brick.isCompleted && "line-through text-muted-foreground"
        )}>
          {brick.text}
        </span>
        {brick.notes && <MessageSquare className="h-3 w-3 text-muted-foreground/50" />}
      </div>

      <div className="flex items-center gap-1">
        <TooltipProvider>
          {isBuilding && (
            <>
               <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onFocusBrick?.(brick.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground hover:bg-accent"
                    aria-label={`Focus on brick: ${brick.text}`}
                  >
                    <Crosshair className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Focus on Brick</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBurn}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-500 hover:text-amber-400 hover:bg-amber-500/10"
                    aria-label={`Move to burn pile: ${brick.text}`}
                  >
                    <Flame className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Move to Burn Pile</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                   <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleComplete}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:text-primary hover:bg-primary/10"
                      aria-label={`Complete brick: ${brick.text}`}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mark as Complete</p>
                </TooltipContent>
              </Tooltip>
            </>
          )}
        </TooltipProvider>
        {brick.isCompleted && (
          <Check className="h-5 w-5 text-green-500" />
        )}
      </div>
    </li>
  );
};
