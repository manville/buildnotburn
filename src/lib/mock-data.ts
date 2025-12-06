import type { Brick } from '@/types';
import bricksData from '@/data/bricks.json';
import { format, parseISO } from 'date-fns';

export const getInitialBricks = (): { completed: Brick[], incomplete: Brick[] } => {
  const allBricks: Brick[] = (bricksData as Brick[]).map(b => ({
    ...b,
    id: typeof b.id === 'string' ? parseInt(b.id, 10) : b.id
  }));
  
  // Use a fixed date to avoid server-client mismatch in rendering.
  // This should be the most recent date in the mock data that has incomplete tasks.
  const staticToday = new Date('2024-07-01T12:00:00Z');
  const todayString = format(staticToday, 'yyyy-MM-dd');

  // Completed bricks are all bricks marked as completed.
  const completed = allBricks.filter(b => {
    // A brick is considered completed for the wall if isCompleted is true.
    return b.isCompleted;
  });
  
  // Incomplete bricks are only those for "today" that are not completed.
  const incomplete = allBricks.filter(b => !b.isCompleted && b.date === todayString);

  return { completed, incomplete };
};
