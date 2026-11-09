# EduGame Kidz — Game Pembelajaran SD (PWA)

Game belajar **Matematika**, **Bahasa Inggris**, dan **Bahasa Indonesia** (Tingkat 1) untuk anak SD (kelas 1–6), berbasis PWA yang bisa dipakai offline. Spesifikasi asli: [`docs/spesifikasi/Spesifikasi_Teknis_EduGame_SD.pdf`](docs/spesifikasi/Spesifikasi_Teknis_EduGame_SD.pdf).

## Menjalankan
```bash
npm install
npm run dev      # pengembangan
npm run build    # typecheck + build produksi (+ service worker)
npm run preview  # coba hasil build / uji PWA offline
npm test         # tes logika (vitest)
```

## Mencoba online
Setelah di-deploy: https://sidiklim.github.io/Game-Pembelajaran-SD/ (Settings → Pages → Source: GitHub Actions, lalu push ke `main`).

## Stack
React 18 + TypeScript + Vite, Tailwind CSS, Framer Motion, `vite-plugin-pwa`, `idb-keyval` (IndexedDB, cadangan localStorage). Tanpa backend.

## Status: semua 3 tingkat tersedia (v0.6) — Level 1–30 per mata pelajaran
Sudah ada: profil pemain lokal, peta 30 level × 2 mata pelajaran, maskot "Kapten Kaka" (4 state), alur level lengkap (intro → soal → umpan balik → kemenangan), bintang, combo, confetti, SFX, PWA, dan 15 jenis tantangan:
- **Bahasa Indonesia L1–20** — huruf, suku kata, susun kata, membaca; imbuhan, lawan/persamaan kata, menyusun kalimat, tanda baca dan huruf kapital (`PickMatch`, `SpellingBee`, `FillBlank`); L21–30 rencana, lihat [`docs/requirements/bahasa-indonesia.md`](docs/requirements/bahasa-indonesia.md)
- **Matematika L21–30** — kali/bagi lanjut, diskon & desimal, soal cerita petualangan (`ArithQuiz`)
- **Inggris L21–23** — melengkapi kalimat (`FillBlank`); **L24–26** — preposisi (`Preposition`); **L27–30** — cerita pendek (`StoryQuiz`)
- **Matematika L11–13** — perkalian dasar, kelompok piring dan kue (`Multiply`)
- **Matematika L14–16** — berbagi rata sebagai pembagian (`ShareEqual`)
- **Matematika L17–18** — membaca jam analog (`ClockRead`)
- **Matematika L19–20** — pecahan ½, ¼, ¾ dari potongan pizza (`FractionPick`)
- **Inggris L11–13** — keluarga & anggota tubuh (`PickMatch`); **L14–16** — Spelling Bee 5–7 huruf (`SpellingBee`)
- **Inggris L17–18** — kata kerja aksi dengan karakter bergerak (`ActionVerb`); **L19–20** — Listening (`PickMatch`)
- **Matematika L1–3** — mengenal angka, pilih kelompok apel (`CountPick`)
- **Matematika L7–8** — pengurangan dengan memecahkan balon (`BalloonSub`)
- **Matematika L9–10** — puzzle bentuk lingkaran/persegi/segitiga (`ShapePuzzle`)
- **Matematika L4–6** — penjumlahan seret-ke-keranjang (`DragSum`)
- **Inggris L1–8** — dengar/baca lalu pilih huruf atau gambar (`PickMatch`)
- **Inggris L9–10** — Spelling Bee (`SpellingBee`)

Riwayat perubahan: [`docs/PERUBAHAN.md`](docs/PERUBAHAN.md). Keputusan desain: [`docs/KEPUTUSAN-DESAIN.md`](docs/KEPUTUSAN-DESAIN.md).

## Kualitas
Lighthouse mobile 98/100/100/100 dan desktop 100/100/100/100; axe-core 0 pelanggaran di semua layar; berjalan offline sebagai PWA. Rincian dan cara mengulang: [`docs/AUDIT-PWA.md`](docs/AUDIT-PWA.md).

## Suara pengucapan
Game memutar file suara di `public/audio` (saat ini 215 file sintetis, lisensi suara perlu diverifikasi) dan memakai suara bawaan perangkat bila file tidak ada. Cara merekam/membuat file: [`docs/PANDUAN-SUARA.md`](docs/PANDUAN-SUARA.md); daftar 215 ucapan: [`docs/daftar-ucapan.csv`](docs/daftar-ucapan.csv).

## Struktur
```
src/challenges/  satu komponen per jenis tantangan (DragSum, SpellingBee, ...)
src/data/        konfigurasi 30 level per mata pelajaran (berbasis data)
src/lib/         soal acak, skor/bintang, progres, penyimpanan, audio
src/components/  Mascot, ProgressBar, ComboPop, Confetti, Modal
src/screens/     Profil, Mata pelajaran, Peta level, Game, Kemenangan
```
Menambah tantangan baru: buat komponen di `src/challenges/` (props `ChallengeProps`), daftarkan di `Game.tsx` dan `data/levels.ts`, lalu tambah tes pembangkit soalnya.
