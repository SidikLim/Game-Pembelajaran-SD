# Kebutuhan: Mata Pelajaran Bahasa Indonesia

Status: **irisan pertama (Tingkat 1, Level 1–10) dibangun di v0.9.0; Tingkat 2–3 masih rencana.**
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

## 3. Tingkat 2 — Kelas 3–4 (rencana, tampil "segera hadir")
| Level | Materi | Mekanik yang diusulkan |
|---|---|---|
| 11–13 | Kata berimbuhan (ber-, me-, -an): memilih imbuhan yang tepat | Pilih jawaban / melengkapi kata (komponen `FillBlank`) |
| 14–16 | Lawan kata dan persamaan kata | Pilih pasangan (komponen `PickMatch` versi teks) |
| 17–18 | Menyusun kata acak menjadi kalimat | **Mekanik baru**: susun kata (seperti Spelling Bee tetapi per kata) |
| 19–20 | Huruf kapital dan tanda baca (. , ? !) | Melengkapi kalimat |

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

## 7. Kriteria penerimaan (Tingkat 1)
- Mata pelajaran ketiga muncul di pilihan; peta level menampilkan 10 level terbuka berurutan + 20 level "segera hadir".
- Level 1–10 dapat dimainkan sampai tamat di layar 412×800 dan 360×640 tanpa scroll dan tanpa error.
- Aksesibilitas: 0 pelanggaran axe-core pada layar baru.
- Tes otomatis mencakup bank data, pembangkit soal, dan aturan buka-kunci.
