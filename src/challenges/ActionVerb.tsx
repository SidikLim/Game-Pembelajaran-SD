import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { makeVerbQuestions, type Verb } from '../lib/questions';
import { seeded } from '../lib/random';
import { sfx, speak } from '../lib/audio';
import type { ChallengeProps } from './types';

const loop = { repeat: Infinity, ease: 'easeInOut' as const };

/** Karakter kecil yang bergerak sesuai kata kerja. Emoji-nya sendiri sudah menjelaskan aksi (aman bila animasi dimatikan). */
function VerbAnim({ verb, size }: { verb: Verb; size: number }) {
  const f = { fontSize: size };
  switch (verb) {
    case 'run': return <motion.div style={f} animate={{ x: [-size / 3, size / 3, -size / 3] }} transition={{ ...loop, duration: 1.4 }}>🏃</motion.div>;
    case 'jump': return <motion.div style={f} animate={{ y: [0, -size / 2, 0] }} transition={{ ...loop, duration: 0.9 }}>🤸</motion.div>;
    case 'sleep': return (
      <div className="relative" style={f}>🛌
        <motion.span className="absolute -top-1 right-0 font-extrabold text-sea-600" style={{ fontSize: size / 2.5 }} animate={{ y: [0, -size / 3], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>Z</motion.span>
      </div>);
    case 'eat': return (
      <div className="flex items-center" style={f}>😋
        <motion.span style={{ fontSize: size / 1.6 }} animate={{ x: [size / 2, 0], scale: [1, 0.2], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1.2 }}>🍎</motion.span>
      </div>);
    case 'swim': return <motion.div style={f} animate={{ x: [-size / 4, size / 4, -size / 4], y: [0, -4, 0] }} transition={{ ...loop, duration: 1.8 }}>🏊</motion.div>;
    case 'dance': return <motion.div style={f} animate={{ rotate: [-14, 14, -14], y: [0, -6, 0] }} transition={{ ...loop, duration: 0.8 }}>💃</motion.div>;
    case 'read': return <motion.div style={f} animate={{ scale: [1, 1.1, 1] }} transition={{ ...loop, duration: 1.6 }}>📖</motion.div>;
    case 'sing': return (
      <div className="relative" style={f}>🎤
        <motion.span className="absolute -top-1 -right-3" style={{ fontSize: size / 2.2 }} animate={{ y: [0, -size / 3], x: [0, size / 6], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}>🎵</motion.span>
      </div>);
  }
}

const label = (v: Verb) => v.toUpperCase();

/** Action Verbs. L17: lihat gerakan -> pilih kata. L18: baca kata -> pilih gerakan. */
export function ActionVerb({ level, index, seed, onAnswer }: ChallengeProps) {
  const mode = level.params.verbMode ?? 'see';
  const q = useMemo(() => makeVerbQuestions(seeded(seed), level.questions, level.params.options ?? 3)[index], [level, index, seed]);
  const [wrongPicks, setWrongPicks] = useState<Verb[]>([]);
  const [picked, setPicked] = useState<Verb | null>(null);
  const [locked, setLocked] = useState(false);

  const say = (t: string) => { if (!speak(t)) sfx.tap(); };
  const choose = (v: Verb) => {
    if (locked || wrongPicks.includes(v)) return;
    setPicked(v);
    say(v);
    const ok = v === q.verb;
    if (ok) setLocked(true); else setWrongPicks((w) => [...w, v]);
    onAnswer(ok);
  };

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="card flex min-h-[120px] w-full flex-col items-center justify-center gap-2 !py-3">
        {mode === 'see'
          ? <VerbAnim verb={q.verb} size={72} />
          : <span className="text-5xl font-extrabold tracking-wide" aria-label={`Kata ${q.verb}`}>{label(q.verb)}</span>}
        <button className="btn btn-secondary !min-h-[48px] !px-4 !text-base" onClick={() => say(q.verb)} aria-label="Dengarkan">🔊 Dengar</button>
      </div>
      <p className="text-base font-bold">{mode === 'see' ? 'Apa yang sedang dilakukan? Pilih katanya 👇' : 'Pilih gerakan yang cocok 👇'}</p>
      {wrongPicks.length >= 2 && (
        <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-sand-200 px-3 py-1 text-center text-base font-bold">
          Petunjuk: jawabannya {mode === 'see' ? label(q.verb) : 'gerakan yang berulang di bawah'} 😉
        </motion.p>
      )}
      <div className={`grid w-full gap-2 ${mode === 'see' ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {q.options.map((v, i) => {
          const wrong = wrongPicks.includes(v);
          const right = locked && v === q.verb;
          return (
            <motion.button key={v} onClick={() => choose(v)} disabled={wrong || locked} whileTap={{ scale: 0.96 }} aria-label={`Pilihan ${i + 1}`}
              animate={picked === v && wrong ? { x: [0, -10, 10, -6, 6, 0] } : right ? { scale: [1, 1.06, 1] } : {}}
              className={`card grid min-h-[72px] place-items-center border-4 !p-2 ${right ? 'border-leaf-400' : 'border-transparent'} ${wrong ? 'opacity-30' : ''}`}>
              {mode === 'see' ? <span className="text-3xl font-extrabold">{label(v)}</span> : <VerbAnim verb={v} size={44} />}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
