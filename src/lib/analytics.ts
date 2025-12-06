
import type { Brick } from '@/types';
import { differenceInCalendarDays, parse, startOfWeek, format, addDays, eachDayOfInterval } from 'date-fns';

export interface AnalyticsData {
  longestStreak: number;
  totalBricks: number;
  weeklyBuildBurn: { built: number; burned: number };
  dailyProductivity: { name: string; built: number }[];
}

export function calculateAnalytics(allBricks: Brick[]): AnalyticsData {
  const completedBricks = allBricks.filter(b => b.isCompleted);
  const uncompletedBricks = allBricks.filter(b => !b.isCompleted);

  // 1. Longest Streak
  let longestStreak = 0;
  if (completedBricks.length > 0) {
    const uniqueDates = [
      ...new Set(completedBricks.map(b => b.date)),
    ].map(d => parse(d, 'yyyy-MM-dd', new Date())).sort((a, b) => a.getTime() - b.getTime());

    if (uniqueDates.length > 0) {
        let currentStreak = 1;
        longestStreak = 1;
        for (let i = 1; i < uniqueDates.length; i++) {
            if (differenceInCalendarDays(uniqueDates[i], uniqueDates[i-1]) === 1) {
                currentStreak++;
            } else {
                currentStreak = 1;
            }
            if (currentStreak > longestStreak) {
                longestStreak = currentStreak;
            }
        }
    }
  }

  // 2. Total Bricks
  const totalBricks = completedBricks.length;

  // 3. Weekly Build/Burn Ratio
  const oneWeekAgo = addDays(new Date(), -7);
  const weeklyBuilt = completedBricks.filter(b => parse(b.date, 'yyyy-MM-dd', new Date()) >= oneWeekAgo).length;
  // Note: We don't have a concept of "burned" bricks that are distinct from "incomplete."
  // For this metric, we'll consider any *uncompleted* brick from the last 7 days a "burn".
  const weeklyBurned = uncompletedBricks.filter(b => parse(b.date, 'yyyy-MM-dd', new Date()) >= oneWeekAgo).length;

  // 4. Daily Productivity
  const dailyProductivity: { [key: string]: number } = {
    'Sun': 0, 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0
  };
  completedBricks.forEach(b => {
    const dayOfWeek = format(parse(b.date, 'yyyy-MM-dd', new Date()), 'E'); // 'Mon', 'Tue', etc.
    dailyProductivity[dayOfWeek]++;
  });
  const productivityArray = Object.entries(dailyProductivity).map(([name, built]) => ({ name, built }));


  return {
    longestStreak,
    totalBricks,
    weeklyBuildBurn: { built: weeklyBuilt, burned: weeklyBurned },
    dailyProductivity: productivityArray,
  };
}
