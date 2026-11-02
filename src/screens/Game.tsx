import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DragSum } from '../challenges/DragSum';
import { SpellingBee } from '../challenges/SpellingBee';
import type { ChallengeProps } from '../challenges/types';
import { Mascot } from '../components/Mascot';
import { ComboPop, Modal, ProgressBar } from '../components/ui';
import { comboLabel } from '../lib/scoring';
import { sfx } from '../lib/audio';
import type { HatColor, LevelConfig, MascotState, RunStats } from '../lib/types';

const CHALLENGES: Record<string, (p: ChallengeProps) => JSX.Element> = { dragSum: DragSum, spellingBee: SpellingBee };

interface Props { level: LevelConfig; hat: HatColor; onFinish: (stats: RunStats) => void; onExit: () => void }

/** Satu putaran level: intro -> soal berulang (aksi, umpan balik instan, progres) -> selesai. */
export function Game({ level, hat, onFinish, onExit }: Props) {
  const seed = useMemo(() => Math.floor(Math.random() * 1e9), []);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [mascot, setMascot] = useState<MascotState>('idle');
  const [stats, setStats] = useState<RunStats>({ total: level.questions, correct: 0, mistakes: 0, bestCombo: 0 });
  const combo = useRef(0);
  const [comboText, setComboText] = useState<{ label: string | null; n: number }>({ label: null, n: 0 });
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)); };

  const Challenge = CHALLENGES[level.challenge];

  const handleAnswer = useCallback((correct: boolean) => {
    if (correct) {
      combo.current += 1;
      sfx.correct(); // SFX sinkron dengan munculnya bintang/maskot
      setMascot('correct');
      const label = comboLabel(combo.current);
      setComboText((c) => ({ label, n: c.n + 1 }));
      const next = { ...stats, correct: stats.correct + 1, bestCombo: Math.max(stats.bestCombo, combo.current) };
      setStats(next);
      later(() => setComboText((c) => ({ ...c, label: null })), 1100);
      later(() => {
        if (index + 1 >= level.questions) onFinish(next);
        else { setIndex(index + 1); setMascot('thinking'); }
      }, 1300);
    } else {
      combo.current = 0;
      sfx.wrong();
      setMascot('wrong');
      setStats((s) => ({ ...s, mistakes: s.mistakes + 1 }));
      later(() => setMascot('thinking'), 1400);
    }
  }, [stats, index, level.questions, onFinish]);

  return (
    <main className="relative mx-auto flex min-h-full max-w-xl flex-col items-center gap-3 px-4 pb-8 pt-4">
      <header className="flex w-full items-center gap-3">
        <button className="btn btn-ghost !min-h-[48px] !px-4" onClick={onExit} aria-label="Kembali ke peta level">←</button>
        <div className="flex-1"><ProgressBar value={started ? (mascot === 'correct' ? index + 1 : index) : 0} max={level.questions} /></div>
        <span className="text-lg font-extrabold">{Math.min(index + 1, level.questions)}/{level.questions}</span>
      </header>
      <ComboPop label={comboText.label} nonce={comboText.n} />
      <Mascot state={started ? mascot : 'idle'} hat={hat} size={120} />
      {started && <Challenge key={index} level={level} index={index} seed={seed} onAnswer={handleAnswer} />}
      {!started && (
        <Modal>
          <Mascot state="idle" hat={hat} size={110} />
          <h2 className="text-3xl font-extrabold">Level {level.id}</h2>
          <p className="mt-1 text-xl font-bold">{level.title}</p>
          <p className="my-3 text-lg">🎯 {level.goal}</p>
          <button className="btn btn-primary w-full" onClick={() => { setStarted(true); setMascot('thinking'); sfx.tap(); }}>Ayo Mulai! ⚓</button>
        </Modal>
      )}
    </main>
  );
}
