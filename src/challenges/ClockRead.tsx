import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { makeClockQuestions } from '../lib/questions';
import { seeded } from '../lib/random';
import { sfx } from '../lib/audio';
import type { ChallengeProps } from './types';

function Clock({ h, m, size }: { h: number; m: number; size: number }) {
  const hourAngle = (h % 12) * 30 + m * 0.5;
  const minAngle = m * 6;
  const hand = (angle: number, len: number, w: number, color: string) => (
    <line x1="50" y1="50" x2={50 + len * Math.sin((angle * Math.PI) / 180)} y2={50 - len * Math.cos((angle * Math.PI) / 180)} stroke={color} strokeWidth={w} strokeLinecap="round" />
  );
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="Jam analog">
      <circle cx="50" cy="50" r="47" fill="#fff" stroke="#0E7490" strokeWidth="4" />
      {Array.from({ length: 12 }, (_, i) => {
        const n = i + 1, a = (n * 30 * Math.PI) / 180;
        return <text key={n} x={50 + 36 * Math.sin(a)} y={50 - 36 * Math.cos(a) + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill="#0B3040">{n}</text>;
      })}
      {hand(hourAngle, 22, 5, '#0B3040')}
      {hand(minAngle, 33, 3, '#E0502F')}
      <circle cx="50" cy="50" r="3.5" fill="#0B3040" />
    </svg>
  );
}

/** Membaca jam analog: pilih penunjuk waktu digital yang sama. L17 jam pas, L18 + setengah jam. */
export function ClockRead({ level, index, seed, onAnswer }: ChallengeProps) {
  const q = useMemo(() => makeClockQuestions(seeded(seed), level.questions, level.params.halfHours ?? false)[index], [level, index, seed]);
  const [wrongPicks, setWrongPicks] = useState<string[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

  const choose = (t: string) => {
    if (locked || wrongPicks.includes(t)) return;
    setPicked(t);
    sfx.tap();
    const ok = t === q.answer;
    if (ok) setLocked(true); else setWrongPicks((w) => [...w, t]);
    onAnswer(ok);
  };

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="card !p-2"><Clock h={q.h} m={q.m} size={168} /></div>
      <p className="text-base font-bold">Jam berapa ini? ⏰</p>
      {wrongPicks.length >= 2 && (
        <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-sand-200 px-3 py-1 text-center text-base font-bold">
          Petunjuk: jarum pendek menunjuk jam, jarum merah panjang menunjuk menit ({level.params.halfHours ? '12 = :00, 6 = :30' : 'angka 12 = tepat'})
        </motion.p>
      )}
      <div className="flex gap-2">
        {q.options.map((t) => {
          const wrong = wrongPicks.includes(t);
          return (
            <motion.button key={t} onClick={() => choose(t)} disabled={wrong || locked} whileTap={{ scale: 0.93 }} data-choice=""
              animate={picked === t && wrong ? { x: [0, -10, 10, -6, 6, 0] } : {}}
              className={`btn btn-secondary !min-h-[64px] !px-4 !text-3xl tabular-nums ${wrong ? 'opacity-30' : ''} ${locked && t === q.answer ? '!bg-leaf-700' : ''}`}>{t}</motion.button>
          );
        })}
      </div>
    </div>
  );
}
