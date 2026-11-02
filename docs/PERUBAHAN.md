# Riwayat Perubahan

Format: terbaru di atas. Setiap perubahan fitur/perilaku **wajib dicatat di sini**.

## v0.3.0 — Bahasa Inggris Level 1–8 (2026-11-02)
### Ditambahkan
- Tantangan **PickMatch** (satu komponen untuk 8 level Inggris), soal dibangkitkan dari kosakata di `src/data/vocab.ts`:
  - **L1–3 Phonics & Alphabet:** dengar huruf (diucapkan bersama kata contoh, mis. "A. Apple"), pilih hurufnya. Huruf bertambah per level: A–F (3 pilihan), A–N (3 pilihan), A–Z (4 pilihan).
  - **L4–6 Animals & Colors:** baca kata, pilih gambar. L4 hewan, L5 warna, L6 campuran hewan + warna (4 pilihan).
  - **L7–8 Numbers & Fruits:** cocokkan teks dengan gambar. L7 angka 1–10 (gambar bintang), L8 angka + buah (4 pilihan; jenis pilihan dalam satu soal selalu sama agar adil).
- Menyentuh pilihan memperdengarkan namanya; tombol 🔊 dengan animasi gelombang suara; pilihan salah meredup, petunjuk muncul setelah 2 kali salah.
- Tes pembangkit soal untuk semua pool.

### Berubah
- Inggris kini mulai dari Level 1; Level 9 (Spelling Bee) baru terbuka setelah Level 8 selesai (sebelumnya terbuka sejak awal).

## v0.2.1 — Publikasi GitHub Pages (2026-11-02)
### Ditambahkan
- Workflow `.github/workflows/pages.yml`: tiap push ke `main` (atau dijalankan manual) menjalankan tes + build lalu deploy ke GitHub Pages.
- `vite.config.ts` membaca `BASE_PATH` agar aset dan scope PWA benar di subpath `/Game-Pembelajaran-SD/`; lokal tetap `/`.
- `@types/node` (dev) untuk `process.env` di konfigurasi Vite.

### Langkah satu kali di GitHub (manual)
Settings → Pages → Build and deployment → Source: **GitHub Actions**. Alamat: `https://sidiklim.github.io/Game-Pembelajaran-SD/`.

## v0.2.0 — Matematika Level 1–3 (2026-11-02)
### Ditambahkan
- Tantangan **CountPick** (Matematika L1–3, Step 1 "Mengenal Angka 1–20"): pilih kelompok apel yang jumlahnya sama dengan angka soal. Rentang naik per level: L1 = 1–5, L2 = 1–10, L3 = 1–20.
- 3 pilihan berbeda per soal; target tidak berulang beruntun; pilihan salah meredup dan memunculkan petunjuk "hitung satu per satu".
- Tes pembangkit soal `makeCountQuestions` dan tes aturan buka-kunci baru.

### Berubah
- Matematika kini dimulai dari Level 1; Level 4 baru terbuka setelah Level 3 selesai (sebelumnya terbuka sejak awal). Level Inggris 9 tetap terbuka sejak awal karena Level 1–8 belum tersedia.

## v0.1.0 — Irisan vertikal (2026-11-02)
### Ditambahkan
- Scaffold: Vite + React 18 + TypeScript + Tailwind + Framer Motion + PWA (precache aset, manifest, ikon SVG).
- Profil pemain lokal (nama panggilan + warna topi maskot), beberapa profil per perangkat.
- Peta 30 level per mata pelajaran (data-driven di `src/data/levels.ts`), 3 tingkat.
- Alur level: pop-up target → soal berulang → umpan balik instan → progress bar ease-out-cubic → layar kemenangan (piala, bintang berurutan, confetti).
- Maskot "Kapten Kaka" (kakatua bajak laut orisinal) dengan state idle/thinking/correct/wrong.
- Tantangan **DragSum** (Matematika L4–6) dan **SpellingBee** (Inggris L9–10).
- SFX hasil sintesis Web Audio (tanpa file aset); pengucapan lewat Web Speech API bila tersedia.
- Penyimpanan IndexedDB (cadangan localStorage): level terbuka, bintang, skor tertinggi.
- Tes logika (`npm test`): pembangkit soal, skor/bintang, progres.

### Perbedaan dari spesifikasi asli (disepakati dengan pemilik)
| Spesifikasi | Yang dibuat | Alasan |
|---|---|---|
| Skor = akurasi × sisa waktu | Skor = akurasi + bonus combo, **tanpa waktu** | Tekanan waktu membuat anak kecil cemas; waktu hanya akan jadi bonus opsional di Tingkat 3 |
| Bintang belum didefinisikan | 3★ bila salah ≤1, 2★ bila ≤3, selain itu 1★ | Aturan jelas & konsisten |
| Leaderboard dengan skor bot | Papan rekor lokal antar-profil di satu perangkat | Skor bot rekaan terkesan menipu |
| Pengucapan Inggris tak ditentukan | Web Speech API + fallback bunyi | Tanpa aset audio; kualitas bergantung perangkat (lihat Rencana) |
| Salah → mengulang | Mengulang tanpa batas + petunjuk setelah 2 kali salah | Anak tidak buntu |
| Tema maskot "karakter One Piece" | Maskot bajak laut **orisinal** | Karakter & aset One Piece berhak cipta pihak lain |
| Lottie untuk animasi | Framer Motion + SVG/CSS | Lebih ringan & offline; Lottie dipakai bila nanti ada aset ilustrator |
| Phaser/Framer Motion | Hanya Framer Motion (DOM) | Game berbasis UI; lebih mudah diakses & dirawat |

### Catatan perilaku sementara
- Level "Segera hadir" dianggap sudah dilewati agar progres tidak buntu (saat ini tidak ada level yang terdampak, aturan disiapkan untuk level berikutnya). Aturan ini hilang sendiri saat level-level sebelumnya dibuat.

## Rencana berikutnya
1. Tantangan: Inggris L11–20 (keluarga/tubuh, spelling 5–7 huruf, kata kerja, listening), pengurangan balon, bentuk, jam, pecahan.
2. Rekam suara pengucapan (mp3) agar konsisten di Android murah/offline.
3. Ikon PWA PNG 192/512 (maskable) & audit Lighthouse.
4. Mode orang tua (ringkasan progres, pengaturan suara).
5. Bank soal lebih besar, tingkat kesulitan adaptif.
