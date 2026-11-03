# Panduan Suara Pengucapan

## Cara kerjanya
Saat anak menekan 🔊 atau menyentuh huruf/gambar, game memutar suara dengan urutan prioritas:

1. **File rekaman** di `public/audio/` (didaftarkan di `public/audio/manifest.json`) — konsisten di semua HP, jalan offline.
2. **Web Speech API** (suara bawaan HP) bila file untuk ucapan itu tidak ada atau gagal diputar.
3. Tanpa suara bila keduanya tidak tersedia.

Jadi file suara boleh ditambahkan **sedikit demi sedikit**; ucapan tanpa file tetap bersuara lewat perangkat.

## Kondisi saat ini
`public/audio/` berisi **215 file suara sintetis** (semua ucapan) yang dibuat dengan Opsi B di bawah:
- Mesin: Piper TTS 2023.11.14-2; suara: `en_US-lessac-medium` (rilis `v0.0.2`), 22 kHz → mp3 mono 24 kHz 48 kbps, ±1,9 MB.
- **Status lisensi suara: BELUM diverifikasi.** Model Lessac dilatih dari dataset Blizzard 2013 (lisensi: https://www.cstr.ed.ac.uk/projects/blizzard/2013/lessac_blizzard2013/license.html). Baca lisensinya sebelum game dipublikasikan luas/komersial; bila tidak cocok, hapus isi `public/audio/` (game otomatis kembali ke suara perangkat) atau ganti dengan rekaman manusia (Opsi A).
- Diperiksa otomatis: semua 215 file ada, durasi wajar (0,4–8,4 detik), tidak ada yang hening, volume seragam (puncak ≈ −3 dB). **Belum didengarkan manusia**: periksa terutama nama huruf, kata pendek, dan kalimat panjang.
- Mengganti satu ucapan dengan rekaman manusia: taruh mp3 bernama sama di `public/audio/` (menimpa file lama); manifest tidak perlu diubah.

Ada **215 ucapan** (26 nama huruf, 26 "huruf + kata contoh", 87 kata, 61 kalimat, 15 cerita). Daftar lengkap: [`daftar-ucapan.csv`](daftar-ucapan.csv) — kolom "nama file" adalah nama yang harus dipakai persis.

## Opsi A — rekaman suara manusia (disarankan untuk kualitas terbaik)
1. Buka `docs/daftar-ucapan.csv`; baca setiap baris pada kolom **teks yang dibaca**. Nama huruf dibaca sebagai namanya ("A" = *ay*), bukan bunyinya.
2. Tips rekam: ruangan sepi, jarak mikrofon sama, ucapkan **jelas dan agak pelan** (anak 6–12 tahun), 1–2 detik jeda di awal/akhir tidak masalah.
3. Ubah tiap rekaman ke **mp3 mono** dengan nama file dari CSV, lalu taruh di `public/audio/`:
   ```bash
   ffmpeg -i rekaman.wav -af "silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,loudnorm=I=-18:TP=-2" \
          -ac 1 -ar 24000 -codec:a libmp3lame -b:a 48k public/audio/a-apple.mp3
   ```
4. Buat manifest dari file yang sudah ada: `npx tsx scripts/build-manifest.ts` (melaporkan ucapan yang belum punya file).
5. `npm test` (memeriksa semua ucapan di manifest punya file) lalu commit `public/audio/`.

Perkiraan ukuran: 215 file ≈ 2 MB. Semua file otomatis di-cache service worker (bekerja offline).

## Opsi B — suara sintetis (Piper TTS) sebagai pengganti sementara
Skrip `scripts/generate-audio.ts` membuat semua file dengan [Piper](https://github.com/rhasspy/piper) + ffmpeg:
```bash
npx tsx scripts/generate-audio.ts --piper /path/ke/piper --voice /path/ke/en_US-voice.onnx
npx tsx scripts/build-manifest.ts   # opsional; skrip di atas sudah menulis manifest
```
- File yang sudah ada **tidak ditimpa** (rekaman manusia aman); tambahkan `--force` untuk membuat ulang.
- **Periksa lisensi model suara** (dataset pelatihnya) sebelum mempublikasikan hasilnya; tidak semua model suara boleh dipakai secara komersial/disebarkan ulang.
- Kualitas suara sintetis belum diuji telinga manusia; dengarkan sampel sebelum dipakai (terutama nama huruf dan kata yang sering salah dibaca TTS).

## Menambah soal baru yang diucapkan
Bila menambah kosakata/kalimat yang dibacakan, tambahkan ke `collectPhrases()` di `src/lib/phrases.ts`. Tes `src/lib/phrases.test.ts` akan gagal bila ada ucapan dari pembangkit soal yang belum terdaftar, dan memeriksa bahwa manifest (bila ada) mencakup semua ucapan. Setelah itu jalankan lagi `npx tsx scripts/list-phrases.ts` untuk memperbarui `daftar-ucapan.csv`.
