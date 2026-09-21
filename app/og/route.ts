import { ImageResponse } from 'next/og';
import { createElement as h } from 'react';
import { getArticle } from '../lib/insights';
import { positioning } from '../lib/editorial';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const theme = searchParams.get('theme');
  const slug = searchParams.get('slug');
  const article = theme && slug ? getArticle(theme, slug) : undefined;
  if ((theme || slug) && !article) return new Response('Article introuvable', { status: 404 });
  return new ImageResponse(
    h('div', { style: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', padding: '64px', background: '#161616', color: '#f5f2e9', fontFamily: 'sans-serif' } },
      h('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: 26 } },
        h('span', { style: { fontWeight: 700 } }, 'WHARF'),
        h('span', { style: { color: '#c8d5b9' } }, article ? 'INSIGHTS' : 'STRATEGY + CONTENT + VIDEO')),
      h('div', { style: { fontSize: 58, fontWeight: 700, lineHeight: 1.12 } }, article?.title || positioning),
      h('div', { style: { fontSize: 23, color: '#c8d5b9' } }, 'bywharf.com · Stratégie, contenus & vidéo B2B')
    ),
    { width: 1200, height: 630 }
  );
}
