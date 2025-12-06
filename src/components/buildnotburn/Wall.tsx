import type { FC } from 'react';
import type { Brick } from '@/types';
import { cn } from '@/lib/utils';
import { subDays, format } from 'date-fns';

interface WallProps {
  bricks: Brick[];
}

const NUM_DAYS = 90;

type DayData = {
  date: string;
  completed: number;
};

export const Wall: FC<WallProps> = ({ bricks }) => {
  const wallData = Array.from({ length: NUM_DAYS }).map((_, i) => {
    const date = subDays(new Date(), i);
    const dateString = format(date, 'yyyy-MM-dd');
    const completed = bricks.filter(b => b.date === dateString && b.isCompleted).length;
    return { date: dateString, completed };
  }).reverse();

  const maxCompleted = Math.max(...wallData.map(d => d.completed), 1);

  return (
    <section className="mt-16 pb-8">
      <h2 className="font-headline text-2xl text-center mb-4 uppercase">The Last 90 Days</h2>
      <div className="bg-card border border-border rounded-lg p-4 h-48 flex justify-between items-end gap-[2px]">
        {wallData.map(({ date, completed }) => {
          const heightPercentage = (completed / maxCompleted) * 100;
          return (
            <div
              key={date}
              className="flex-1 h-full flex flex-col-reverse"
              title={`${date}: ${completed} bricks`}
            >
              {completed > 0 && (
                 <div
                    className={cn(
                        "w-full bg-primary/20 transition-all duration-500",
                        completed > 0 && "bg-primary/70 hover:bg-primary"
                    )}
                    style={{ height: `${heightPercentage}%` }}
                 />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};