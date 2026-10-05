export const articleUid = 'api::insight-article.insight-article';
export const pageUid = 'api::site-page.site-page';
export const todayParis = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
export function deepPopulate(strapi: any, uid: string): any {
 const schema = strapi.contentTypes[uid] || strapi.components[uid];
 return Object.fromEntries(Object.entries(schema.attributes).filter(([,a]: any)=>a.type==='component').map(([key,a]:any)=>[key,{populate:deepPopulate(strapi,a.component)}]));
}
const texts = (values: any[] = []) => values.map(value => value.text || '');
export function toArticle(entry: any): any {
 const source = (s: any) => s ? Object.fromEntries(Object.entries({label:s.label,url:s.url,accessedAt:s.accessedAt,title:s.title,organization:s.organization,publishedAt:s.publicationDate}).filter(([,v])=>v)) : undefined;
 return {
  slug:entry.slug,theme:entry.theme,format:entry.format,tag:entry.tag,title:entry.title,seoTitle:entry.seoTitle,description:entry.description,intro:entry.intro,
  ...(entry.takeaway ? {takeaway:entry.takeaway}:{}),publishedAt:entry.publicationDate,updatedAt:entry.revisionDate,author:entry.author || 'Wharf',cta:entry.cta,service:entry.service,
  ...(entry.relatedProjectIds?.length ? {relatedProjectIds:texts(entry.relatedProjectIds)}:{}),
  sections:(entry.sections || []).map(s=>({id:s.anchor,title:s.title,paragraphs:texts(s.paragraphs),...(s.items?.length?{items:texts(s.items)}:{}),...(s.table?{table:{caption:s.table.caption,headers:texts(s.table.headers),rows:s.table.rows.map(row=>texts(row.cells))}}:{}),...(s.source?{source:source(s.source)}:{})})),
  ...(entry.research ? {research:Object.fromEntries(Object.entries({...entry.research,sources:(entry.research.sources||[]).map(source),...(entry.research.findings?.length ? {findings:texts(entry.research.findings)}:{})}).filter(([k,v])=>!['id','__component'].includes(k)&&v!=null))}:{}),
 };
}
export function toArticleInput(article: any): any {
 const texts = (values: string[] = []) => values.map(text=>({text}));
 const source = (s:any)=>s?{...s,publicationDate:s.publishedAt,publishedAt:undefined}:undefined;
 const {publishedAt,updatedAt,sections,research,relatedProjectIds,...rest}=article;
 return {...rest,publicationDate:publishedAt,revisionDate:updatedAt,canonicalPath:'/insights/'+article.theme+'/'+article.slug,
 sections:sections.map(s=>({anchor:s.id,title:s.title,paragraphs:texts(s.paragraphs),items:texts(s.items),...(s.table?{table:{caption:s.table.caption,headers:texts(s.table.headers),rows:s.table.rows.map(row=>({cells:texts(row)}))}}:{}),...(s.source?{source:source(s.source)}:{})})),
 ...(research?{research:{...research,sources:research.sources.map(source),findings:texts(research.findings)}}:{}),relatedProjectIds:texts(relatedProjectIds)};
}
