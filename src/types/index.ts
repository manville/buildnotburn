export type Brick = {
  id: number;
  text: string;
  isCompleted: boolean;
  date: string; // YYYY-MM-DD
};

export interface AuditAnswers {
  sleep: number;
  meetings: number;
  dread: number;
}
