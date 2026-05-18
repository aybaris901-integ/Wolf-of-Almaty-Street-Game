import { GameState } from './state';
import { Difficulty } from './data';

const SAVE_KEY = 'wolf_almaty_save_v2';

export interface SaveData {
  tenge: number;
  reputation: number;
  charisma: number;
  inventory: GameState['inventory'];
  day: number;
  difficulty: Difficulty | null;
  salesCompleted: number;
  pitchesCompleted: number;
  totalEarned: number;
  completedContracts: string[];
  lifetimeStats: GameState['lifetimeStats'];
  savedAt: number;
}

export function saveGame(state: GameState): void {
  if (state.phase === 'intro') return;
  try {
    const data: SaveData = {
      tenge: state.tenge,
      reputation: state.reputation,
      charisma: state.charisma,
      inventory: state.inventory,
      day: state.day,
      difficulty: state.difficulty,
      salesCompleted: state.salesCompleted,
      pitchesCompleted: state.pitchesCompleted,
      totalEarned: state.totalEarned,
      completedContracts: state.completedContracts,
      lifetimeStats: state.lifetimeStats,
      savedAt: Date.now(),
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (_) {
    // localStorage unavailable (SSR or private browsing)
  }
}

export function loadSave(): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SaveData;
  } catch (_) {
    return null;
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (_) {}
}

export function hasSave(): boolean {
  try {
    return localStorage.getItem(SAVE_KEY) !== null;
  } catch (_) {
    return false;
  }
}