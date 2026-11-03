import { speechKey } from './speechKey';

/** SFX disintesis dengan Web Audio (tanpa file aset => ringan & jalan offline). */
let ctx: AudioContext | null = null;
let muted = false;

export const setMuted = (m: boolean) => { muted = m; if (m) { window.speechSynthesis?.cancel(); current?.pause(); } };

function audio(): AudioContext | null {
  try {
    ctx ??= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch { return null; }
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.18) {
  const c = audio();
  if (!c || muted) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  const t0 = c.currentTime + start;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(c.destination);
  o.start(t0);
  o.stop(t0 + dur + 0.05);
}

export const sfx = {
  tap: () => tone(520, 0, 0.08, 'triangle'),
  pop: () => tone(700, 0, 0.1, 'square', 0.08),
  /** Nada ceria naik; dipanggil bersamaan dengan munculnya bintang. */
  correct: () => { tone(660, 0, 0.15); tone(880, 0.12, 0.15); tone(1320, 0.24, 0.25); },
  star: (i: number) => tone(784 + i * 180, 0, 0.3, 'triangle', 0.2),
  /** Nada lembut turun — menyemangati, tidak menakutkan. */
  wrong: () => { tone(330, 0, 0.18, 'sine', 0.12); tone(262, 0.16, 0.25, 'sine', 0.12); },
  win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.13, 0.3, 'triangle', 0.2)),
};

// ---------------------------------------------------------------- Ucapan (pengucapan Inggris)
// Prioritas: file rekaman di public/audio (lewat manifest) -> Web Speech API -> tanpa suara.
let manifest: Record<string, string> | null = null;
let manifestLoading: Promise<void> | null = null;
let current: HTMLAudioElement | null = null;
const base = () => (typeof import.meta !== 'undefined' ? import.meta.env.BASE_URL : '/');

/** Muat daftar file suara sekali; bila tidak ada, game memakai Web Speech API. */
export function preloadSpeech(): Promise<void> {
  manifestLoading ??= fetch(`${base()}audio/manifest.json`)
    .then((r) => (r.ok ? (r.json() as Promise<Record<string, string>>) : {}))
    .catch(() => ({}))
    .then((m) => { manifest = m; });
  return manifestLoading;
}

function stopSpeech() {
  window.speechSynthesis?.cancel();
  if (current) { current.pause(); current = null; }
}

function speakSynth(text: string): boolean {
  if (!('speechSynthesis' in window)) return false;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = 0.8;
  u.pitch = 1.2;
  window.speechSynthesis.speak(u);
  return true;
}

/** Ucapkan teks Inggris. true bila ada suara yang diputar (rekaman atau suara perangkat). */
export function speak(text: string): boolean {
  if (muted) return false;
  stopSpeech();
  const file = manifest?.[speechKey(text)];
  if (file) {
    const a = new Audio(`${base()}audio/${file}`);
    current = a;
    // Bila file gagal diputar (rusak/diblokir), jatuh ke suara perangkat.
    const fallback = () => { if (current === a) { current = null; speakSynth(text); } };
    a.addEventListener('error', fallback, { once: true });
    a.play().catch(fallback);
    return true;
  }
  return speakSynth(text);
}
