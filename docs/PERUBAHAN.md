# Riwayat Perubahan

Format: terbaru di atas. Setiap perubahan fitur/perilaku **wajib dicatat di sini**.

## v0.5.0 — Tingkat 2 (kelas 3–4), Level 11–20 (2026-11-03)
### Matematika
- **Multiply** (L11–13, Perkalian Dasar): a piring × b kue, pilih jumlah kue. Faktor maksimum 3 / 4 / 5.
- **ShareEqual** (L14–16, Berbagi Rata): konsep pembagian lewat berbagi rata. Anak mengetuk piring untuk memberi satu kue, sampai semua kue terbagi sama banyak; bila tidak sama, kue dikembalikan dan dihitung salah. Piring 2 / 2–3 / 2–4, isi per piring maks. 3 / 4 / 5 (total ≤ 20).
- **ClockRead** (L17–18, Membaca Jam): jam analog (SVG) → pilih waktu digital. L17 jam pas, L18 ditambah setengah jam.
- **FractionPick** (L19–20, Pecahan Dasar): pizza bergambar → pilih pecahan. L19 ½ dan ¼ (2 pilihan); L20 ditambah ¾ (3 pilihan), dan ½ kadang digambar 2 dari 4 potong (pecahan senilai). Pilihan tidak pernah berupa 2/4.

### Bahasa Inggris
- **L11–13 Family & Body Parts:** memakai ulang PickMatch dengan kosakata keluarga, anggota tubuh, dan campuran.
- **L14–16 Spelling Bee 5/6/7 huruf:** memakai ulang SpellingBee; kosakata ditambah 24 kata. Kotak huruf mengecil untuk kata ≥ 6 huruf.
- **ActionVerb** (L17–18): L17 anak melihat karakter bergerak (run, jump, sleep, eat, swim, dance, read, sing) lalu memilih katanya; L18 membaca kata lalu memilih gerakan yang cocok. Emoji tiap gerakan sudah menjelaskan aksinya sehingga tetap jelas bila animasi dimatikan (reduced-motion).
- **L19–20 Listening:** memakai ulang PickMatch dengan 12 kalimat pendek; kalimat hanya diperdengarkan (tidak ditulis), anak memilih gambar. Teks kalimat muncul sebagai petunjuk setelah 2 kali salah.
- Teks kata panjang di PickMatch mengecil otomatis (mis. GRANDMOTHER).

### Lainnya
- Tes pembangkit soal untuk semua tantangan baru dan aturan buka-kunci Tingkat 2 (23 tes).
- Diuji di browser: ke-20 level Tingkat 2 dimainkan sampai tamat di 412×800 dan 360×640 tanpa error dan tanpa scroll. Satu temuan (Action Verbs L17 kelebihan 8px di 360×640 saat petunjuk muncul) diperbaiki dengan menata 3 pilihan kata dalam satu baris.

## v0.4.1 — Layar permainan lebih ringkas (2026-11-03)
### Berubah
- Semua soal kini muat dalam satu layar HP tanpa scroll (diukur di 412×800 dan 360×640 untuk 11 jenis soal, termasuk kasus terpadat: 20 apel, keranjang penuh + petunjuk, 6 keping bentuk, 4 pilihan gambar).
- Ukuran maskot di layar permainan menyesuaikan tinggi layar (104/84/68 px); jarak antar elemen, kartu soal, dan petunjuk dipadatkan di semua tantangan.
- Ukuran emoji di soal Mengenal Angka seragam dalam satu soal, sehingga ukurannya tidak membocorkan jawaban.
- Layar yang lebih tinggi (≥ 760 px) mendapat kartu pilihan sedikit lebih lega.

## v0.4.0 — Matematika Level 7–10 (2026-11-02)
### Ditambahkan
- **BalloonSub** (Matematika L7–8, "Mengurang dengan Balon"): anak memecahkan b balon dari a balon, lalu memilih jumlah yang tersisa dari 3 pilihan. L7 memakai a ≤ 5, L8 memakai a ≤ 10; hasil selalu ≥ 1. Petunjuk "hitung balon yang masih ada" muncul setelah 2 kali salah.
- **ShapePuzzle** (Matematika L9–10, "Puzzle Bentuk"): seret keping ke siluet yang bentuknya sama (Lingkaran, Persegi, Segitiga). Siluet berdenyut saat didekati. L9 = 3 keping, L10 = 6 keping (2 per bentuk, warna dan ukuran bervariasi). Cadangan tanpa seret: ketuk keping lalu ketuk siluet. Setelah 2 kali salah, siluet yang benar bergetar sebagai petunjuk.
- Jumlah soal per level bisa diatur per step (`questions` di `data/levels.ts`); Puzzle Bentuk memakai 3 soal per level karena tiap soal berisi beberapa keping.
- Tes pembangkit soal pengurangan dan puzzle.

### Berubah
- Level Matematika 7–10 kini bisa dimainkan; Level 11 dan seterusnya masih "segera hadir".

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
1. Tantangan Tingkat 3 (kelas 5–6, Level 21–30): perkalian/pembagian lanjut, desimal & persen, soal cerita; fill in the blanks, prepositions, cerita pendek.
2. Rekam suara pengucapan (mp3) agar konsisten di Android murah/offline.
3. Ikon PWA PNG 192/512 (maskable) & audit Lighthouse.
4. Mode orang tua (ringkasan progres, pengaturan suara).
5. Bank soal lebih besar, tingkat kesulitan adaptif.
