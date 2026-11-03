/**
 * Membuat ikon PNG PWA dari public/icon.svg (butuh paket `playwright` terpasang; hanya dijalankan manual).
 *   node scripts/generate-icons.mjs
 * Gambar sumber sudah berada di zona aman maskable (semua isi dalam lingkaran radius 40% dari sisi).
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const svg = readFileSync('public/icon.svg', 'utf8');
const targets = [
  ['public/icon-192.png', 192],
  ['public/icon-512.png', 512],
  ['public/icon-maskable-512.png', 512], // seni sumber penuh-bidang, aman untuk dipotong bentuk apa pun
  ['public/apple-touch-icon.png', 180],
];
const browser = await chromium.launch();
const page = await browser.newPage();
for (const [file, size] of targets) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`);
  await page.screenshot({ path: file, clip: { x: 0, y: 0, width: size, height: size } });
  console.log('dibuat', file);
}
await browser.close();
