/**
 * Audit aksesibilitas (axe-core, WCAG 2 A/AA + best-practice) pada layar-layar game: profil, mata pelajaran,
 * peta level, intro + soal untuk tiap jenis tantangan (dengan petunjuk tampil), dan layar kemenangan.
 * Hanya dijalankan manual. Butuh `playwright` dan `axe-core` terpasang (npm i -D axe-core; playwright global/dev).
 *
 *   npm run build && npx vite preview --port 4173 &
 *   AUDIT_BASE=http://localhost:4173/ node scripts/audit-a11y.cjs
 *
 * Bila build memakai BASE_PATH, jalankan preview dengan BASE_PATH yang sama dan atur AUDIT_BASE sesuai.
 * Hasil yang diharapkan: "(tidak ada)" pelanggaran. Soal diacak, jadi jalankan beberapa kali.
 */
const { chromium } = require('playwright');
const fs = require('fs');
const BASE = process.env.AUDIT_BASE ?? 'http://localhost:4173/';
const AXE = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 412, height: 800 }, serviceWorkers: 'block' })).newPage();
  const found = {}; // rule -> {impact, desc, where:Set, nodes:[]}
  const scan = async (label) => {
    await p.addScriptTag({ content: AXE }).catch(() => {});
    const r = await p.evaluate(async () => await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] } }));
    for (const v of r.violations) {
      const f = (found[v.id] ??= { impact: v.impact, help: v.help, where: new Set(), nodes: new Set() });
      f.where.add(label); v.nodes.slice(0, 3).forEach((n) => f.nodes.add(n.target.join(' ') + ' :: ' + (n.failureSummary || '').split('\n')[1]?.trim()));
    }
    return r.violations.length;
  };
  await p.goto(BASE);
  await p.evaluate(() => { const progress = {}; for (let i = 1; i <= 29; i++) { progress['math:' + i] = { completed: true, stars: 2, bestScore: 400 }; progress['english:' + i] = { completed: true, stars: 3, bestScore: 500 }; progress['indonesia:' + i] = { completed: true, stars: 3, bestScore: 500 }; } localStorage.setItem('edugame:v1', JSON.stringify({ profiles: [{ id: 'p1', name: 'Budi', hat: 'teal', progress }, { id: 'p2', name: 'Sinta', hat: 'coral', progress: {} }], activeId: null, muted: true })); });
  await p.reload(); await p.waitForTimeout(500);
  console.log('profil:', await scan('profil'));
  await p.click('text=Budi'); await p.waitForTimeout(300);
  console.log('mata pelajaran:', await scan('mata-pelajaran'));
  await p.click('text=Matematika'); await p.waitForTimeout(300);
  console.log('peta level:', await scan('peta-level'));
  const games = [['math', 3, 'CountPick'], ['math', 6, 'DragSum'], ['math', 8, 'BalloonSub'], ['math', 10, 'ShapePuzzle'], ['math', 11, 'Multiply'], ['math', 14, 'ShareEqual'], ['math', 17, 'ClockRead'], ['math', 20, 'FractionPick'], ['math', 22, 'ArithQuiz'], ['math', 28, 'ArithQuiz-cerita'],
                 ['english', 1, 'PickMatch-huruf'], ['english', 5, 'PickMatch-warna'], ['english', 9, 'SpellingBee'], ['english', 17, 'ActionVerb'], ['english', 18, 'ActionVerb-baca'], ['english', 21, 'FillBlank'], ['english', 24, 'Preposition'], ['english', 27, 'StoryQuiz'],
                 ['indonesia', 1, 'ID-huruf'], ['indonesia', 4, 'ID-suku-kata'], ['indonesia', 7, 'ID-susun-huruf'], ['indonesia', 9, 'ID-kata'], ['indonesia', 10, 'ID-kalimat'],
                 ['indonesia', 11, 'ID-berimbuhan'], ['indonesia', 14, 'ID-lawan-kata'], ['indonesia', 17, 'ID-susun-kalimat'], ['indonesia', 19, 'ID-tanda-baca'], ['indonesia', 20, 'ID-kapital']];
  for (const [subj, lv, name] of games) {
    await p.goto(BASE); await p.waitForTimeout(250);
    await p.waitForSelector('text=Mau belajar apa'); await p.click({ math: 'text=Matematika', english: 'text=Bahasa Inggris', indonesia: 'text=Bahasa Indonesia' }[subj]);
    await p.click(`button[aria-label^="Level ${lv}:"]`); await p.waitForTimeout(250);
    const intro = await scan(name + ' (intro)');
    await p.click('text=Ayo Mulai'); await p.waitForTimeout(400);
    // keadaan dengan petunjuk: dua jawaban salah bila ada pilihan
    const o = p.locator('button[data-choice]:not([disabled])');
    if ((await o.count()) >= 3) { await o.nth(0).click(); await p.waitForTimeout(100); await o.nth(0).click({ timeout: 600 }).catch(() => {}); await p.waitForTimeout(250); }
    console.log(name.padEnd(20), 'intro:', intro, '| soal:', await scan(name));
  }
  // layar kemenangan
  await p.goto(BASE); await p.waitForSelector('text=Mau belajar apa'); await p.click('text=Matematika'); await p.click('button[aria-label^="Level 3:"]'); await p.click('text=Ayo Mulai');
  for (let i = 0; i < 5; i++) { for (let t = 0; t < 3; t++) { const e = p.locator('button[data-choice]:not([disabled])'); if (await e.count()) await e.first().click({ timeout: 800 }).catch(() => {}); await p.waitForTimeout(200); } await p.waitForTimeout(1500); }
  await p.waitForSelector('text=Level Selesai', { timeout: 8000 }).catch(() => {}); await p.waitForTimeout(2500);
  console.log('kemenangan:', await scan('kemenangan'));
  console.log('\n=== RINGKASAN PELANGGARAN ===');
  for (const [id, f] of Object.entries(found)) console.log(`- ${id} [${f.impact}] ${f.help}\n    layar: ${[...f.where].slice(0, 6).join(', ')}${f.where.size > 6 ? ` (+${f.where.size - 6})` : ''}\n    contoh: ${[...f.nodes].slice(0, 2).join(' | ')}`);
  if (!Object.keys(found).length) console.log('(tidak ada)');
  await b.close();
})();
