/** Bank materi Bahasa Indonesia Tingkat 2 (kelas 3–4). Isi perlu ditinjau guru; lihat docs/requirements/bahasa-indonesia.md. */

export type IdFillBank = 'ber' | 'me' | 'an' | 'lawan' | 'sinonim' | 'campur' | 'tandaAkhir' | 'kapital';

export interface IdFillItem { text: string; answer: string; wrongs: [string, string]; emoji: string; hint: string }

const it = (text: string, answer: string, w1: string, w2: string, emoji: string, hint: string): IdFillItem => ({ text, answer, wrongs: [w1, w2], emoji, hint });

const H_BER = 'Awalan ber- berarti melakukan sesuatu (berlari = melakukan lari)';
const H_ME = 'Awalan me- dipakai pada kata kerja aktif: orangnya yang melakukan pekerjaan';
const H_AN = 'Akhiran -an membentuk kata benda: hasil atau bendanya (mainan, makanan)';

const BER: IdFillItem[] = [
  it('Adik ___ bola di halaman.', 'bermain', 'memain', 'dimain', '⚽', H_BER),
  it('Kami ___ di kolam renang.', 'berenang', 'merenang', 'direnang', '🏊', H_BER),
  it('Kakak ___ kaki ke sekolah setiap pagi.', 'berjalan', 'menjalan', 'dijalan', '🚶', H_BER),
  it('Anak itu ___ cepat sekali.', 'berlari', 'melari', 'dilari', '🏃', H_BER),
  it('Sebelum makan, kita ___ dahulu.', 'berdoa', 'medoa', 'didoa', '🙏', H_BER),
  it('Budi ___ ke taman.', 'bersepeda', 'mesepeda', 'disepeda', '🚲', H_BER),
  it('Paman ___ di kebun setiap sore.', 'berkebun', 'mekebun', 'dikebun', '🌱', H_BER),
  it('Nenek ___ tentang masa kecilnya.', 'bercerita', 'mencerita', 'dicerita', '👵', H_BER),
];

const ME: IdFillItem[] = [
  it('Ibu ___ nasi di dapur.', 'memasak', 'bermasak', 'dimasak', '🍚', H_ME),
  it('Adik ___ buku cerita.', 'membaca', 'berbaca', 'dibaca', '📖', H_ME),
  it('Kakak ___ surat untuk nenek.', 'menulis', 'bertulis', 'ditulis', '✉️', H_ME),
  it('Ayah ___ halaman setiap pagi.', 'menyapu', 'bersapu', 'disapu', '🧹', H_ME),
  it('Ani ___ bunga di taman.', 'menyiram', 'bersiram', 'disiram', '🌸', H_ME),
  it('Ibu ___ sayur di pasar.', 'membeli', 'berbeli', 'dibeli', '🥬', H_ME),
  it('Dewi ___ di atas panggung.', 'menari', 'bertari', 'ditari', '💃', H_ME),
  it('Ayah ___ koran di atas meja.', 'mengambil', 'berambil', 'diambil', '📰', H_ME),
];

const AN: IdFillItem[] = [
  it('Adik punya banyak ___ baru.', 'mainan', 'bermain', 'dimain', '🧸', H_AN),
  it('Ibu membuat ___ yang enak.', 'makanan', 'memakan', 'dimakan', '🍱', H_AN),
  it('Aku membawa ___ dari rumah.', 'minuman', 'meminum', 'diminum', '🥤', H_AN),
  it('___ Kakak sangat rapi.', 'Tulisan', 'Menulis', 'Ditulis', '✍️', H_AN),
  it('___ itu dipajang di dinding.', 'Lukisan', 'Melukis', 'Dilukis', '🖼️', H_AN),
  it('Buku ini ___ yang bagus untuk anak.', 'bacaan', 'membaca', 'dibaca', '📚', H_AN),
  it('Kami menyukai ___ itu.', 'nyanyian', 'bernyanyi', 'menyanyi', '🎶', H_AN),
  it('Ada ___ cantik di dinding.', 'hiasan', 'menghias', 'dihias', '🎀', H_AN),
];

const H_LAWAN = 'Lawan kata artinya kata yang maknanya berkebalikan';
const lawan = (kata: string, jawab: string, w1: string, w2: string): IdFillItem => it(`Lawan kata dari "${kata}" adalah ___.`, jawab, w1, w2, '↔️', H_LAWAN);
const LAWAN: IdFillItem[] = [
  lawan('besar', 'kecil', 'tinggi', 'berat'), lawan('panjang', 'pendek', 'lebar', 'tebal'), lawan('naik', 'turun', 'maju', 'lari'),
  lawan('buka', 'tutup', 'pecah', 'putar'), lawan('siang', 'malam', 'pagi', 'sore'), lawan('baru', 'lama', 'bagus', 'kecil'),
  lawan('jauh', 'dekat', 'tinggi', 'lebar'), lawan('rajin', 'malas', 'pintar', 'ramah'), lawan('kaya', 'miskin', 'murah', 'tua'),
  lawan('tua', 'muda', 'kuat', 'lama'), lawan('terang', 'gelap', 'sepi', 'basah'), lawan('bersih', 'kotor', 'basah', 'harum'),
];

const H_SINONIM = 'Persamaan kata artinya kata yang maknanya hampir sama';
const sinonim = (kata: string, jawab: string, w1: string, w2: string): IdFillItem => it(`Persamaan kata dari "${kata}" adalah ___.`, jawab, w1, w2, '🟰', H_SINONIM);
const SINONIM: IdFillItem[] = [
  sinonim('pintar', 'pandai', 'malas', 'lemah'), sinonim('cantik', 'indah', 'jelek', 'besar'), sinonim('cepat', 'lekas', 'pelan', 'lambat'),
  sinonim('senang', 'gembira', 'sedih', 'marah'), sinonim('ayah', 'bapak', 'ibu', 'kakak'), sinonim('ibu', 'bunda', 'ayah', 'adik'),
  sinonim('murid', 'siswa', 'guru', 'kepala'), sinonim('rapi', 'teratur', 'kotor', 'rusak'), sinonim('sehat', 'bugar', 'sakit', 'lelah'),
];

const H_AKHIR = 'Titik (.) untuk kalimat berita, tanda tanya (?) untuk pertanyaan, tanda seru (!) untuk seruan atau perintah';
const AKHIR: IdFillItem[] = [
  it('Ibu pergi ke pasar___', '.', '?', '!', '🛒', H_AKHIR),
  it('Siapa namamu___', '?', '.', '!', '🙋', H_AKHIR),
  it('Wah, indah sekali pelangi itu___', '!', '.', '?', '🌈', H_AKHIR),
  it('Adik minum susu___', '.', '?', '!', '🥛', H_AKHIR),
  it('Kapan kamu pulang___', '?', '.', '!', '🏠', H_AKHIR),
  it('Awas, ada ular___', '!', '.', '?', '🐍', H_AKHIR),
  it('Di mana rumahmu___', '?', '.', '!', '📍', H_AKHIR),
  it('Kakak membaca buku___', '.', '?', '!', '📖', H_AKHIR),
];

const H_KAP = 'Nama orang, nama kota, dan nama hari diawali huruf kapital; koma memisahkan benda yang disebutkan berurutan';
const KAPITAL: IdFillItem[] = [
  it('___ pergi ke pasar bersama ibu.', 'Ani', 'ani', 'ANI', '🛒', H_KAP),
  it('Aku tinggal di kota ___.', 'Bandung', 'bandung', 'BANDUNG', '🏙️', H_KAP),
  it('Hari ___ aku tidak masuk sekolah.', 'Senin', 'senin', 'SENIN', '📅', H_KAP),
  it('Kami berlibur ke pulau ___.', 'Bali', 'bali', 'BALI', '🏝️', H_KAP),
  it('Ayahku bekerja di ___.', 'Jakarta', 'jakarta', 'JAKARTA', '🏢', H_KAP),
  it('Hari ___ ibu mengajakku ke pasar.', 'Minggu', 'minggu', 'MINGGU', '📅', H_KAP),
  it('Ibu membeli apel___ jeruk, dan pisang.', ',', '.', '?', '🍎', H_KAP),
  it('Aku suka warna merah___ biru, dan hijau.', ',', '.', '!', '🎨', H_KAP),
];

export const ID_FILL_BANK: Record<IdFillBank, IdFillItem[]> = {
  ber: BER, me: ME, an: AN, lawan: LAWAN, sinonim: SINONIM, campur: [...LAWAN, ...SINONIM], tandaAkhir: AKHIR, kapital: KAPITAL,
};

export interface IdSentence { text: string; emoji: string }

/** Kalimat 3 kata (group 1) dan 4–5 kata (group 2) untuk disusun; kata pertama berhuruf kapital, titik melekat di kata terakhir. */
export const ID_SENTENCE_GROUPS: Record<1 | 2, IdSentence[]> = {
  1: [
    { text: 'Ibu memasak nasi.', emoji: '🍚' }, { text: 'Ayah membaca koran.', emoji: '📰' }, { text: 'Adik minum susu.', emoji: '🥛' },
    { text: 'Budi bermain bola.', emoji: '⚽' }, { text: 'Ani menyiram bunga.', emoji: '🌸' }, { text: 'Kucing makan ikan.', emoji: '🐟' },
    { text: 'Kakak naik sepeda.', emoji: '🚲' },
  ],
  2: [
    { text: 'Ibu pergi ke pasar.', emoji: '🛒' }, { text: 'Burung terbang di langit.', emoji: '🐦' }, { text: 'Aku menggosok gigi setiap pagi.', emoji: '🪥' },
    { text: 'Adik minum susu di dapur.', emoji: '🥛' }, { text: 'Kami belajar di sekolah.', emoji: '🏫' }, { text: 'Ayah membaca koran di teras.', emoji: '🗞️' },
    { text: 'Kakak naik sepeda ke taman.', emoji: '🚴' }, { text: 'Hujan turun dengan deras.', emoji: '🌧️' }, { text: 'Nenek menanam bunga di kebun.', emoji: '🌻' },
  ],
};
