# Keputusan Desain

## Visual
- **Tema:** petualangan bajak laut ramah anak, warna laut (teal) + pasir + karang. Token warna di `tailwind.config.js`. Maskot dan semua gambar dibuat orisinal (tidak memakai IP pihak lain).
- **Ramah anak 6–12 tahun:** target sentuh ≥ 56 px, tombol "chunky" bersudut bulat, teks minim, instruksi singkat + ikon/emoji, benar/salah tidak hanya dibedakan warna (maskot, suara, getar).
- **Maskot "Kapten Kaka":** satu SVG; state `idle/thinking/correct/wrong` memetakan langsung ke spesifikasi 2.1. Umpan balik salah selalu menyemangati (gestur lembut, nada turun lembut, petunjuk bertahap).

## Animasi & game feel
- Semua animasi lewat Framer Motion; `MotionConfig reducedMotion="user"` menghormati pengaturan perangkat.
- Progress bar memakai `cubic-bezier(0.215, 0.61, 0.355, 1)` (ease-out-cubic); bintang kemenangan muncul berurutan (staggered) dengan SFX sinkron.
- Drag: buah membesar + bayangan melayang; keranjang berdenyut saat didekati. Ada alternatif **ketuk / keyboard** agar bisa diakses.

## Arsitektur
- **Level berbasis data** (`src/data/levels.ts`) + komponen tantangan yang dipakai ulang → 60 level tanpa 60 layar.
- Soal dibangkitkan dari `seed` per permainan (`lib/random.ts`) → "Ulangi" memberi soal baru, dan pembangkit mudah diuji.
- **Offline-first:** service worker precache semua aset; tanpa font/CDN eksternal; SFX disintesis, jadi tidak ada file audio yang perlu di-cache.
- Penyimpanan: satu dokumen `SaveData` di IndexedDB (`idb-keyval`), cadangan localStorage bila IndexedDB diblokir.
