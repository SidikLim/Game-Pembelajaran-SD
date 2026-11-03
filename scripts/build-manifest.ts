/**
 * Membuat public/audio/manifest.json dari rekaman yang sudah ada di public/audio.
 * Cocokkan nama file dengan docs/daftar-ucapan.csv (kolom "nama file"); ucapan tanpa file
 * dilewati dan tetap diucapkan lewat Web Speech API di perangkat anak.
 *
 *   npx tsx scripts/build-manifest.ts
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { collectPhrases } from '../src/lib/phrases';
import { speechSlug } from '../src/lib/speechKey';

const dir = resolve('public/audio');
mkdirSync(dir, { recursive: true });
const manifest: Record<string, string> = {};
const missing: string[] = [];
const used = new Set<string>();
for (const key of collectPhrases()) {
  let file = `${speechSlug(key)}.mp3`;
  for (let n = 2; used.has(file); n++) file = `${speechSlug(key)}-${n}.mp3`;
  used.add(file);
  if (existsSync(join(dir, file))) manifest[key] = file; else missing.push(key);
}
writeFileSync(join(dir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`${Object.keys(manifest).length} ucapan punya file, ${missing.length} belum (pakai suara perangkat).`);
if (missing.length && missing.length <= 40) console.log('Belum ada:', missing.join(' | '));
