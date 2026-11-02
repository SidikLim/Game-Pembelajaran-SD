import { motion } from 'framer-motion';
import { useMemo } from 'react';

const COLORS = ['#F6C453', '#FF7A59', '#4CC38A', '#26C6DA', '#6D4AC9'];

/** Ledakan confetti ringan (CSS/Framer, tanpa aset). Disembunyikan bila reduced-motion. */
export function Confetti({ count = 36 }: { count?: number }) {
  const pieces = useMemo(() => Array.from({ length: count }, (_, i) => ({
    id: i, x: (Math.random() - 0.5) * 340, y: -(120 + Math.random() * 200), r: Math.random() * 720 - 360,
    color: COLORS[i % COLORS.length], delay: Math.random() * 0.2,
  })), [count]);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/3 flex justify-center motion-reduce:hidden">
      {pieces.map((p) => (
        <motion.span key={p.id} className="absolute h-3 w-2 rounded-sm" style={{ background: p.color }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: [0, p.y, p.y + 420], opacity: [1, 1, 0], rotate: p.r }}
          transition={{ duration: 1.8, delay: p.delay, ease: 'easeOut' }} />
      ))}
    </div>
  );
}
