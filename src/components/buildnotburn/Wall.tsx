
import type { FC, HTMLAttributes } from 'react';
import React from 'react';
import type { Brick } from '@/types';
import { cn } from '@/lib/utils';
import { subDays, format, parseISO, parse } from 'date-fns';
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

const NUM_DAYS = 365;
const MAX_BRICKS_PER_DAY = 3;

type DayData = {
  date: string;
  completedBricks: Brick[];
  totalCompleted: number;
};

const BrickSquare: FC<HTMLAttributes<HTMLDivElement> & {isFilled: boolean; isRecent: boolean}> = ({ isFilled, isRecent, ...props }) => {
  return (
    <div
      {...props}
      className={cn(
        "w-full flex-1 rounded-[2px] transition-colors",
        isFilled
          ? "bg-primary group-hover:bg-primary/80"
          : "bg-secondary/30 group-hover:bg-secondary/50",
        isFilled && "border border-background/20",
        isRecent && 'animate-brick-lay'
      )}
    />
  );
};


export const Wall: FC<WallProps> = ({ bricks }) => {
  const [recentlyCompleted, setRecentlyCompleted] = React.useState<string[]>([]);
  const [today, setToday] = React.useState(new Date());
  const prevBricksRef = React.useRef<Brick[]>(bricks);
  const scrollViewportRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // This effect runs only on the client, preventing hydration mismatch.
    setToday(new Date());
    // Scroll to the end (today) on initial load
    if (scrollViewportRef.current) {
        scrollViewportRef.current.scrollLeft = scrollViewportRef.current.scrollWidth;
    }
  }, []);

  React.useEffect(() => {
    const prevCompletedIds = prevBricksRef.current.filter(b => b.isCompleted).map(b => b.id);
    const currentCompletedIds = bricks.filter(b => b.isCompleted).map(b => b.id);
    const newBricks = currentCompletedIds.filter(id => !prevCompletedIds.includes(id));

    if (newBricks.length > 0) {
      setRecentlyCompleted(newBricks);
      const timer = setTimeout(() => {
        setRecentlyCompleted([]);
      }, 700); // Animation duration, should match CSS
      
      return () => clearTimeout(timer);
    }
    
    prevBricksRef.current = bricks;

  }, [bricks]);

  const wallData = React.useMemo(() => {
    const data: DayData[] = [];
    const brickMap = new Map<string, Brick[]>();

    bricks.forEach(brick => {
      if (brick.isCompleted && brick.date) {
        const dateString = format(parse(brick.date, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd');
        if (!brickMap.has(dateString)) {
          brickMap.set(dateString, []);
        }
        brickMap.get(dateString)!.push(brick);
      }
    });

    for (let i = 0; i < NUM_DAYS; i++) {
        const date = subDays(today, i);
        const dateString = format(date, 'yyyy-MM-dd');
        const completedBricks = brickMap.get(dateString) || [];
        data.push({ date: dateString, completedBricks, totalCompleted: completedBricks.length });
    }
    return data.reverse();
  }, [bricks, today]);

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
      <ScrollArea viewportRef={scrollViewportRef} className="w-full whitespace-nowrap rounded-lg border border-border bg-card">
        <TooltipProvider delayDuration={0}>
          <div className="flex w-max space-x-1.5 p-4 h-48 items-end">
            {wallData.map(({ date, completedBricks, totalCompleted }) => (
              <Tooltip key={date}>
                <TooltipTrigger asChild>
                  <div className="group w-4 h-full flex flex-col-reverse justify-start gap-1 cursor-pointer">
                    {Array.from({ length: MAX_BRICKS_PER_DAY }).map((_, i) => {
                       const brick = completedBricks[i];
                       const isFilled = i < totalCompleted;
                       const isRecent = brick ? recentlyCompleted.includes(brick.id) : false;
                       return (
                         <BrickSquare
                          key={i}
                          isFilled={isFilled}
                          isRecent={isRecent}
                        />
                       )
                    })}
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
