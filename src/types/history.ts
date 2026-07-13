export interface GameMatch {
  id: string;
  date: string; // ISO String
  mastermind: string;
  scheme: string;
  victory: boolean;
  score?: number;
  playerCount: number;
}
