const { test } = require('node:test');
const assert = require('node:assert/strict');
const load = require('./load-module.cjs');
test('WORK embeds only approved first-party motion URLs', () => {
  const { motionForVideoUrl } = load('app/lib/insight-motions.ts');
  assert.equal(motionForVideoUrl('https://bywharf.com/motions/brief-video.html').id, 'brief-video');
  assert.equal(motionForVideoUrl('/motions/interview-dirigeant.html').id, 'interview-dirigeant');
  for (const url of [undefined, '', 'javascript:alert(1)', 'https://example.com/motions/brief-video.html', 'https://bywharf.com.evil.example/motions/brief-video.html', '/motions/not-reviewed.html', 'https://bywharf.com/motions/brief-video.html?anything=1']) assert.equal(motionForVideoUrl(url), undefined);
});
test('a draft episode cannot be embedded in WORK', () => {
  const motions = require('../app/lib/insight-motions.json').map(m => ({...m, status: 'draft'}));
  const { motionForVideoUrl } = load('app/lib/insight-motions.ts', {'app/lib/insight-motions.json': motions});
  assert.equal(motionForVideoUrl('/motions/brief-video.html'), undefined);
});
