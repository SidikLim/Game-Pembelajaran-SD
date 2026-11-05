/** Bank materi Bahasa Indonesia (Tingkat 1, kelas 1–2). Isi perlu ditinjau guru; lihat docs/requirements/bahasa-indonesia.md. */
import type { VocabItem } from './vocab';

/** Nama huruf dalam Bahasa Indonesia (untuk diucapkan; huruf tunggal sering dibaca keliru oleh mesin suara). */
export const ID_LETTER_NAME: Record<string, string> = {
  a: 'a', b: 'be', c: 'ce', d: 'de', e: 'e', f: 'ef', g: 'ge', h: 'ha', i: 'i', j: 'je', k: 'ka', l: 'el', m: 'em',
  n: 'en', o: 'o', p: 'pe', q: 'ki', r: 'er', s: 'es', t: 'te', u: 'u', v: 've', w: 'we', x: 'eks', y: 'ye', z: 'zet',
};

/** Ucapan satu token pada permainan susun: nama huruf bila satu huruf, selain itu suku katanya. */
export const idSpeakToken = (token: string) => (token.length === 1 ? ID_LETTER_NAME[token.toLowerCase()] ?? token : token);

export const ID_LETTER_WORDS: Record<string, { word: string; emoji: string }> = {
  A: { word: 'apel', emoji: '🍎' }, B: { word: 'buku', emoji: '📖' }, C: { word: 'cabai', emoji: '🌶️' }, D: { word: 'domba', emoji: '🐑' },
  E: { word: 'ember', emoji: '🪣' }, F: { word: 'foto', emoji: '📷' }, G: { word: 'gajah', emoji: '🐘' }, H: { word: 'harimau', emoji: '🐯' },
  I: { word: 'ikan', emoji: '🐟' }, J: { word: 'jeruk', emoji: '🍊' }, K: { word: 'kucing', emoji: '🐱' }, L: { word: 'lebah', emoji: '🐝' },
  M: { word: 'mobil', emoji: '🚗' }, N: { word: 'nanas', emoji: '🍍' }, O: { word: 'ombak', emoji: '🌊' }, P: { word: 'pisang', emoji: '🍌' },
  Q: { word: 'Qatar', emoji: '🇶🇦' }, R: { word: 'rumah', emoji: '🏠' }, S: { word: 'sapi', emoji: '🐄' }, T: { word: 'topi', emoji: '🎩' },
  U: { word: 'ular', emoji: '🐍' }, V: { word: 'vas', emoji: '🏺' }, W: { word: 'wortel', emoji: '🥕' }, X: { word: 'xilofon', emoji: '🎹' },
  Y: { word: 'yoyo', emoji: '🪀' }, Z: { word: 'zebra', emoji: '🦓' },
};
export const ID_LETTERS = Object.keys(ID_LETTER_WORDS);

/** Benda sehari-hari: kata -> gambar. */
export const ID_OBJECTS: VocabItem[] = [
  { id: 'buku', word: 'buku', emoji: '📖' }, { id: 'pensil', word: 'pensil', emoji: '✏️' }, { id: 'tas', word: 'tas', emoji: '🎒' },
  { id: 'kursi', word: 'kursi', emoji: '🪑' }, { id: 'bola', word: 'bola', emoji: '⚽' }, { id: 'topi', word: 'topi', emoji: '🎩' },
  { id: 'sepatu', word: 'sepatu', emoji: '👟' }, { id: 'baju', word: 'baju', emoji: '👕' }, { id: 'rumah', word: 'rumah', emoji: '🏠' },
  { id: 'mobil', word: 'mobil', emoji: '🚗' }, { id: 'sepeda', word: 'sepeda', emoji: '🚲' }, { id: 'pohon', word: 'pohon', emoji: '🌳' },
  { id: 'bunga', word: 'bunga', emoji: '🌸' }, { id: 'matahari', word: 'matahari', emoji: '☀️' }, { id: 'bulan', word: 'bulan', emoji: '🌙' },
  { id: 'kucing', word: 'kucing', emoji: '🐱' }, { id: 'ikan', word: 'ikan', emoji: '🐟' }, { id: 'ayam', word: 'ayam', emoji: '🐔' },
  { id: 'sapi', word: 'sapi', emoji: '🐄' }, { id: 'roti', word: 'roti', emoji: '🍞' }, { id: 'susu', word: 'susu', emoji: '🥛' },
  { id: 'apel', word: 'apel', emoji: '🍎' }, { id: 'pisang', word: 'pisang', emoji: '🍌' }, { id: 'payung', word: 'payung', emoji: '☂️' },
];

/** Kalimat sederhana: baca -> pilih gambar. Satu gambar unik per kalimat. */
export const ID_SENTENCES: VocabItem[] = [
  { id: 'k1', word: 'Ibu memasak nasi.', emoji: '🍚' }, { id: 'k2', word: 'Ayah membaca koran.', emoji: '📰' },
  { id: 'k3', word: 'Adik minum susu.', emoji: '🥛' }, { id: 'k4', word: 'Budi bermain bola.', emoji: '⚽' },
  { id: 'k5', word: 'Ani menyiram bunga.', emoji: '🌸' }, { id: 'k6', word: 'Kucing makan ikan.', emoji: '🐟' },
  { id: 'k7', word: 'Burung terbang di langit.', emoji: '🐦' }, { id: 'k8', word: 'Kakak naik sepeda.', emoji: '🚲' },
  { id: 'k9', word: 'Ayam bertelur.', emoji: '🥚' }, { id: 'k10', word: 'Aku menggosok gigi.', emoji: '🪥' },
  { id: 'k11', word: 'Ibu pergi ke pasar.', emoji: '🛒' }, { id: 'k12', word: 'Hujan turun deras.', emoji: '🌧️' },
];

export interface IdWord { word: string; emoji: string; id: string }

/** Kata untuk susun huruf (4 dan 5 huruf). */
export const ID_WORDS: IdWord[] = [
  { word: 'buku', emoji: '📖', id: 'buku' }, { word: 'bola', emoji: '⚽', id: 'bola' }, { word: 'kuda', emoji: '🐴', id: 'kuda' },
  { word: 'sapi', emoji: '🐄', id: 'sapi' }, { word: 'ikan', emoji: '🐟', id: 'ikan' }, { word: 'roti', emoji: '🍞', id: 'roti' },
  { word: 'topi', emoji: '🎩', id: 'topi' }, { word: 'kaki', emoji: '🦶', id: 'kaki' }, { word: 'mata', emoji: '👁️', id: 'mata' },
  { word: 'nasi', emoji: '🍚', id: 'nasi' }, { word: 'apel', emoji: '🍎', id: 'apel' }, { word: 'susu', emoji: '🥛', id: 'susu' },
  { word: 'ular', emoji: '🐍', id: 'ular' },
  { word: 'rumah', emoji: '🏠', id: 'rumah' }, { word: 'bunga', emoji: '🌸', id: 'bunga' }, { word: 'jeruk', emoji: '🍊', id: 'jeruk' },
  { word: 'mobil', emoji: '🚗', id: 'mobil' }, { word: 'tikus', emoji: '🐭', id: 'tikus' }, { word: 'gajah', emoji: '🐘', id: 'gajah' },
  { word: 'bulan', emoji: '🌙', id: 'bulan' }, { word: 'buaya', emoji: '🐊', id: 'buaya' },
];

export interface IdSyllableWord { word: string; emoji: string; syllables: string[] }

/** Kata bersuku kata: 1 = dua suku kata terbuka (ba-ju), 2 = dua suku kata dengan suku tertutup (ru-mah), 3 = tiga suku kata. */
export const ID_SYLLABLES: Record<1 | 2 | 3, IdSyllableWord[]> = {
  1: [
    { word: 'baju', emoji: '👕', syllables: ['ba', 'ju'] }, { word: 'buku', emoji: '📖', syllables: ['bu', 'ku'] },
    { word: 'kaki', emoji: '🦶', syllables: ['ka', 'ki'] }, { word: 'mata', emoji: '👁️', syllables: ['ma', 'ta'] },
    { word: 'sapi', emoji: '🐄', syllables: ['sa', 'pi'] }, { word: 'kuda', emoji: '🐴', syllables: ['ku', 'da'] },
    { word: 'bola', emoji: '⚽', syllables: ['bo', 'la'] }, { word: 'topi', emoji: '🎩', syllables: ['to', 'pi'] },
    { word: 'roti', emoji: '🍞', syllables: ['ro', 'ti'] }, { word: 'nasi', emoji: '🍚', syllables: ['na', 'si'] },
  ],
  2: [
    { word: 'rumah', emoji: '🏠', syllables: ['ru', 'mah'] }, { word: 'tikus', emoji: '🐭', syllables: ['ti', 'kus'] },
    { word: 'kucing', emoji: '🐱', syllables: ['ku', 'cing'] }, { word: 'bunga', emoji: '🌸', syllables: ['bu', 'nga'] },
    { word: 'pisang', emoji: '🍌', syllables: ['pi', 'sang'] }, { word: 'ayam', emoji: '🐔', syllables: ['a', 'yam'] },
    { word: 'jeruk', emoji: '🍊', syllables: ['je', 'ruk'] }, { word: 'gajah', emoji: '🐘', syllables: ['ga', 'jah'] },
  ],
  3: [
    { word: 'sepatu', emoji: '👟', syllables: ['se', 'pa', 'tu'] }, { word: 'kelapa', emoji: '🥥', syllables: ['ke', 'la', 'pa'] },
    { word: 'sepeda', emoji: '🚲', syllables: ['se', 'pe', 'da'] }, { word: 'pesawat', emoji: '✈️', syllables: ['pe', 'sa', 'wat'] },
    { word: 'sekolah', emoji: '🏫', syllables: ['se', 'ko', 'lah'] }, { word: 'perahu', emoji: '🛶', syllables: ['pe', 'ra', 'hu'] },
    { word: 'kelinci', emoji: '🐰', syllables: ['ke', 'lin', 'ci'] }, { word: 'keranjang', emoji: '🧺', syllables: ['ke', 'ran', 'jang'] },
  ],
};
