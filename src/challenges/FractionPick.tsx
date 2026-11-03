import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { makeFractionQuestions } from '../lib/questions';
import { seeded } from '../lib/random';
import { sfx } from '../lib/audio';
import type { ChallengeProps } from './types';

function Pizza({ slices, colored, size }: { slices: number; colored: boolean[]; size: number }) {
  const R = 46, C = 50;
  const pt = (deg: number) => [C + R * Math.cos((deg * Math.PI) / 180), C + R * Math.sin((deg * Math.PI) / 180)];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="Pizza dibagi sama besar">
      {Array.from({ length: slices }, (_, i) => {
        const a0 = -90 + (i * 360) / slices, a1 = a0 + 360 / slices;
        const [x0, y0] = pt(a0), [x1, y1] = pt(a1);
        return <path key={i} d={`M${C},${C} L${x0},${y0} A${R},${R} 0 0 1 ${x1},${y1} Z`} fill={colored[i] ? '#F6A623' : '#FFF3D6'} stroke="#8A5A1F" strokeWidth="2.5" strokeLinejoin="round" />;
      })}
      {colored.map((on, i) => {
        if (!on) return null;
        const mid = -90 + ((i + 0.5) * 360) / slices;
        return <circle key={i} cx={C + 26 * Math.cos((mid * Math.PI) / 180)} cy={C + 26 * Math.sin((mid * Math.PI) / 180)} r="4" fill="#C2371A" />;
      })}
    </svg>
  );
}

function Frac({ num, den }: { num: number; den: number }) {
  return (
    <span className="inline-flex flex-col items-center text-4xl font-extrabold leading-none" aria-label={`${num} per ${den}`}>
      <span>{num}</span><span className="my-1 h-1 w-9 rounded bg-current" /><span>{den}</span>
    </span>
  );
}

/** Pecahan dasar: pilih pecahan yang menyatakan bagian pizza yang berwarna. */
export function FractionPick({ level, index, seed, onAnswer }: ChallengeProps) {
  const q = useMemo(() => makeFractionQuestions(seeded(seed), level.questions, level.params.fractionLevel ?? 1)[index], [level, index, seed]);
  const [wrongPicks, setWrongPicks] = useState<string[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const coloredCount = q.colored.filter(Boolean).length;

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
      <div className="card !p-3"><Pizza slices={q.slices} colored={q.colored} size={150} /></div>
      <p className="text-base font-bold">Berapa bagian pizza yang berwarna oranye? 🍕</p>
      {wrongPicks.length >= 2 && (
        <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-sand-200 px-3 py-1 text-center text-base font-bold">
          Petunjuk: ada {coloredCount} potong berwarna dari {q.slices} potong sama besar. Bisakah disederhanakan?
        </motion.p>
      )}
      <div className="flex gap-3">
        {q.options.map((o, i) => {
          const wrong = wrongPicks.includes(o.id);
          return (
            <motion.button key={o.id} onClick={() => choose(o.id)} disabled={wrong || locked} whileTap={{ scale: 0.93 }} aria-label={`Pilihan ${i + 1}`}
              animate={picked === o.id && wrong ? { x: [0, -10, 10, -6, 6, 0] } : {}}
              className={`card grid min-h-[84px] min-w-[84px] place-items-center border-4 !p-3 ${locked && o.id === q.answerId ? 'border-leaf-400' : 'border-transparent'} ${wrong ? 'opacity-30' : ''}`}>
              <Frac num={o.num} den={o.den} />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
