export type Subject = 'math' | 'english';
export type ChallengeType = 'dragSum' | 'spellingBee' | 'comingSoon';

export interface LevelConfig {
  id: number; // 1..30
  subject: Subject;
  tier: 1 | 2 | 3;
  step: number;
  title: string;
  goal: string; // target level untuk pop-up
  challenge: ChallengeType;
  questions: number;
  /** Parameter khusus tantangan (mis. batas jumlah, panjang kata). */
  params: { maxSum?: number; wordLength?: number };
}

export interface LevelResult {
  stars: 0 | 1 | 2 | 3;
  bestScore: number;
  completed: boolean;
}

export interface Profile {
  id: string;
  name: string;
  hat: HatColor;
  progress: Record<string, LevelResult>; // kunci: `${subject}:${levelId}`
}

export type HatColor = 'teal' | 'coral' | 'gold' | 'violet';
export type MascotState = 'idle' | 'thinking' | 'correct' | 'wrong';

export interface RunStats {
  total: number;
  correct: number;
  mistakes: number;
  bestCombo: number;
}
