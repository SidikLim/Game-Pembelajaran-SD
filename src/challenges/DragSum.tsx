import { motion } from 'framer-motion';
import { useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { makeSumQuestions } from '../lib/questions';
import { seeded } from '../lib/random';
import { sfx } from '../lib/audio';
import type { ChallengeProps } from './types';

const PILE = 10;

/** Penjumlahan visual: seret (atau ketuk) buah ke keranjang sampai jumlahnya sama dengan hasil. */
export function DragSum({ level, index, seed, onAnswer }: ChallengeProps) {
  const q = useMemo(() => makeSumQuestions(seeded(seed), level.questions, level.params.maxSum ?? 10)[index], [level, index, seed]);
  const [inBasket, setInBasket] = useState<Set<number>>(new Set());
  const [near, setNear] = useState(false);
  const [wrongs, setWrongs] = useState(0);
  const [locked, setLocked] = useState(false);
  const [shake, setShake] = useState(0);
  const basketRef = useRef<HTMLDivElement>(null);

  const over = (pt: { x: number; y: number }, pad = 0) => {
    const r = basketRef.current?.getBoundingClientRect();
    if (!r) return false;
    const x = pt.x - window.scrollX, y = pt.y - window.scrollY;
    return x > r.left - pad && x < r.right + pad && y > r.top - pad && y < r.bottom + pad;
  };
  const toggle = (id: number, to?: boolean) => {
    if (locked) return;
    setInBasket((prev) => {
      const n = new Set(prev);
      const put = to ?? !n.has(id);
      if (put) n.add(id); else n.delete(id);
      return n;
    });
    sfx.pop();
  };
  const key = (id: number) => (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(id); } };

  const check = () => {
    if (locked) return;
    const ok = inBasket.size === q.answer;
    if (ok) setLocked(true);
    else { setWrongs((w) => w + 1); setShake((s) => s + 1); }
    onAnswer(ok);
  };

  const fruit = (id: number) => (
    <motion.button key={id} layout drag={!locked} dragSnapToOrigin dragElastic={0.2} whileDrag={{ scale: 1.1, zIndex: 20, boxShadow: '0 14px 20px rgba(11,48,64,0.35)' }}
      onDrag={(_, i) => setNear(over(i.point, 40))} onDragEnd={(_, i) => { setNear(false); if (over(i.point)) toggle(id, true); else if (inBasket.has(id)) toggle(id, false); }}
      onTap={() => toggle(id)} onKeyDown={key(id)} aria-label={inBasket.has(id) ? 'Keluarkan buah dari keranjang' : 'Masukkan buah ke keranjang'}
      className="grid h-14 w-14 place-items-center rounded-full bg-white text-3xl shadow-md touch-none">🍎</motion.button>
  );

  const pile = Array.from({ length: PILE }, (_, i) => i).filter((i) => !inBasket.has(i));
  const basket = [...inBasket];

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="card flex flex-wrap items-center justify-center gap-3 !py-2 text-4xl font-extrabold">
        <span role="img" aria-label={`${q.a} ditambah ${q.b}`}>{q.a} + {q.b} = ?</span>
      </div>
      <p className="text-base font-bold">Masukkan hasilnya ke keranjang 🧺</p>
      {wrongs >= 2 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-sand-200 px-3 py-1 text-center text-base font-bold">
          Petunjuk: hitung semuanya — {'🍎'.repeat(q.a)} + {'🍎'.repeat(q.b)}
        </motion.div>
      )}
      <div className="flex min-h-[56px] flex-wrap justify-center gap-1.5" role="group" aria-label="Tumpukan buah">{pile.map(fruit)}</div>
      <motion.div ref={basketRef} key={shake} animate={shake ? { x: [0, -10, 10, -6, 6, 0] } : {}} transition={{ duration: 0.4 }}
        className={`flex min-h-[96px] w-full max-w-md flex-wrap content-start justify-center gap-1.5 rounded-3xl border-4 border-dashed p-2 ${near ? 'border-leaf-600 bg-leaf-400/30' : 'border-sand-400 bg-sand-50'}`}
        {...(near ? {} : {})}>
        <motion.div className="w-full text-center text-sm font-bold text-sea-800" animate={near ? { scale: [1, 1.08, 1] } : {}} transition={{ repeat: Infinity, duration: 0.7 }}>
          🧺 Keranjang: {inBasket.size}
        </motion.div>
        {basket.map(fruit)}
      </motion.div>
      <button className="btn btn-primary" onClick={check} disabled={locked || inBasket.size === 0}>Periksa ✔</button>
    </div>
  );
}
