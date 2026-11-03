/** Kunci seragam sebuah ucapan: dipakai pemutar, manifest, dan skrip pembuat audio. */
export const speechKey = (text: string) => text.trim().toLowerCase().replace(/\s+/g, ' ');

/** Hash kecil (djb2) untuk membedakan nama file yang dipotong. */
const hash = (s: string) => { let h = 5381; for (const c of s) h = ((h << 5) + h + c.charCodeAt(0)) >>> 0; return h.toString(36); };

/** Nama file aman dari kunci ucapan, mis. "a. apple" -> "a-apple". Teks panjang dipotong + hash. */
export function speechSlug(key: string): string {
  const slug = key.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'x';
  return slug.length > 60 ? `${slug.slice(0, 48).replace(/-+$/, '')}-${hash(key)}` : slug;
}
