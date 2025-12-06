import type { Brick } from '@/types';
import bricksData from '@/data/bricks.json';
import { format } from 'date-fns';

// A consistent, static "today" for mock data purposes.
const staticToday = new Date('2024-07-01T12:00:00Z');

export const getTodayString = (): string => {
  return format(staticToday, 'yyyy-MM-dd');
};

export const getInitialBricks = (): { allBricks: Brick[] } => {
  const allBricks: Brick[] = (bricksData as Brick[]).map(b => ({
    ...b,
    id: typeof b.id === 'string' ? parseInt(b.id, 10) : b.id
  }));

  // Return all bricks, the filtering will be done in the component now.
  return { allBricks };
};
