const { test } = require('node:test');
const assert = require('node:assert/strict');
const { matchHas } = require('next/dist/shared/lib/router/utils/prepare-destination');
const { getPathMatch } = require('next/dist/shared/lib/router/utils/path-match');

async function responseHeaders(host, pathname) {
  const { default: config } = await import('../next.config.mjs');
  const headers = new Headers();
  for (const rule of await config.headers()) {
    if (getPathMatch(rule.source)(pathname) && matchHas({ headers: { host } }, {}, rule.has, rule.missing)) {
      for (const header of rule.headers) headers.set(header.key, header.value);
    }
  }
  return headers;
}

test('production frontend hosts carry host-only HSTS on pages, assets, metadata and errors', async () => {
  for (const host of ['bywharf.com', 'www.bywharf.com', 'BYWHARF.COM:443']) {
    for (const pathname of ['/', '/insights/content-b2b/test', '/robots.txt', '/sitemap.xml', '/_next/static/test.css', '/missing-test-page']) {
      const headers = await responseHeaders(host, pathname);
      const policy = headers.get('strict-transport-security');
      assert.ok(policy, `${host}${pathname} must carry HSTS`);
      const directives = policy.split(';').map(value => value.trim().toLowerCase());
      const maxAge = directives.find(value => value.startsWith('max-age='));
      assert.ok(Number(maxAge?.split('=')[1]) >= 31536000);
      assert.ok(!directives.includes('includesubdomains'));
      assert.ok(!directives.includes('preload'));
    }
  }
});

test('HSTS does not affect local previews, the CMS or lookalike domains', async () => {
  for (const host of ['localhost:3132', '127.0.0.1:3132', 'admin.bywharf.com', 'preview.bywharf.com', 'bywharf.com.example.org', 'wwwXbywharf.com', 'bywharfXcom']) {
    assert.equal((await responseHeaders(host, '/')).get('strict-transport-security'), null, host);
  }
});

test('private route noindex headers remain effective alongside HSTS', async () => {
  for (const host of ['bywharf.com', '127.0.0.1:3132']) {
    for (const pathname of ['/admin', '/admin/settings', '/clients/project', '/prospection/test', '/desinscription/test', '/projets/test', '/sommaire/test', '/login', '/typography-demo']) {
      assert.equal((await responseHeaders(host, pathname)).get('x-robots-tag'), 'noindex, nofollow', `${host}${pathname}`);
    }
    assert.equal((await responseHeaders(host, '/insights')).get('x-robots-tag'), null);
  }
});
