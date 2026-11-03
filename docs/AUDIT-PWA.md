# Audit PWA, Performa, dan Aksesibilitas

Terakhir diukur pada v0.8.0 (build produksi dengan `BASE_PATH=/Game-Pembelajaran-SD/`, dilayani `vite preview`).

## Lighthouse 12 (layar pertama)
| Profil | Performa | Aksesibilitas | Best Practices | SEO | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| Mobile (throttling bawaan) | 98 | 100 | 100 | 100 | 1,7 s | 2,1 s | 80 ms | 0 |
| Desktop | 100 | 100 | 100 | 100 | 0,4 s | 0,5 s | 0 ms | 0 |

Sisa saran (tidak mengubah skor secara berarti): ±65 KiB JavaScript belum terpakai (sebagian besar Framer Motion; bisa dikurangi dengan `LazyMotion`) dan CSS yang memblokir render ±150 ms di mobile.

Lighthouse 12 tidak lagi punya kategori PWA, jadi kemampuan dipasang dan offline diperiksa terpisah (di bawah).

## PWA (diperiksa dengan Playwright)
- Manifest: `display: standalone`, `scope` dan `start_url` mengikuti subpath, kategori `education`/`kids`.
- Ikon: `icon-192.png`, `icon-512.png` (purpose `any`), `icon-maskable-512.png` (purpose `maskable`), `icon.svg`, dan `apple-touch-icon.png` (180 px) — semuanya HTTP 200 dengan tipe benar. Gambar sumber (`public/icon.svg`) seluruhnya berada dalam zona aman maskable (lingkaran radius 40%).
- Service worker mengendalikan halaman setelah muat ulang; 226 entri di cache (aset + 215 file suara).
- Offline: halaman dimuat ulang tanpa jaringan, pemain dibuat, level Inggris 1 dimulai, dan file suara diputar dari cache service worker (HTTP 200, 0 permintaan gagal).
- Membuat ulang ikon: `node scripts/generate-icons.mjs` (butuh `playwright`).

## Aksesibilitas (axe-core 4.14, WCAG 2 A/AA + best-practice)
Lighthouse hanya memeriksa layar pertama, jadi seluruh layar permainan diperiksa dengan `scripts/audit-a11y.cjs`: profil, pilih mata pelajaran, peta level, intro dan soal (dengan petunjuk tampil) untuk 18 jenis tampilan tantangan, dan layar kemenangan.

Temuan awal dan perbaikannya:
| Temuan | Perbaikan |
|---|---|
| Kontras teks putih pada hijau `#4CC38A` hanya 2,2:1 (tombol utama, kotak level) | Warna tombol/kotak jadi `leaf-700` `#17814F` (≈4,9:1) |
| Kontras teks putih pada koral `#FF7A59` (huruf Spelling Bee) | `coral-600` `#E0502F` (≈3,9:1, teks besar) |
| Label "Keranjang" memakai opasitas 60% (3,9:1) | Warna `sea-800` penuh |
| Dialog intro tanpa nama | `aria-label` "Level N: judul" |
| Progress bar tanpa nama | `aria-label` "Kemajuan level" |
| Layar permainan tanpa `h1` | `h1` tersembunyi (`sr-only`) "Level N: judul" |
| `aria-label` pada `div`/`span` tanpa role | `role="img"` (ekspresi/gambar) atau `role="group"` (kumpulan) |
| Nama tombol tidak memuat teks yang terlihat ("Pilihan 1" untuk tombol berisi angka/kata, "Dengarkan" untuk tombol "Dengar") | Tombol bertulisan memakai teksnya sebagai nama; tombol emoji tetap "Pilihan N" dengan emoji `aria-hidden`; huruf "Z" pada animasi tidur diganti emoji 💤 |

Hasil akhir: **0 pelanggaran** pada tiga kali pindai penuh (soal diacak tiap kali).

## Cara mengulang
```bash
BASE_PATH=/Game-Pembelajaran-SD/ npm run build
BASE_PATH=/Game-Pembelajaran-SD/ npx vite preview --port 4182 &   # preview harus memakai BASE_PATH yang sama dengan build
npx lighthouse@12 http://localhost:4182/Game-Pembelajaran-SD/ --only-categories=performance,accessibility,best-practices,seo
AUDIT_BASE=http://localhost:4182/Game-Pembelajaran-SD/ node scripts/audit-a11y.cjs
```

## Belum tercakup
- Uji dengan pembaca layar sungguhan (TalkBack/VoiceOver) dan perangkat sentuh nyata.
- Audit situs yang sudah di-deploy di GitHub Pages (tidak bisa dijangkau dari lingkungan pengembangan ini); jalankan Lighthouse pada alamat Pages setelah merge.
- Mode gelap/kontras tinggi dan pembesaran teks 200%.
