
import type { Brick } from '@/types';
import bricksData from '@/data/bricks.json';
import { format, subDays } from 'date-fns';

export const getTodayString = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

export const getYesterdayString = (): string => {
    return format(subDays(new Date(), 1), 'yyyy-MM-dd');
};

    