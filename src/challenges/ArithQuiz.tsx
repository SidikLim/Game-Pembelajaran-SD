import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { makeArithQuestions } from '../lib/questions';
import { seeded } from '../lib/random';
import { sfx } from '../lib/audio';
import type { ChallengeProps } from './types';

/** Soal hitung Tingkat 3: kali/bagi, diskon toko mainan, desimal, dan soal cerita petualangan. */
export function ArithQuiz({ level, index, seed, onAnswer }: ChallengeProps) {
  const q = useMemo(() => makeArithQuestions(seeded(seed), level.questions, level.params.arith ?? 'mul', level.params.options ?? 3)[index], [level, index, seed]);
  const [wrongPicks, setWrongPicks] = useState<string[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const isStory = (level.params.arith ?? '').startsWith('story');

  const choose = (id: string) => {
    if (locked || wrongPicks.includes(id)) return;
    setPicked(id);
    sfx.tap();
    const ok = id === q.answerId;
    if (ok) setLocked(true); else setWrongPicks((w) => [...w, id]);
    onAnswer(ok);
  };

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="card flex w-full flex-col items-center gap-1 !py-3 text-center">
        <span className="text-4xl" aria-hidden>{q.emoji}</span>
        <p className={isStory ? 'text-lg font-bold leading-snug' : 'text-3xl font-extrabold'}>{q.text}</p>
        {q.sub && <p className="rounded-xl bg-sand-200 px-3 py-0.5 text-lg font-extrabold">{q.sub}</p>}
      </div>
      {wrongPicks.length >= 2 && (
        <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-sand-200 px-3 py-1 text-center text-base font-bold">
          Petunjuk: {q.hint}
        </motion.p>
      )}
      <div className={`grid w-full gap-2 ${q.options.length > 3 || q.options.some((o) => o.text.length > 7) ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {q.options.map((o) => {
          const wrong = wrongPicks.includes(o.id);
          return (
            <motion.button key={o.id} onClick={() => choose(o.id)} disabled={wrong || locked} whileTap={{ scale: 0.95 }} data-choice=""
              animate={picked === o.id && wrong ? { x: [0, -10, 10, -6, 6, 0] } : {}}
              className={`btn btn-secondary !min-h-[60px] !px-2 !text-2xl tabular-nums ${wrong ? 'opacity-30' : ''} ${locked && o.id === q.answerId ? '!bg-leaf-700' : ''}`}>{o.text}</motion.button>
          );
        })}
      </div>
    </div>
  );
}
