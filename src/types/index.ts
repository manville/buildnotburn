
import { FieldValue } from "firebase/firestore";

export type Brick = {
  id: string;
  text: string;
  isCompleted: boolean;
  date: string; // YYYY-MM-DD
  userId: string;
  createdAt: FieldValue | string;
  notes?: string;
};

export interface AuditAnswers {
  sleep: number;
  meetings: number;
  dread: number;
}
