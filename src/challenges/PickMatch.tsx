import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { makePickQuestions, type PickOption } from '../lib/questions';
import { seeded } from '../lib/random';
import { sfx, speak } from '../lib/audio';
import type { ChallengeProps } from './types';

function OptionFace({ o }: { o: PickOption }) {
  if (o.text) return <span className="text-5xl font-extrabold">{o.text}</span>;
  if (o.color) return <span className="block h-14 w-14 rounded-full border-4 border-white shadow-md" style={{ background: o.color }} />;
  if (o.count) return <span aria-hidden className="flex max-w-[9rem] flex-wrap justify-center text-2xl">{Array.from({ length: o.count }, (_, k) => <span key={k}>{o.emoji}</span>)}</span>;
  return <span aria-hidden className="text-5xl">{o.emoji}</span>;
}

/** Cocokkan: dengar bunyi huruf / baca kata Inggris, lalu pilih huruf atau gambar yang tepat. */
export function PickMatch({ level, index, seed, onAnswer }: ChallengeProps) {
  const { pool = 'letters', options = 3, letterCount = 26, letterSet, lang = 'en' } = level.params;
  const q = useMemo(() => makePickQuestions(seeded(seed), level.questions, pool, options, letterCount, letterSet)[index], [level, index, seed, pool, options, letterCount, letterSet]);
  const [wrongPicks, setWrongPicks] = useState<string[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [wave, setWave] = useState(0);

  const say = (text: string) => { setWave((w) => w + 1); if (!speak(text, lang)) sfx.tap(); };

  const choose = (o: PickOption) => {
    if (locked || wrongPicks.includes(o.id)) return;
    setPicked(o.id);
    say(o.speak); // menyentuh gambar/huruf memperdengarkan namanya
    const ok = o.id === q.answerId;
    if (ok) setLocked(true);
    else setWrongPicks((w) => [...w, o.id]);
    onAnswer(ok);
  };

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="card flex flex-col items-center gap-2 !py-3">
        {q.promptText && <span className={`${q.promptText.length > 16 ? 'text-2xl leading-snug' : q.promptText.length > 8 ? 'text-3xl' : q.promptText.length > 6 ? 'text-4xl' : 'text-5xl'} font-extrabold tracking-wide`} role="img" aria-label={`Kata ${q.promptText}`}>{q.promptText}</span>}
        <button className="btn btn-secondary relative" onClick={() => say(q.speak)}>
          <span aria-hidden>🔊</span> Dengar
          {wave > 0 && [0, 1].map((r) => (
            <motion.span key={`${wave}-${r}`} aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl border-4 border-sea-400"
              initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 1.6 + r * 0.3, opacity: 0 }} transition={{ duration: 0.8, delay: r * 0.15 }} />
          ))}
        </button>
      </div>
      <p className="text-base font-bold">{q.instruction}</p>
      {wrongPicks.length >= 2 && (
        <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-sand-200 px-3 py-1 text-center text-base font-bold">
          Petunjuk: {q.hint}
        </motion.p>
      )}
      <div className="grid w-full grid-cols-2 gap-2">
        {q.options.map((o, i) => {
          const wrong = wrongPicks.includes(o.id);
          const right = locked && o.id === q.answerId;
          return (
            <motion.button key={o.id} onClick={() => choose(o)} disabled={wrong || locked} whileTap={{ scale: 0.95 }}
              animate={picked === o.id && wrong ? { x: [0, -10, 10, -6, 6, 0] } : right ? { scale: [1, 1.08, 1] } : {}}
              aria-label={o.text ? undefined : `Pilihan ${i + 1}`} data-choice=""
              className={`card grid min-h-[88px] place-items-center border-4 !p-2 ${right ? 'border-leaf-400' : 'border-transparent'} ${wrong ? 'opacity-30' : ''}`}>
              <OptionFace o={o} />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
