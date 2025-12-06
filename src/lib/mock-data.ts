import { subDays, format } from 'date-fns';
import type { Brick } from '@/types';

const brickTexts = [
  "FINALIZE Q3 REPORT",
  "PREP FOR CLIENT PITCH",
  "REFACTOR AUTH MODULE",
  "UPDATE API DOCUMENTATION",
  "DESIGN NEW DASHBOARD",
  "FIX STAGING DEPLOYMENT",
  "RESEARCH PAYMENT GATEWAYS",
  "ONBOARD NEW HIRE",
  "PLAN TEAM OFFSITE",
  "REVIEW PULL REQUESTS",
  "SCHEDULE USER INTERVIEWS",
];

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const generateInitialBricks = (): { completed: Brick[], incomplete: Brick[] } => {
  const allBricks: Brick[] = [];
  let idCounter = 0;

  // Generate completed bricks for the last 90 days
  for (let i = 1; i < 90; i++) { // Start from yesterday
    const date = subDays(new Date(), i);
    const dateString = format(date, 'yyyy-MM-dd');
    const shouldHaveBricks = Math.random() > 0.3; // 70% chance of having bricks on a given day

    if (shouldHaveBricks) {
      const numBricks = Math.floor(Math.random() * 3) + 1; // 1 to 3 bricks
      for (let j = 0; j < numBricks; j++) {
        allBricks.push({
          id: idCounter++,
          text: getRandomElement(brickTexts),
          date: dateString,
          isCompleted: true,
        });
      }
    }
  }

  // Generate a few incomplete bricks from the last week
  const incomplete: Brick[] = [];
  for (let i = 0; i < 3; i++) {
    const date = subDays(new Date(), Math.floor(Math.random() * 7) + 1);
    incomplete.push({
        id: idCounter++,
        text: getRandomElement(brickTexts),
        date: format(date, 'yyyy-MM-dd'),
        isCompleted: false,
    });
  }
  
  const completed = allBricks.filter(b => b.isCompleted);

  return { completed, incomplete };
};
