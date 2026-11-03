import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function ProgressBar({ value, max }: { value: number; max: number }) {
  return (
    <div className="h-5 w-full overflow-hidden rounded-full bg-white/70 shadow-inner" role="progressbar" aria-label="Kemajuan level" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}>
      <motion.div className="h-full rounded-full bg-leaf-400" initial={false}
        animate={{ width: `${(value / max) * 100}%` }} transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] /* ease-out-cubic */ }} />
    </div>
  );
}

/** Teks combo "pop-in scale" dengan rotasi acak, sesuai spesifikasi 2.2. */
export function ComboPop({ label, nonce }: { label: string | null; nonce: number }) {
  return (
    <AnimatePresence>
      {label && (
        <motion.div key={nonce} aria-live="polite" className="pointer-events-none absolute left-1/2 top-24 z-30 -translate-x-1/2 whitespace-nowrap text-5xl font-extrabold text-coral-600 drop-shadow-[0_3px_0_#fff]"
          initial={{ scale: 0, rotate: (nonce % 2 ? -1 : 1) * (8 + (nonce % 7)) }} animate={{ scale: [0, 1.3, 1] }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.45 }}>
          {label}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Modal({ children, label }: { children: ReactNode; label: string }) {
  return (
    <motion.div className="fixed inset-0 z-40 flex items-center justify-center bg-sea-900/50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div role="dialog" aria-modal aria-label={label} className="card w-full max-w-md text-center" initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', damping: 14 }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

export function Stars({ count, size = 'text-4xl' }: { count: number; size?: string }) {
  return (
    <span className={size} role="img" aria-label={`${count} dari 3 bintang`}>
      {[1, 2, 3].map((i) => <span key={i} className={i <= count ? '' : 'opacity-25 grayscale'}>⭐</span>)}
    </span>
  );
}
