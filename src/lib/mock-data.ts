
import type { Brick } from '@/types';
import bricksData from '@/data/bricks.json';
import { format } from 'date-fns';

export const getTodayString = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

export const getInitialBricks = (): { allBricks: Brick[] } => {
  const allBricks: Brick[] = (bricksData as any[]).map(b => ({
    ...b,
    id: String(b.id),
    userId: 'sample-user' // Assign a generic ID for sample data
  }));

  // Return all bricks, the filtering will be done in the component now.
  return { allBricks };
};

    