import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mascot } from '../components/Mascot';
import { LEVELS, SUBJECT_LABEL } from '../data/levels';
import { isPlayable, isUnlocked, progressKey, totalStars } from '../lib/progress';
import type { HatColor, Profile, Subject } from '../lib/types';
import { Stars } from '../components/ui';

const HATS: HatColor[] = ['teal', 'coral', 'gold', 'violet'];
const HAT_NAME: Record<HatColor, string> = { teal: 'Biru Laut', coral: 'Merah Karang', gold: 'Emas', violet: 'Ungu' };

export function ProfileScreen({ profiles, onPick, onCreate }: { profiles: Profile[]; onPick: (id: string) => void; onCreate: (name: string, hat: HatColor) => void }) {
  const [name, setName] = useState('');
  const [hat, setHat] = useState<HatColor>('teal');
  // Papan rekor lokal: beberapa profil dalam satu perangkat, diurutkan dari bintang terbanyak.
  const ranked = [...profiles].sort((a, b) => totalStars(b) - totalStars(a));
  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col items-center gap-4 px-4 py-6">
      <h1 className="text-center text-4xl font-extrabold">EduGame Kidz</h1>
      <Mascot state="idle" hat={hat} size={150} />
      {ranked.length > 0 && (
        <section className="card w-full" aria-label="Pilih pemain">
          <h2 className="mb-2 text-xl font-extrabold">Siapa yang main? 🏴‍☠️</h2>
          <ul className="flex flex-col gap-2">
            {ranked.map((p, i) => (
              <li key={p.id}><button className="btn btn-ghost w-full justify-between" onClick={() => onPick(p.id)}>
                <span>{i === 0 && ranked.length > 1 ? '👑 ' : ''}{p.name}</span><span>⭐ {totalStars(p)}</span>
              </button></li>
            ))}
          </ul>
        </section>
      )}
      <section className="card w-full">
        <h2 className="mb-2 text-xl font-extrabold">Pemain baru</h2>
        <label className="mb-1 block font-bold" htmlFor="nick">Nama panggilan</label>
        <input id="nick" value={name} maxLength={12} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Budi"
          className="mb-3 min-h-[56px] w-full rounded-2xl border-4 border-sea-100 px-4 text-xl font-bold focus:border-sea-400 focus:outline-none" />
        <p className="mb-1 font-bold">Warna topi Kapten Kaka</p>
        <div className="mb-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Warna topi">
          {HATS.map((h) => (
            <button key={h} role="radio" aria-checked={hat === h} onClick={() => setHat(h)}
              className={`btn !min-h-[48px] !px-4 !text-base ${hat === h ? 'btn-secondary' : 'btn-ghost'}`}>{HAT_NAME[h]}</button>
          ))}
        </div>
        <button className="btn btn-primary w-full" disabled={!name.trim()} onClick={() => onCreate(name.trim(), hat)}>Mulai Petualangan ⚓</button>
        <p className="mt-2 text-sm opacity-70">Cukup nama panggilan — tanpa data pribadi. Semua tersimpan di perangkat ini.</p>
      </section>
    </main>
  );
}

export function SubjectScreen({ profile, muted, onToggleMute, onPick, onSwitch }: { profile: Profile; muted: boolean; onToggleMute: () => void; onPick: (s: Subject) => void; onSwitch: () => void }) {
  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col items-center gap-5 px-4 py-6">
      <div className="flex w-full justify-between">
        <button className="btn btn-ghost !min-h-[48px]" onClick={onSwitch}>👤 {profile.name}</button>
        <button className="btn btn-ghost !min-h-[48px]" onClick={onToggleMute} aria-pressed={muted} aria-label={muted ? 'Nyalakan suara' : 'Matikan suara'}>{muted ? '🔇' : '🔊'}</button>
      </div>
      <Mascot state="idle" hat={profile.hat} size={150} />
      <h1 className="text-3xl font-extrabold">Mau belajar apa hari ini?</h1>
      {(['math', 'english'] as Subject[]).map((s) => (
        <motion.button key={s} whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.02 }} onClick={() => onPick(s)}
          className={`btn w-full !min-h-[96px] !text-3xl ${s === 'math' ? 'btn-primary' : 'btn-secondary'}`}>
          {s === 'math' ? '🔢' : '🔤'} {SUBJECT_LABEL[s]}
        </motion.button>
      ))}
    </main>
  );
}

export function LevelMap({ profile, subject, onPlay, onBack }: { profile: Profile; subject: Subject; onPlay: (id: number) => void; onBack: () => void }) {
  const tiers: Record<number, string> = { 1: 'Tingkat 1 • Kelas 1–2', 2: 'Tingkat 2 • Kelas 3–4', 3: 'Tingkat 3 • Kelas 5–6' };
  return (
    <main className="mx-auto flex min-h-full max-w-xl flex-col gap-4 px-4 py-4">
      <header className="flex items-center gap-3">
        <button className="btn btn-ghost !min-h-[48px] !px-4" onClick={onBack} aria-label="Kembali">←</button>
        <h1 className="text-2xl font-extrabold">{SUBJECT_LABEL[subject]}</h1>
      </header>
      {[1, 2, 3].map((tier) => (
        <section key={tier} className="card">
          <h2 className="mb-2 text-lg font-extrabold">{tiers[tier]}</h2>
          <div className="grid grid-cols-5 gap-2">
            {LEVELS[subject].filter((l) => l.tier === tier).map((l) => {
              const playable = isPlayable(subject, l.id);
              const open = playable && isUnlocked(profile, subject, l.id);
              const res = profile.progress[progressKey(subject, l.id)];
              return (
                <button key={l.id} disabled={!open} onClick={() => onPlay(l.id)}
                  aria-label={`Level ${l.id}: ${l.title}${!playable ? ', segera hadir' : !open ? ', terkunci' : ''}`}
                  className={`flex min-h-[64px] flex-col items-center justify-center rounded-2xl text-xl font-extrabold shadow-chunky transition active:translate-y-1 active:shadow-none ${open ? 'bg-leaf-700 text-white' : 'bg-sea-100 text-sea-800/50'}`}>
                  {open ? l.id : playable ? '🔒' : '🚧'}
                  {res && <Stars count={res.stars} size="text-xs" />}
                </button>
              );
            })}
          </div>
          {LEVELS[subject].some((l) => l.tier === tier && !isPlayable(subject, l.id)) && (
            <p className="mt-2 text-sm opacity-70">🚧 = segera hadir</p>
          )}
        </section>
      ))}
    </main>
  );
}
