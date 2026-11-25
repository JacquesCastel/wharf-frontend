const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const motions = require('../app/lib/insight-motions.json');

for (const motion of motions) test(`${motion.id}: controls, captions, finite animation and pause`, async () => {
  const html = fs.readFileSync(path.join(root, 'public/motions', motion.id + '.html'), 'utf8');
  assert(!/<(?:script|iframe)[^>]+src=|https?:\/\/[^'"\s]*\.(?:woff2?|js)/.test(html));
  assert(!/id="sound"[^>]*checked/.test(html), 'sound requires opt in');
  const elements = new Map();
  let raf, time = 0, operations = 0;
  const stack = [];
  const context = { globalAlpha: 1, font: '400 20px serif', measureText(s) { return { width: s.length * Number(this.font.match(/([\d.]+)px/)?.[1] || 20) * .54 }; } };
  for (const method of ['fillText','beginPath','arc','ellipse','rect','clip','fill','stroke','moveTo','lineTo','fillRect','clearRect','translate','rotate','scale','drawImage']) context[method] = (...args) => {
    operations++;
    for (const arg of args) if (typeof arg === 'number') assert(Number.isFinite(arg), method);
    if (method === 'arc') assert(args[2] >= 0);
    if (method === 'ellipse') assert(args[2] >= 0 && args[3] >= 0);
  };
  context.save = () => stack.push({ globalAlpha: context.globalAlpha, font: context.font });
  context.restore = () => { assert(stack.length > 0); Object.assign(context, stack.pop()); };
  const el = (id = '') => ({ id, checked: id === 'captionsToggle', value: '0', textContent: '', children: [], dataset: {}, src: 'data:image/png;base64,test', setAttribute() {}, getContext: () => context, append(...items) { this.children.push(...items); }, matches: () => false });
  const document = { hidden: false, fonts: { load: () => Promise.resolve(), ready: Promise.resolve() }, getElementById(id) { if (!elements.has(id)) elements.set(id, el(id)); return elements.get(id); }, createElement: () => el(), querySelectorAll: () => elements.get('chapters')?.children || [], querySelector: () => ({ getBoundingClientRect: () => ({ height: 650 }) }), addEventListener() {} };
  class Image { constructor() { this.complete = true; this.naturalWidth = 1627; } set src(value) { queueMicrotask(() => this.onload?.()); } }
  const scope = { document, Image, window: { addEventListener() {} }, performance: { now: () => time }, requestAnimationFrame: f => { raf = f; }, ResizeObserver: class { observe() {} }, parent: { postMessage() {} }, location: { origin: 'https://example.com' }, console, URL, Blob, setTimeout, Math };
  vm.runInNewContext(html.match(/<script>([\s\S]*?)<\/script>/)[1], scope);
  await new Promise(resolve => setImmediate(resolve));
  assert(elements.get('status').textContent.startsWith('Prêt'));
  assert.equal(elements.get('chapters').children.length, 10);
  const idle = operations;
  for (let i = 0; i < 10; i++) raf(time += 1000 / 60);
  assert.equal(operations, idle, 'paused player does not redraw');
  elements.get('play').onclick();
  for (let i = 0; i < 2162; i++) raf(time += 1000 / 60);
  assert.equal(elements.get('time').textContent, '00:36 / 00:36');
  assert.equal(elements.get('play').textContent, 'Lire le film');
  assert.equal(elements.get('captions').textContent, motion.transcript.at(-1).text);
  elements.get('seek').oninput({ target: { value: '10' } });
  assert.equal(elements.get('captions').textContent, motion.transcript.find(cue => cue.start <= 10 && cue.end > 10).text);
  elements.get('captionsToggle').checked = false;
  elements.get('captionsToggle').onchange();
  assert.equal(elements.get('captions').hidden, true);
  elements.get('restart').onclick();
  assert.equal(elements.get('seek').value, '0');
  assert.equal(stack.length, 0);
  for (const ext of ['srt', 'vtt']) {
    const captions = fs.readFileSync(path.join(root, 'public/motions', motion.id + '.' + ext), 'utf8');
    assert.equal((captions.match(/ --> /g) || []).length, 10);
    for (const cue of motion.transcript) assert(captions.includes(cue.text));
  }
});

test('article association does not affect unrelated pages; interview is still a draft', () => {
  assert.equal(motions.length, 2);
  assert.equal(motions.find(m => m.id === 'brief-video').status, 'approved');
  assert.equal(motions.find(m => m.id === 'interview-dirigeant').status, 'draft');
  assert(motions.every(m => m.theme === 'video-b2b'));
  assert.equal(new Set(motions.map(m => m.slug)).size, motions.length);
  for (const motion of motions) {
    assert.equal(motion.transcript[0].start, 0);
    assert.equal(motion.transcript.at(-1).end, motion.duration);
    for (let i = 1; i < motion.transcript.length; i++) assert.equal(motion.transcript[i].start, motion.transcript[i - 1].end);
  }
});
