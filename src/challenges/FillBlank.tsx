import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { makeFillQuestions, makeIdFillQuestions } from '../lib/questions';
import { seeded } from '../lib/random';
import { sfx, speak } from '../lib/audio';
import type { ChallengeProps } from './types';

const HINT: Record<1 | 2 | 3, string> = {
  1: 'Pasangan yang benar: I → am/have, You/We/They → are/have',
  2: 'Untuk he, she, atau satu benda, kata kerja ditambah -s (likes, has, runs)',
  3: 'Lihat subjeknya: banyak (they, we, birds) atau satu (he, she, it, my brother)?',
};

/** Melengkapi kalimat rumpang: subject–verb (Inggris, fillTier) atau imbuhan/lawan kata/tanda baca/kapital (Indonesia, fillBank). */
export function FillBlank({ level, index, seed, onAnswer }: ChallengeProps) {
  const tier = level.params.fillTier ?? 1;
  const { fillBank, lang = 'en' } = level.params;
  const q = useMemo(() => (fillBank ? makeIdFillQuestions(seeded(seed), level.questions, fillBank) : makeFillQuestions(seeded(seed), level.questions, tier))[index], [level, index, seed, tier, fillBank]);
  const longest = Math.max(...q.options.map((o) => o.length));
  const [wrongPicks, setWrongPicks] = useState<string[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [before, after] = q.text.split('___');

  const choose = (w: string) => {
    if (locked || wrongPicks.includes(w)) return;
    setPicked(w);
    const ok = w === q.answer;
    if (ok) { setLocked(true); if (!speak(q.text.replace('___', w), lang)) sfx.tap(); } else { setWrongPicks((x) => [...x, w]); sfx.tap(); }
    onAnswer(ok);
  };

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="card flex w-full flex-col items-center gap-2 !py-4 text-center">
        <span className="text-5xl" aria-hidden>{q.emoji}</span>
        <p className="text-2xl font-extrabold leading-snug" role="img" aria-label={q.text.replace('___', 'kosong')}>
          {before}
          <motion.span key={locked ? 'f' : 'b'} initial={locked ? { scale: 0.5 } : false} animate={{ scale: 1 }}
            className={`mx-1 inline-block min-w-[4.5rem] rounded-xl border-4 px-2 ${locked ? 'border-leaf-400 bg-leaf-400/20' : 'border-dashed border-sea-400'}`}>
            {locked ? q.answer : ' '}
          </motion.span>
          {after}
        </p>
      </div>
      <p className="text-base font-bold">{q.options.every((o) => o.length <= 1) ? 'Pilih tanda baca yang tepat 👇' : 'Pilih kata yang tepat 👇'}</p>
      {wrongPicks.length >= 2 && (
        <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-sand-200 px-3 py-1 text-center text-base font-bold">
          Petunjuk: {q.hint ?? HINT[tier]}
        </motion.p>
      )}
      <div className={`grid w-full gap-2 ${longest > 12 ? 'grid-cols-1' : longest > 6 ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {q.options.map((w) => {
          const wrong = wrongPicks.includes(w);
          return (
            <motion.button key={w} onClick={() => choose(w)} disabled={wrong || locked} whileTap={{ scale: 0.95 }} data-choice=""
              animate={picked === w && wrong ? { x: [0, -10, 10, -6, 6, 0] } : {}}
              className={`btn btn-secondary !min-h-[60px] !px-1 ${longest <= 1 ? '!text-5xl' : '!text-xl'} ${wrong ? 'opacity-30' : ''} ${locked && w === q.answer ? '!bg-leaf-700' : ''}`}>{w}</motion.button>
          );
        })}
      </div>
    </div>
  );
}
