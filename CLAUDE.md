# Game Pembelajaran SD — panduan untuk Claude & agent

## Alur branch & PR
- Semua pekerjaan dikerjakan di branch `staging`; setiap commit hanya ke `staging`. Jangan commit/push langsung ke `main`.
- Jangan membuat PR ke `main` (atau merge ke `main`) sebelum ada konfirmasi eksplisit dari pemilik repo. Tanyakan dulu setelah pekerjaan di `staging` selesai.

## Bahasa & gaya
- Komentar kode, dokumen, dan pesan antarmuka berbahasa Indonesia.

## Proyek
- Stack: React 18 + TypeScript + Vite + Tailwind + Framer Motion + vite-plugin-pwa (tanpa backend). Detail di `README.md`.
- Perintah: `npm run dev`, `npm run build` (tsc + vite build), `npm test` (vitest). Jalankan build dan tes sebelum menyatakan selesai.
- Setiap perubahan fitur/perilaku **wajib dicatat** di `docs/PERUBAHAN.md`; keputusan desain di `docs/KEPUTUSAN-DESAIN.md`.
- Jangan memakai karakter/aset berhak cipta pihak lain (mis. One Piece); gunakan karakter orisinal.
- Antarmuka anak: target sentuh ≥ 56 px, hormati `prefers-reduced-motion`, jangan hanya mengandalkan warna.
