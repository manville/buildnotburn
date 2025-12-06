
import type { FC, HTMLAttributes } from 'react';
import React from 'react';
import type { Brick } from '@/types';
import { cn } from '@/lib/utils';
import { subDays, format, parseISO } from 'date-fns';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WallProps {
  bricks: Brick[];
}

const NUM_DAYS = 90;
const MAX_BRICKS_PER_DAY = 3;

type DayData = {
  date: string;
  completedBricks: Brick[];
  totalCompleted: number;
};

const BrickSquare: FC<HTMLAttributes<HTMLDivElement> & {isFilled: boolean}> = ({ isFilled, ...props }) => {
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    if (isFilled) {
      // Trigger animation
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [isFilled]);

  return (
    <div
      {...props}
      className={cn(
        "w-full flex-1 rounded-[2px] transition-colors",
        isFilled
          ? "bg-primary/70 group-hover:bg-primary"
          : "bg-secondary/30 group-hover:bg-secondary/50",
        isFilled && "border border-background/20",
        isAnimating && 'animate-brick-lay' // Custom animation class
      )}
    />
  );
};


export const Wall: FC<WallProps> = ({ bricks }) => {
  const wallData = Array.from({ length: NUM_DAYS }).map((_, i) => {
    const date = subDays(new Date(), i);
    const dateString = format(date, 'yyyy-MM-dd');
    const completedBricks = bricks.filter(b => b.date === dateString && b.isCompleted);
    return { date: dateString, completedBricks, totalCompleted: completedBricks.length };
  }).reverse();

  return (
    <section className="mt-16 pb-8">
      <div className="flex justify-between items-end mb-4">
        <h2 className="font-headline text-2xl uppercase">The Wall</h2>
        <div className="flex items-center gap-4 font-code text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-secondary border border-border" />
            <span>MISSED</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-primary" />
            <span>BUILT</span>
          </div>
        </div>
      </div>
      <ScrollArea className="w-full whitespace-nowrap rounded-lg border border-border bg-card">
        <TooltipProvider delayDuration={0}>
          <div className="flex w-max space-x-1.5 p-4 h-48 items-end">
            {wallData.map(({ date, completedBricks, totalCompleted }) => (
              <Tooltip key={date}>
                <TooltipTrigger asChild>
                  <div className="group w-4 h-full flex flex-col-reverse justify-start gap-1 cursor-pointer">
                    {Array.from({ length: MAX_BRICKS_PER_DAY }).map((_, i) => (
                       <BrickSquare
                        key={i}
                        isFilled={i < totalCompleted}
                      />
                    ))}
                  </div>
                </TooltipTrigger>
                {completedBricks.length > 0 ? (
                  <TooltipContent>
                    <p className="font-bold text-primary font-code">{format(parseISO(date), 'PPP')}</p>
                    <ul className="mt-2 space-y-1">
                      {completedBricks.map(brick => (
                        <li key={brick.id} className="font-code text-xs">
                          <span className="text-primary mr-2">&gt;</span> {brick.text}
                        </li>
                      ))}
                    </ul>
                  </TooltipContent>
                ) : (
                  <TooltipContent>
                     <p className="font-code text-muted-foreground">{format(parseISO(date), 'PPP')}</p>
                     <p className="font-code text-xs text-muted-foreground/70 mt-1">// NO BRICKS LAID</p>
                  </TooltipContent>
                )
                }
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
};
