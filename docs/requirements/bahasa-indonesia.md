# Kebutuhan: Mata Pelajaran Bahasa Indonesia

Status: **Tingkat 1 (Level 1–10) dibangun di v0.9.0, Tingkat 2 (Level 11–20) di v0.10.0; Tingkat 3 masih rencana.**
Isi materi **belum ditinjau guru**: tolong koreksi dokumen ini sebelum Tingkat 2–3 dibuat.

## 1. Tujuan
Menambah mata pelajaran ketiga dengan struktur yang sama seperti Matematika dan Bahasa Inggris: 30 level dalam 3 tingkat (kelas 1–2, 3–4, 5–6), alur level yang sama (pop-up target → soal → umpan balik instan → bintang), skor tanpa tekanan waktu, petunjuk setelah 2 kali salah, dan bekerja offline.

Acuan umum: capaian pembelajaran Bahasa Indonesia SD (fase A–C, Kurikulum Merdeka) pada elemen membaca, menulis, dan kosakata. Kecocokan rinci dengan kurikulum sekolah Anda **perlu diperiksa guru**.

## 2. Tingkat 1 — Kelas 1–2 (dibangun)
| Level | Materi | Mekanik | Contoh soal |
|---|---|---|---|
| 1 | Huruf vokal a, i, u, e, o | Dengar → pilih huruf (3 pilihan) | Terdengar "i" → pilih **i** |
| 2 | Huruf a–m | Dengar → pilih huruf (3 pilihan) | Terdengar "be. buku" → pilih **b** |
| 3 | Seluruh abjad a–z | Dengar → pilih huruf (4 pilihan) | Terdengar "zet. zebra" → pilih **z** |
| 4 | Suku kata terbuka (dua suku kata) | Susun suku kata acak | 👕 → ba + ju = **baju** |
| 5 | Suku kata tertutup / huruf gabungan | Susun suku kata acak | 🏠 → ru + mah = **rumah**; 🌸 → bu + nga = **bunga** |
| 6 | Tiga suku kata | Susun suku kata acak | 👟 → se + pa + tu = **sepatu** |
| 7 | Kata 4 huruf | Susun huruf acak | 🐄 → s, a, p, i → **sapi** |
| 8 | Kata 5 huruf | Susun huruf acak | 🏠 → r, u, m, a, h → **rumah** |
| 9 | Membaca kata benda | Baca kata → pilih gambar (3 pilihan) | "sepatu" → 👟 |
| 10 | Membaca kalimat sederhana | Baca kalimat → pilih gambar (3 pilihan) | "Ibu memasak nasi." → 🍚 |

Bank materi: `src/data/indonesia.ts` (26 huruf + kata contoh, 24 benda, 12 kalimat, 21 kata untuk susun huruf, 26 kata untuk susun suku kata).

Aturan umum (sama dengan mata pelajaran lain): 5 soal per level; 3★ bila salah ≤ 1, 2★ bila ≤ 3, selain itu 1★; salah boleh diulang tanpa batas; petunjuk muncul setelah 2 kali salah; level berikutnya terbuka setelah level sebelumnya selesai.

## 3. Tingkat 2 — Kelas 3–4 (dibangun)
| Level | Materi | Mekanik | Contoh soal |
|---|---|---|---|
| 11 | Awalan **ber-** | Lengkapi kalimat, pilih kata (3 pilihan) | "Adik ___ bola di halaman." → **bermain** (bukan *memain*, *dimain*) |
| 12 | Awalan **me-** (peluluhan huruf: menulis, menyapu, menyiram, menari, mengambil, membaca, memasak, membeli) | Lengkapi kalimat | "Ayah ___ halaman setiap pagi." → **menyapu** |
| 13 | Akhiran **-an** (kata benda: mainan, makanan, minuman, tulisan, lukisan, bacaan, nyanyian, hiasan) | Lengkapi kalimat | "Adik punya banyak ___ baru." → **mainan** |
| 14 | **Lawan kata** (12 pasang) | Lengkapi kalimat | Lawan kata dari "besar" adalah ___ → **kecil** |
| 15 | **Persamaan kata** (9 pasang) | Lengkapi kalimat | Persamaan kata dari "pintar" adalah ___ → **pandai** |
| 16 | Campuran lawan + persamaan kata | Lengkapi kalimat | (acak dari dua bank) |
| 17 | Menyusun kalimat 3 kata | **Mekanik baru (varian `SpellingBee`)**: susun kata acak, ada gambar sebagai petunjuk | "memasak / Ibu / nasi." → **Ibu memasak nasi.** |
| 18 | Menyusun kalimat 4–5 kata | Susun kata | "Nenek menanam bunga di kebun." |
| 19 | Tanda baca akhir kalimat (. ? !) | Pilih tanda baca | "Siapa namamu___" → **?** |
| 20 | Huruf kapital (nama orang, kota, hari) dan koma pada rincian | Lengkapi kalimat | "Aku tinggal di kota ___." → **Bandung** (bukan *bandung*, *BANDUNG*) |

Bank materi: `src/data/indonesia2.ts` (8 butir per imbuhan, 12 lawan kata, 9 persamaan kata, 8 tanda baca, 8 kapital/koma, 7 + 9 kalimat untuk disusun). Mekanik, hitungan bintang, dan petunjuk sama dengan Tingkat 1; setiap butir punya petunjuk khusus yang muncul setelah 2 kali salah. Kalimat yang benar dibacakan (suara perangkat) setelah dijawab benar.

Pertanyaan untuk guru khusus Tingkat 2:
1. Pengecoh imbuhan sengaja berupa bentuk yang keliru (mis. *memain*, *dimain*) agar jelas salah; adakah yang sebaiknya diganti karena justru bentuk baku atau membingungkan (mis. *bertarian*, *bersiram*)?
2. Peluluhan huruf pada me- (menyapu, menyiram, menari) diajarkan di kelas 3–4, atau terlalu awal?
3. Pasangan lawan/persamaan kata (mis. "bersih/kotor", "cepat/lekas", "ibu/bunda") — adakah yang kurang lazim untuk anak?
4. Soal huruf kapital memakai pengecoh huruf kecil dan KAPITAL SEMUA; apakah cukup, atau perlu menambah kasus (awal kalimat, judul)?
5. Kalimat untuk disusun memakai titik pada kata terakhir dan kapital pada kata pertama sebagai petunjuk alami; apakah itu mengurangi tantangan yang dimaksud?

## 4. Tingkat 3 — Kelas 5–6 (rencana, tampil "segera hadir")
| Level | Materi | Mekanik yang diusulkan |
|---|---|---|
| 21–23 | Kalimat efektif; kata baku dan tidak baku | Pilih kalimat yang tepat |
| 24–26 | Ide pokok dan kalimat utama paragraf | Bacaan + pertanyaan (komponen `StoryQuiz`) |
| 27–30 | Puisi, pantun (sampiran dan isi), cerita pendek | Bacaan + pertanyaan; melengkapi pantun |

## 5. Suara
- Pengucapan memakai **suara bawaan perangkat berbahasa Indonesia** (`id-ID`). Belum ada file rekaman. Nama huruf diucapkan lewat ejaan nama (b → "be") agar tidak dibaca sebagai kata.
- Pemutar sudah siap menerima rekaman: kunci manifest Bahasa Indonesia berawalan `id:` (mis. `id:be. buku`), tetapi daftar ucapan dan generator rekaman **belum** mencakup Bahasa Indonesia.
- Keputusan terbuka: rekaman suara manusia atau suara sintetis? (lihat `docs/PANDUAN-SUARA.md`; model suara Indonesia berlisensi jelas belum dicari).

## 6. Hal yang perlu dikonfirmasi guru/pemilik
1. Apakah urutan Tingkat 1 sesuai (vokal → abjad → suku kata → kata → kalimat)?
2. Contoh kata huruf **Q** ("Qatar") dan **X** ("xilofon") — apakah ada contoh yang lebih umum/pantas dipakai di sekolah Anda?
3. Penulisan: kata dan kalimat memakai huruf kecil (kalimat diawali huruf kapital); apakah anak kelas 1 sebaiknya diperkenalkan huruf kapital lebih dulu?
4. Kata "kelinci", "keranjang", dan "pesawat" (Level 6) memadai untuk kelas 1–2, atau terlalu sulit?
5. Daftar kosakata dan kalimat di `src/data/indonesia.ts` — tolong tambah/koreksi.

## 7. Kriteria penerimaan (Tingkat 1–2)
- Mata pelajaran ketiga muncul di pilihan; peta level menampilkan 20 level terbuka berurutan (Tingkat 1–2) + 10 level "segera hadir".
- Level 1–20 dapat dimainkan sampai tamat di layar 412×800 dan 360×640 tanpa scroll dan tanpa error.
- Aksesibilitas: 0 pelanggaran axe-core pada layar baru.
- Tes otomatis mencakup bank data, pembangkit soal, dan aturan buka-kunci.
