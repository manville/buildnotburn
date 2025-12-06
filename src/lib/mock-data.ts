import type { Brick } from '@/types';
import bricksData from '@/data/bricks.json';
import { format } from 'date-fns';

export const getInitialBricks = (): { completed: Brick[], incomplete: Brick[] } => {
  const allBricks: Brick[] = bricksData as Brick[];
  
  // Use a fixed date to avoid server-client mismatch in rendering
  const staticToday = new Date('2024-07-01T12:00:00.000Z');
  const todayString = format(staticToday, 'yyyy-MM-dd');

  const completed = allBricks.filter(b => b.isCompleted && b.date !== todayString);
  const incomplete = allBricks.filter(b => !b.isCompleted && b.date === todayString);

  return { completed, incomplete };
};
