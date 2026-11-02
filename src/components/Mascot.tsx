import { motion, type TargetAndTransition } from 'framer-motion';
import type { HatColor, MascotState } from '../lib/types';

const HAT: Record<HatColor, string> = { teal: '#164E63', coral: '#E0502F', gold: '#D99A1E', violet: '#6D4AC9' };

/** Maskot "Kapten Kaka" (kakatua bajak laut orisinal). Tiap state punya animasi sendiri. */
const BODY: Record<MascotState, TargetAndTransition> = {
  idle: { y: [0, -4, 0], transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } },
  thinking: { rotate: [-3, 3, -3], transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' } },
  correct: { y: [0, -34, 0, -20, 0], rotate: [0, -8, 8, -4, 0], transition: { duration: 0.9, ease: 'easeOut' } },
  wrong: { rotate: [0, -6, 0], y: [0, 3, 0], transition: { duration: 1.2, ease: 'easeInOut' } },
};

export function Mascot({ state, hat = 'teal', size = 140 }: { state: MascotState; hat?: HatColor; size?: number }) {
  const happy = state === 'correct';
  const sad = state === 'wrong';
  return (
    <div style={{ width: size, height: size }} className="relative select-none" role="img" aria-label={`Kapten Kaka, ${state}`}>
      <motion.svg key={state} viewBox="0 0 200 200" width={size} height={size} animate={BODY[state]} style={{ originX: 0.5, originY: 0.9 }}>
        {/* sayap kiri melambai saat idle/correct */}
        <motion.ellipse cx="42" cy="125" rx="20" ry="36" fill="#1F9D63"
          animate={state === 'idle' ? { rotate: [0, 14, 0] } : happy ? { rotate: [0, -50, 0, -50, 0] } : { rotate: 0 }}
          transition={{ duration: state === 'idle' ? 3 : 0.8, repeat: state === 'idle' ? Infinity : 0 }}
          style={{ originX: '50%', originY: '10%' }} />
        <ellipse cx="158" cy="125" rx="20" ry="36" fill="#1F9D63" />
        <ellipse cx="100" cy="125" rx="58" ry="62" fill="#4CC38A" />
        <ellipse cx="100" cy="142" rx="36" ry="42" fill="#FDE9B0" />
        {/* topi bajak laut */}
        <path d="M44 72 Q100 -6 156 72 Z" fill={HAT[hat]} />
        <rect x="38" y="66" width="124" height="14" rx="7" fill="#F6C453" />
        <circle cx="100" cy="42" r="8" fill="#fff" opacity="0.9" />
        {/* wajah */}
        <circle cx="76" cy="98" r="15" fill="#fff" />
        <circle cx="124" cy="98" r="15" fill="#fff" />
        {happy ? (
          <>
            <path d="M66 100 Q76 88 86 100" stroke="#0B3040" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M114 100 Q124 88 134 100" stroke="#0B3040" strokeWidth="5" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <motion.circle cx={state === 'thinking' ? 80 : 77} cy={state === 'thinking' ? 92 : sad ? 102 : 99} r="7" fill="#0B3040"
              animate={state === 'idle' ? { scaleY: [1, 1, 0.1, 1, 1] } : {}} transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.93, 0.96, 1] }} />
            <motion.circle cx={state === 'thinking' ? 128 : 123} cy={state === 'thinking' ? 92 : sad ? 102 : 99} r="7" fill="#0B3040"
              animate={state === 'idle' ? { scaleY: [1, 1, 0.1, 1, 1] } : {}} transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.93, 0.96, 1] }} />
          </>
        )}
        {sad && <path d="M60 84 L88 90 M140 84 L112 90" stroke="#0B3040" strokeWidth="4" strokeLinecap="round" />}
        {/* paruh */}
        <path d="M86 112 L114 112 L100 136 Z" fill="#FF7A59" />
        {happy && <path d="M88 118 Q100 130 112 118" fill="#C2371A" />}
        {/* pipi merona */}
        <circle cx="62" cy="116" r="7" fill="#FF7A59" opacity="0.35" />
        <circle cx="138" cy="116" r="7" fill="#FF7A59" opacity="0.35" />
      </motion.svg>
      {state === 'thinking' && (
        <motion.div className="absolute -top-2 right-0 rounded-full bg-white px-2 text-2xl shadow" animate={{ scale: [0.9, 1.1, 0.9] }} transition={{ duration: 1.6, repeat: Infinity }}>💡</motion.div>
      )}
      {happy && ['⭐', '✨', '⭐'].map((s, i) => (
        <motion.span key={i} className="absolute text-2xl" style={{ left: `${10 + i * 38}%`, top: 0 }}
          initial={{ opacity: 0, y: 10, scale: 0.4 }} animate={{ opacity: [0, 1, 0], y: -30, scale: 1.2 }} transition={{ duration: 1, delay: i * 0.12 }}>{s}</motion.span>
      ))}
    </div>
  );
}
