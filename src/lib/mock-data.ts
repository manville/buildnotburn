import type { Brick } from '@/types';
import bricksData from '@/data/bricks.json';
import { format, subDays } from 'date-fns';

export const getTodayString = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

export const getYesterdayString = (): string => {
    return format(subDays(new Date(), 1), 'yyyy-MM-dd');
};

export const generateMockWallBricks = (): Brick[] => {
    const mockBricks: Brick[] = [];
    const today = new Date();
    const mockTexts = [
        "FINALIZE Q3 REPORT", "REFACTOR AUTH MODULE", "DESIGN NEW DASHBOARD",
        "SCHEDULE USER INTERVIEWS", "UPDATE API DOCUMENTATION", "FIX STAGING DEPLOYMENT",
        "PLAN TEAM OFFSITE", "PREP FOR CLIENT PITCH", "REVIEW PULL REQUESTS", "ONBOARD NEW HIRE"
    ];

    for (let i = 0; i < 90; i++) {
        const date = subDays(today, i);
        const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

        // Skip most weekends
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            if (Math.random() > 0.1) continue;
        }

        // Lay 1 to 3 bricks
        const bricksToLay = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < bricksToLay; j++) {
            mockBricks.push({
                id: `mock-${i}-${j}`,
                text: mockTexts[(i + j) % mockTexts.length],
                isCompleted: true,
                date: format(date, 'yyyy-MM-dd'),
                userId: 'mock-user',
                createdAt: date.toISOString(),
            });
        }
    }
    return mockBricks;
};
