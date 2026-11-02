import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Confetti } from '../components/Confetti';
import { Mascot } from '../components/Mascot';
import { sfx } from '../lib/audio';
import type { HatColor } from '../lib/types';

interface Props { stars: 1 | 2 | 3; score: number; hat: HatColor; hasNext: boolean; onNext: () => void; onRetry: () => void; onMap: () => void }

/** Layar kemenangan: piala, lalu bintang muncul berurutan (staggered) + confetti. */
export function Victory({ stars, score, hat, hasNext, onNext, onRetry, onMap }: Props) {
  useEffect(() => {
    sfx.win();
    const ts = Array.from({ length: stars }, (_, i) => window.setTimeout(() => sfx.star(i), 600 + i * 450));
    return () => ts.forEach(clearTimeout);
  }, [stars]);
  return (
    <main className="relative mx-auto flex min-h-full max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <Confetti />
      <motion.div className="text-7xl" initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 8 }}>🏆</motion.div>
      <h1 className="text-4xl font-extrabold">Level Selesai!</h1>
      <div className="flex gap-2 text-6xl">
        {[1, 2, 3].map((i) => (
          <motion.span key={i} initial={{ scale: 0, rotate: -90, opacity: 0 }}
            animate={i <= stars ? { scale: 1, rotate: 0, opacity: 1 } : { scale: 1, opacity: 0.2 }}
            transition={{ delay: 0.6 + (i - 1) * 0.45, type: 'spring', damping: 9 }} aria-hidden>⭐</motion.span>
        ))}
        <span className="sr-only">{stars} dari 3 bintang</span>
      </div>
      <Mascot state="correct" hat={hat} size={130} />
      <p className="text-2xl font-extrabold">Skor: {score}</p>
      <div className="flex w-full flex-col gap-3">
        {hasNext && <button className="btn btn-primary" onClick={onNext}>Lanjut Level ▶</button>}
        <button className="btn btn-secondary" onClick={onRetry}>Ulangi 🔁</button>
        <button className="btn btn-ghost" onClick={onMap}>Peta Level 🗺️</button>
      </div>
    </main>
  );
}
