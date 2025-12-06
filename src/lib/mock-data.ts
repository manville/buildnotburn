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

// Simple pseudo-random generator with a seed
const createSeededRandom = (seed: number) => () => {
  let s = seed;
  s = Math.sin(s) * 10000;
  return s - Math.floor(s);
};

// Use a fixed seed for deterministic "randomness"
const seed = 12345;
const seededRandom = createSeededRandom(seed);

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(seededRandom() * arr.length)];

export const generateInitialBricks = (): { completed: Brick[], incomplete: Brick[] } => {
  const allBricks: Brick[] = [];
  let idCounter = 0;
  
  // Use a fixed date to avoid server-client mismatch
  const staticToday = new Date('2024-07-01T12:00:00.000Z');

  // Generate completed bricks for the last 365 days
  for (let i = 1; i < 365; i++) { // Start from yesterday
    const date = subDays(staticToday, i);
    const dateString = format(date, 'yyyy-MM-dd');
    const shouldHaveBricks = seededRandom() > 0.3; // 70% chance of having bricks on a given day

    if (shouldHaveBricks) {
      const numBricks = Math.floor(seededRandom() * 3) + 1; // 1 to 3 bricks
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

  // Generate a few incomplete bricks for "today"
  const incomplete: Brick[] = [];
  for (let i = 0; i < 2; i++) {
    incomplete.push({
        id: idCounter++,
        text: getRandomElement(brickTexts),
        date: format(staticToday, 'yyyy-MM-dd'),
        isCompleted: false,
    });
  }
  
  const completed = allBricks.filter(b => b.isCompleted);

  return { completed, incomplete };
};
