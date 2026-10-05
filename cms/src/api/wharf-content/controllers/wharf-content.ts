import { articleUid, pageUid, deepPopulate, toArticle, todayParis } from '../utils/content';
export default {
 async find(ctx: any) {
  const [articles,pages] = await Promise.all([
   strapi.documents(articleUid as any).findMany({status:'published',filters:{publicationDate:{$lte:todayParis()}},populate:deepPopulate(strapi,articleUid),sort:'publicationDate:desc'} as any),
   strapi.documents(pageUid as any).findMany({status:'published',populate:deepPopulate(strapi,pageUid)} as any),
  ]);
  ctx.set('Cache-Control','no-store');
  ctx.body={data:{articles:articles.map(toArticle),pages:pages.map((p:any)=>({slug:p.slug,texts:Object.fromEntries((p.texts||[]).map(t=>[t.repere,t.texte??''])),seoTitle:p.seoTitle,seoDescription:p.seoDescription,updatedAt:p.updatedAt}))}};
 }
};
