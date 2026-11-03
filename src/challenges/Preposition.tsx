import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { makePrepQuestions, type Prep } from '../lib/questions';
import { seeded } from '../lib/random';
import { sfx, speak } from '../lib/audio';
import type { ChallengeProps } from './types';

const BOX = '#C98B4B', BOX_DARK = '#A8702F';

/** Adegan kecil 160x120: benda berada in / on / under / behind sebuah kotak (atau meja untuk "under"). */
function Scene({ prep, emoji }: { prep: Prep; emoji: string }) {
  const obj = (style: React.CSSProperties, z: number) => <span className="absolute text-5xl leading-none" style={{ ...style, zIndex: z }} aria-hidden>{emoji}</span>;
  return (
    <div className="relative h-[120px] w-[170px]" role="img" aria-label="Gambar posisi benda">
      <div className="absolute bottom-0 left-0 right-0 h-2 rounded-full bg-sea-100" />
      {prep === 'under' ? (
        <>
          {obj({ bottom: 6, left: 62 }, 1)}
          <div className="absolute left-4 right-4 h-4 rounded-lg" style={{ bottom: 66, background: BOX_DARK, zIndex: 2 }} />
          <div className="absolute w-3" style={{ bottom: 4, left: 24, height: 64, background: BOX, zIndex: 2 }} />
          <div className="absolute w-3" style={{ bottom: 4, right: 24, height: 64, background: BOX, zIndex: 2 }} />
        </>
      ) : prep === 'in' ? (
        <>
          <div className="absolute rounded-md" style={{ left: 30, bottom: 4, width: 110, height: 64, background: BOX_DARK, zIndex: 1 }} />
          {obj({ left: 62, bottom: 22 }, 2)}
          <div className="absolute rounded-b-md" style={{ left: 30, bottom: 4, width: 110, height: 38, background: BOX, zIndex: 3 }} />
        </>
      ) : prep === 'on' ? (
        <>
          <div className="absolute rounded-md" style={{ left: 30, bottom: 4, width: 110, height: 52, background: BOX, zIndex: 1 }} />
          {obj({ left: 62, bottom: 52 }, 2)}
        </>
      ) : (
        <>
          {obj({ left: 96, bottom: 4 }, 1)}
          <div className="absolute rounded-md" style={{ left: 14, bottom: 4, width: 100, height: 76, background: BOX, zIndex: 2 }} />
        </>
      )}
    </div>
  );
}

/** Prepositions: lihat posisi benda lalu pilih kata depan. L26 berbentuk melengkapi kalimat. */
export function Preposition({ level, index, seed, onAnswer }: ChallengeProps) {
  const { preps = ['in', 'on', 'under'], options = 3, sentenceMode = false } = level.params;
  const q = useMemo(() => makePrepQuestions(seeded(seed), level.questions, preps, options)[index], [level, index, seed, preps, options]);
  const [wrongPicks, setWrongPicks] = useState<Prep[]>([]);
  const [picked, setPicked] = useState<Prep | null>(null);
  const [locked, setLocked] = useState(false);
  const base = q.prep === 'under' ? 'the table' : 'the box';
  const full = `The ${q.obj.name} is ${q.prep} ${base}.`;

  const choose = (p: Prep) => {
    if (locked || wrongPicks.includes(p)) return;
    setPicked(p);
    const ok = p === q.prep;
    if (ok) { setLocked(true); if (!speak(full)) sfx.tap(); } else { setWrongPicks((w) => [...w, p]); sfx.tap(); }
    onAnswer(ok);
  };

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="card flex flex-col items-center gap-1 !py-2">
        <Scene prep={q.prep} emoji={q.obj.emoji} />
        <p className="text-xl font-extrabold" aria-live="polite">
          {sentenceMode
            ? <>The {q.obj.name} is <span className={`rounded-lg border-4 px-2 ${locked ? 'border-leaf-400 bg-leaf-400/20' : 'border-dashed border-sea-400'}`}>{locked ? q.prep.toUpperCase() : '    '}</span> {base}.</>
            : `Where is the ${q.obj.name}?`}
        </p>
      </div>
      {wrongPicks.length >= 2 && (
        <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-sand-200 px-3 py-1 text-center text-base font-bold">
          Petunjuk: in = di dalam, on = di atas, under = di bawah, behind = di belakang
        </motion.p>
      )}
      <div className="grid w-full grid-cols-2 gap-2">
        {q.options.map((p) => {
          const wrong = wrongPicks.includes(p);
          return (
            <motion.button key={p} onClick={() => choose(p)} disabled={wrong || locked} whileTap={{ scale: 0.95 }} data-choice=""
              animate={picked === p && wrong ? { x: [0, -10, 10, -6, 6, 0] } : {}}
              className={`btn btn-secondary !min-h-[56px] !text-2xl ${wrong ? 'opacity-30' : ''} ${locked && p === q.prep ? '!bg-leaf-700' : ''}`}>{p.toUpperCase()}</motion.button>
          );
        })}
      </div>
    </div>
  );
}
