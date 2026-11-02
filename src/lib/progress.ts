import { LEVELS } from '../data/levels';
import type { LevelResult, Profile, Subject } from './types';

export const progressKey = (subject: Subject, levelId: number) => `${subject}:${levelId}`;

export function isPlayable(subject: Subject, levelId: number): boolean {
  return LEVELS[subject].find((l) => l.id === levelId)?.challenge !== 'comingSoon';
}

/**
 * Level terbuka bila level sebelumnya selesai. Selama irisan vertikal,
 * level yang belum dibuat ("Segera hadir") dianggap sudah dilewati
 * supaya pemain tidak buntu (lihat docs/PERUBAHAN.md).
 */
export function isUnlocked(profile: Profile, subject: Subject, levelId: number): boolean {
  if (levelId <= 1) return true;
  const prev = LEVELS[subject].find((l) => l.id === levelId - 1);
  if (!prev) return false;
  if (prev.challenge === 'comingSoon') return isUnlocked(profile, subject, prev.id);
  return profile.progress[progressKey(subject, prev.id)]?.completed === true;
}

/** Simpan hasil terbaik: bintang dan skor tidak pernah turun. */
export function recordResult(profile: Profile, subject: Subject, levelId: number, stars: 1 | 2 | 3, score: number): Profile {
  const key = progressKey(subject, levelId);
  const old: LevelResult | undefined = profile.progress[key];
  const next: LevelResult = {
    completed: true,
    stars: Math.max(old?.stars ?? 0, stars) as LevelResult['stars'],
    bestScore: Math.max(old?.bestScore ?? 0, score),
  };
  return { ...profile, progress: { ...profile.progress, [key]: next } };
}

export const totalStars = (p: Profile) => Object.values(p.progress).reduce((s, r) => s + r.stars, 0);
