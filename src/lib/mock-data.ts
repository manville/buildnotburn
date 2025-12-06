import type { Brick } from '@/types';
import bricksData from '@/data/bricks.json';
import { format } from 'date-fns';

export const getTodayString = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

export const getInitialBricks = (): { allBricks: Brick[] } => {
  const allBricks: Brick[] = (bricksData as Brick[]).map(b => ({
    ...b,
    id: typeof b.id === 'string' ? parseInt(b.id, 10) : b.id
  }));

  // Return all bricks, the filtering will be done in the component now.
  return { allBricks };
};
