/**
 * Membuat file suara pengucapan (public/audio/*.mp3 + manifest.json) dengan Piper TTS + ffmpeg.
 * Bukan bagian build: dijalankan manual di komputer Anda. Lihat docs/PANDUAN-SUARA.md.
 *
 *   npx tsx scripts/generate-audio.ts --piper /path/ke/piper --voice /path/ke/voice.onnx [--force] [--limit 5] [--out public/audio]
 *
 * File yang sudah ada dilewati (kecuali --force), jadi rekaman manusia yang Anda taruh di
 * public/audio dengan nama yang sama TIDAK tertimpa; cukup tambahkan barisnya di manifest.json.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { collectPhrases } from '../src/lib/phrases';
import { speechSlug } from '../src/lib/speechKey';

const args = process.argv.slice(2);
const opt = (name: string) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : undefined; };
const piper = opt('piper'), voice = opt('voice');
const force = args.includes('--force');
const limit = opt('limit') ? Number(opt('limit')) : Infinity;
if (!piper || !voice) { console.error('Wajib: --piper <biner piper> --voice <model .onnx>'); process.exit(1); }

const outDir = resolve(opt('out') ?? 'public/audio');
mkdirSync(outDir, { recursive: true });
const manifestPath = join(outDir, 'manifest.json');
const manifest: Record<string, string> = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};

// Huruf tunggal dilafalkan sebagai NAMA huruf (TTS biasa membaca "a" sebagai kata "ah/uh").
const LETTER_NAME: Record<string, string> = {
  a: 'ay', b: 'bee', c: 'see', d: 'dee', e: 'ee', f: 'eff', g: 'jee', h: 'aitch', i: 'eye', j: 'jay', k: 'kay', l: 'ell', m: 'em',
  n: 'en', o: 'oh', p: 'pee', q: 'cue', r: 'are', s: 'ess', t: 'tee', u: 'you', v: 'vee', w: 'double you', x: 'ex', y: 'why', z: 'zee',
};
/** Teks yang benar-benar dikirim ke TTS untuk sebuah kunci ucapan. */
const synthText = (key: string) => {
  if (LETTER_NAME[key]) return `${LETTER_NAME[key]}.`;
  const m = key.match(/^([a-z])\. (.+)$/); // "a. apple"
  return m ? `${LETTER_NAME[m[1]]}. ${m[2]}` : key;
};

const tmp = mkdtempSync(join(tmpdir(), 'edugame-audio-'));
const used = new Set(Object.values(manifest));
let made = 0, skipped = 0;

for (const key of collectPhrases()) {
  if (made >= limit) break;
  if (manifest[key] && existsSync(join(outDir, manifest[key])) && !force) { skipped++; continue; }
  let file = `${speechSlug(key)}.mp3`;
  for (let n = 2; used.has(file) && manifest[key] !== file; n++) file = `${speechSlug(key)}-${n}.mp3`;

  const wav = join(tmp, 'raw.wav'), norm = join(tmp, 'norm.wav');
  execFileSync(piper, ['--model', voice, '--output_file', wav, '--quiet'], { input: synthText(key), stdio: ['pipe', 'ignore', 'ignore'] });
  // potong hening di awal/akhir, lalu normalkan puncak ke -3 dB agar volume antar-file seragam
  const trim = 'silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.05,areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.05,areverse';
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', wav, '-af', trim, norm]);
  const probe = spawnSync('ffmpeg', ['-i', norm, '-af', 'volumedetect', '-f', 'null', '-'], { encoding: 'utf8' });
  const peak = Number(/max_volume: (-?[\d.]+) dB/.exec(probe.stderr)?.[1] ?? -3);
  const gain = Math.min(20, -3 - peak);
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', norm, '-af', `volume=${gain.toFixed(1)}dB`, '-ac', '1', '-ar', '24000', '-codec:a', 'libmp3lame', '-b:a', '48k', join(outDir, file)]);
  manifest[key] = file;
  used.add(file);
  made++;
  if (made % 25 === 0) console.log(`… ${made} file`);
}

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(manifestPath, JSON.stringify(sorted, null, 2) + '\n');
rmSync(tmp, { recursive: true, force: true });
console.log(`Selesai: ${made} dibuat, ${skipped} dilewati, total ${Object.keys(sorted).length} di manifest → ${outDir}`);
