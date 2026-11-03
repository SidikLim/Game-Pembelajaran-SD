import { motion } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
import { makeShapePuzzles, SHAPES, type ShapeKind, type ShapePiece } from '../lib/questions';
import { seeded } from '../lib/random';
import { sfx } from '../lib/audio';
import type { ChallengeProps } from './types';

const NAME: Record<ShapeKind, string> = { circle: 'Lingkaran', square: 'Persegi', triangle: 'Segitiga' };

function ShapeSvg({ shape, size, fill, outline }: { shape: ShapeKind; size: number; fill?: string; outline?: boolean }) {
  const common = outline
    ? { fill: 'none', stroke: '#0E7490', strokeWidth: 4, strokeDasharray: '8 6' }
    : { fill, stroke: 'rgba(11,48,64,0.25)', strokeWidth: 3 };
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      {shape === 'circle' && <circle cx="50" cy="50" r="44" {...common} />}
      {shape === 'square' && <rect x="8" y="8" width="84" height="84" rx="8" {...common} />}
      {shape === 'triangle' && <polygon points="50,8 94,90 6,90" strokeLinejoin="round" {...common} />}
    </svg>
  );
}

/** Puzzle bentuk: seret (atau ketuk keping lalu ketuk lubang) ke siluet yang bentuknya sama. */
export function ShapePuzzle({ level, index, seed, onAnswer }: ChallengeProps) {
  const pieces = useMemo(() => makeShapePuzzles(seeded(seed), level.questions, level.params.perShape ?? 1)[index], [level, index, seed]);
  const [placed, setPlaced] = useState<Set<number>>(new Set());
  const [selected, setSelected] = useState<number | null>(null);
  const [near, setNear] = useState<ShapeKind | null>(null);
  const [wrongs, setWrongs] = useState(0);
  const [hintShape, setHintShape] = useState<ShapeKind | null>(null);
  const [shake, setShake] = useState<{ shape: ShapeKind; n: number } | null>(null);
  const zones = useRef<Partial<Record<ShapeKind, HTMLDivElement | null>>>({});

  const zoneAt = (pt: { x: number; y: number }, pad = 0): ShapeKind | null => {
    const x = pt.x - window.scrollX, y = pt.y - window.scrollY;
    for (const s of SHAPES) {
      const r = zones.current[s]?.getBoundingClientRect();
      if (r && x > r.left - pad && x < r.right + pad && y > r.top - pad && y < r.bottom + pad) return s;
    }
    return null;
  };

  const drop = (piece: ShapePiece, zone: ShapeKind) => {
    if (placed.has(piece.id)) return;
    if (piece.shape === zone) {
      const next = new Set(placed).add(piece.id);
      setPlaced(next);
      setSelected(null);
      setHintShape(null);
      sfx.pop();
      if (next.size === pieces.length) onAnswer(true);
    } else {
      setWrongs((w) => w + 1);
      setShake({ shape: zone, n: Date.now() });
      if (wrongs + 1 >= 2) setHintShape(piece.shape);
      onAnswer(false);
    }
  };

  const tray = pieces.filter((p) => !placed.has(p.id));

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <p className="text-base font-bold">Pasangkan tiap keping ke bentuk yang sama 🧩</p>
      <div className="grid w-full grid-cols-3 gap-2">
        {SHAPES.map((s) => {
          const inside = pieces.filter((p) => placed.has(p.id) && p.shape === s);
          return (
            <motion.div key={s} ref={(el) => { zones.current[s] = el; }} onClick={() => selected !== null && drop(pieces[selected], s)}
              animate={shake?.shape === s ? { x: [0, -8, 8, -5, 5, 0] } : hintShape === s || near === s ? { scale: [1, 1.06, 1] } : {}}
              transition={hintShape === s || near === s ? { repeat: Infinity, duration: 0.8 } : { duration: 0.4 }}
              className={`card flex min-h-[124px] flex-col items-center justify-between gap-1 border-4 !p-2 ${near === s || hintShape === s ? 'border-leaf-400' : 'border-transparent'}`}>
              <div className="relative grid flex-1 place-items-center">
                <ShapeSvg shape={s} size={72} outline />
                <div className="absolute inset-0 flex flex-wrap content-center justify-center gap-0.5">
                  {inside.map((p) => <ShapeSvg key={p.id} shape={s} size={Math.min(p.size, 44)} fill={p.color} />)}
                </div>
              </div>
              <span className="text-sm font-extrabold">{NAME[s]}</span>
            </motion.div>
          );
        })}
      </div>
      {wrongs >= 2 && (
        <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-sand-200 px-3 py-1 text-center text-base font-bold">
          Petunjuk: lihat tepinya — bulat, 4 sudut, atau 3 sudut. Lubang yang bergetar adalah jawabannya!
        </motion.p>
      )}
      <div className="flex min-h-[72px] flex-wrap justify-center gap-2" role="group" aria-label="Keping bentuk">
        {tray.map((p) => (
          <motion.button key={p.id} drag dragSnapToOrigin dragElastic={0.2} layout whileDrag={{ scale: 1.15, zIndex: 20, filter: 'drop-shadow(0 12px 10px rgba(11,48,64,0.35))' }}
            onDrag={(_, i) => setNear(zoneAt(i.point, 30))}
            onDragEnd={(_, i) => { setNear(null); const z = zoneAt(i.point); if (z) drop(p, z); }}
            onTap={() => setSelected(selected === p.id ? null : p.id)}
            aria-label={`Keping ${NAME[p.shape]}`} aria-pressed={selected === p.id}
            className={`touch-none rounded-2xl p-1 ${selected === p.id ? 'bg-white ring-4 ring-sea-400' : ''}`}>
            <ShapeSvg shape={p.shape} size={p.size} fill={p.color} />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
