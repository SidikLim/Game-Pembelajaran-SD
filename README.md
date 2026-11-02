# EduGame Kidz — Game Pembelajaran SD (PWA)

Game belajar **Matematika** dan **Bahasa Inggris** untuk anak SD (kelas 1–6), berbasis PWA yang bisa dipakai offline. Spesifikasi asli: [`docs/spesifikasi/Spesifikasi_Teknis_EduGame_SD.pdf`](docs/spesifikasi/Spesifikasi_Teknis_EduGame_SD.pdf).

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

## Status: irisan vertikal (v0.2)
Sudah ada: profil pemain lokal, peta 30 level × 2 mata pelajaran, maskot "Kapten Kaka" (4 state), alur level lengkap (intro → soal → umpan balik → kemenangan), bintang, combo, confetti, SFX, PWA, dan 6 tantangan:
- **Matematika L1–3** — mengenal angka, pilih kelompok apel (`CountPick`)
- **Matematika L7–8** — pengurangan dengan memecahkan balon (`BalloonSub`)
- **Matematika L9–10** — puzzle bentuk lingkaran/persegi/segitiga (`ShapePuzzle`)
- **Matematika L4–6** — penjumlahan seret-ke-keranjang (`DragSum`)
- **Inggris L1–8** — dengar/baca lalu pilih huruf atau gambar (`PickMatch`)
- **Inggris L9–10** — Spelling Bee (`SpellingBee`)

Level lain tampil sebagai "🚧 segera hadir" dan dikerjakan bertahap. Riwayat perubahan: [`docs/PERUBAHAN.md`](docs/PERUBAHAN.md). Keputusan desain: [`docs/KEPUTUSAN-DESAIN.md`](docs/KEPUTUSAN-DESAIN.md).

## Struktur
```
src/challenges/  satu komponen per jenis tantangan (DragSum, SpellingBee, ...)
src/data/        konfigurasi 30 level per mata pelajaran (berbasis data)
src/lib/         soal acak, skor/bintang, progres, penyimpanan, audio
src/components/  Mascot, ProgressBar, ComboPop, Confetti, Modal
src/screens/     Profil, Mata pelajaran, Peta level, Game, Kemenangan
```
Menambah tantangan baru: buat komponen di `src/challenges/` (props `ChallengeProps`), daftarkan di `Game.tsx` dan `data/levels.ts`, lalu tambah tes pembangkit soalnya.
