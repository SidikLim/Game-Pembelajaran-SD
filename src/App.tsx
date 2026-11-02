import { MotionConfig } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getLevel } from './data/levels';
import { setMuted } from './lib/audio';
import { recordResult } from './lib/progress';
import { scoreFor, starsFor } from './lib/scoring';
import { emptySave, loadSave, persistSave, type SaveData } from './lib/storage';
import type { HatColor, Profile, RunStats, Subject } from './lib/types';
import { Game } from './screens/Game';
import { LevelMap, ProfileScreen, SubjectScreen } from './screens/Menu';
import { Victory } from './screens/Victory';

type View =
  | { name: 'profile' }
  | { name: 'subject' }
  | { name: 'map'; subject: Subject }
  | { name: 'game'; subject: Subject; levelId: number; round: number }
  | { name: 'victory'; subject: Subject; levelId: number; stars: 1 | 2 | 3; score: number };

export default function App() {
  const [save, setSave] = useState<SaveData | null>(null);
  const [view, setView] = useState<View>({ name: 'profile' });
  const loaded = useRef(false);

  useEffect(() => {
    void loadSave().then((s) => {
      setSave(s);
      setMuted(s.muted);
      if (s.activeId && s.profiles.some((p) => p.id === s.activeId)) setView({ name: 'subject' });
      loaded.current = true;
    });
  }, []);

  const update = useCallback((fn: (s: SaveData) => SaveData) => {
    setSave((prev) => {
      const next = fn(prev ?? emptySave());
      void persistSave(next);
      return next;
    });
  }, []);

  if (!save) return <div className="grid h-full place-items-center text-3xl font-extrabold">Memuat… ⚓</div>;

  const profile = save.profiles.find((p) => p.id === save.activeId) ?? null;
  const patchProfile = (fn: (p: Profile) => Profile) =>
    update((s) => ({ ...s, profiles: s.profiles.map((p) => (p.id === s.activeId ? fn(p) : p)) }));

  const finish = (subject: Subject, levelId: number, stats: RunStats) => {
    const stars = starsFor(stats.mistakes);
    const score = scoreFor(stats);
    patchProfile((p) => recordResult(p, subject, levelId, stars, score));
    setView({ name: 'victory', subject, levelId, stars, score });
  };

  let screen;
  if (!profile || view.name === 'profile') {
    screen = (
      <ProfileScreen profiles={save.profiles}
        onPick={(id) => { update((s) => ({ ...s, activeId: id })); setView({ name: 'subject' }); }}
        onCreate={(name: string, hat: HatColor) => {
          const p: Profile = { id: crypto.randomUUID(), name, hat, progress: {} };
          update((s) => ({ ...s, profiles: [...s.profiles, p], activeId: p.id }));
          setView({ name: 'subject' });
        }} />
    );
  } else if (view.name === 'subject') {
    screen = (
      <SubjectScreen profile={profile} muted={save.muted}
        onToggleMute={() => { setMuted(!save.muted); update((s) => ({ ...s, muted: !s.muted })); }}
        onPick={(subject) => setView({ name: 'map', subject })} onSwitch={() => setView({ name: 'profile' })} />
    );
  } else if (view.name === 'map') {
    screen = <LevelMap profile={profile} subject={view.subject} onBack={() => setView({ name: 'subject' })}
      onPlay={(levelId) => setView({ name: 'game', subject: view.subject, levelId, round: 0 })} />;
  } else if (view.name === 'game') {
    const level = getLevel(view.subject, view.levelId)!;
    screen = <Game key={`${view.levelId}-${view.round}`} level={level} hat={profile.hat}
      onFinish={(stats) => finish(view.subject, view.levelId, stats)} onExit={() => setView({ name: 'map', subject: view.subject })} />;
  } else {
    const next = getLevel(view.subject, view.levelId + 1);
    const nextOk = !!next && next.challenge !== 'comingSoon';
    screen = <Victory stars={view.stars} score={view.score} hat={profile.hat} hasNext={nextOk}
      onNext={() => setView({ name: 'game', subject: view.subject, levelId: view.levelId + 1, round: 0 })}
      onRetry={() => setView({ name: 'game', subject: view.subject, levelId: view.levelId, round: Date.now() })}
      onMap={() => setView({ name: 'map', subject: view.subject })} />;
  }

  return <MotionConfig reducedMotion="user"><div className="min-h-full bg-gradient-to-b from-sea-100 to-sea-50">{screen}</div></MotionConfig>;
}
