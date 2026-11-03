import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { makeStoryQuestions } from '../lib/questions';
import { seeded } from '../lib/random';
import { sfx, speak } from '../lib/audio';
import type { ChallengeProps } from './types';

/** Cerita pendek bergambar + satu pertanyaan pemahaman. Cerita bisa dibaca pelan atau didengarkan. */
export function StoryQuiz({ level, index, seed, onAnswer }: ChallengeProps) {
  const q = useMemo(() => makeStoryQuestions(seeded(seed), level.questions, level.params.storyLevel ?? 1)[index], [level, index, seed]);
  const [wrongPicks, setWrongPicks] = useState<string[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [wave, setWave] = useState(0);

  const say = (t: string) => { setWave((w) => w + 1); if (!speak(t)) sfx.tap(); };
  const choose = (a: string) => {
    if (locked || wrongPicks.includes(a)) return;
    setPicked(a);
    const ok = a === q.answer;
    if (ok) setLocked(true); else { setWrongPicks((w) => [...w, a]); sfx.tap(); }
    onAnswer(ok);
  };

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="card flex w-full flex-col items-center gap-1 !p-3 text-center">
        <span className="text-3xl" aria-hidden>{q.emoji}</span>
        <p className={`${q.story.length > 110 ? 'text-sm' : 'text-base'} font-bold leading-snug`} lang="en">{q.story}</p>
        <button className="btn btn-secondary relative !min-h-[40px] !px-3 !text-sm" onClick={() => say(q.story)} aria-label="Dengarkan cerita">
          🔊 Dengar cerita
          {wave > 0 && [0, 1].map((r) => (
            <motion.span key={`${wave}-${r}`} aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl border-4 border-sea-400"
              initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 1.5 + r * 0.25, opacity: 0 }} transition={{ duration: 0.8, delay: r * 0.15 }} />
          ))}
        </button>
      </div>
      <p className="text-base font-extrabold" lang="en">{q.question}</p>
      {wrongPicks.length >= 2 && (
        <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-sand-200 px-3 py-1 text-center text-sm font-bold">
          Petunjuk: baca ceritanya pelan-pelan lagi, jawabannya ada di dalam cerita 📖
        </motion.p>
      )}
      <div className="flex w-full flex-col gap-1.5">
        {q.options.map((a, i) => {
          const wrong = wrongPicks.includes(a);
          return (
            <motion.button key={a} onClick={() => choose(a)} disabled={wrong || locked} whileTap={{ scale: 0.97 }} aria-label={`Pilihan ${i + 1}`}
              animate={picked === a && wrong ? { x: [0, -10, 10, -6, 6, 0] } : {}}
              className={`btn btn-secondary !min-h-[48px] !text-base ${wrong ? 'opacity-30' : ''} ${locked && a === q.answer ? '!bg-leaf-600' : ''}`}>{a}</motion.button>
          );
        })}
      </div>
    </div>
  );
}
