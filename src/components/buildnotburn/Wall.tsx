import type { FC } from 'react';
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
                  <div
                    className="w-4 h-full flex flex-col-reverse justify-start gap-1 cursor-pointer"
                  >
                    {Array.from({ length: MAX_BRICKS_PER_DAY }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-full flex-1 rounded-[2px] transition-colors",
                          i < totalCompleted
                            ? "bg-primary/70 group-hover:bg-primary"
                            : "bg-secondary/30 group-hover:bg-secondary/50",
                          (totalCompleted > 0 || i > 0) && "border border-background/20"
                        )}
                      />
                    ))}
                  </div>
                </TooltipTrigger>
                {completedBricks.length > 0 && (
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
                )}
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
};
