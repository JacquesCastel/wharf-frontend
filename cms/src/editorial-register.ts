import { errors } from '@strapi/utils';
import defaults from './data/page-copy.json';
import { articleUid, pageUid, deepPopulate, toArticle, todayParis } from './api/wharf-content/utils/content';
import { validateInsights } from './api/wharf-content/utils/validate';
export default function registerEditorial(strapi: any) {
 strapi.documents.use(async (context: any, next: any) => {
  const {uid,action,params}=context;
  if (![articleUid,pageUid].includes(uid) || !['create','update','publish'].includes(action)) return next();
  const existing=params.documentId ? await strapi.documents(uid).findOne({documentId:params.documentId,status:'draft',populate:deepPopulate(strapi,uid)}) : null;
  if (uid===articleUid && ['create','update'].includes(action)) {
   const data=params.data||{};
   if (existing?.canonicalPath && ((data.slug&&data.slug!==existing.slug)||(data.theme&&data.theme!==existing.theme))) throw new errors.ValidationError('L’URL d’un article déjà publié doit rester stable. Contactez Wharf pour préparer une redirection.');
   if (!existing) {data.publicationDate ||= todayParis(); data.revisionDate ||= data.publicationDate;}
   else if (Object.keys(data).some(k=>!['canonicalPath','publicationDate','revisionDate','publishedAt','updatedAt'].includes(k))) data.revisionDate ||= todayParis();
   if(data.sections) data.sections=data.sections.map((section:any,index:number)=>({...section,anchor:section.anchor||('section-'+(index+1))}));
  }
  if(uid===articleUid && ['create','update'].includes(action) && params.status==='published') {
   const entry={...(existing||{}),...(params.data||{})};
   try { const article=toArticle(entry); validateInsights([article]); if(article.publishedAt>todayParis()||article.updatedAt>todayParis())throw new Error('Date future'); params.data.canonicalPath='/insights/'+article.theme+'/'+article.slug; } catch(error:any){throw new errors.ValidationError('Publication impossible : '+error.message);}
  }
  if(uid===pageUid && action==='update' && params.data?.slug && params.data.slug!==existing?.slug) throw new errors.ValidationError('Le repère d’une page du site doit être conservé.');
  if(action==='publish') {
   try {
    if(uid===articleUid){
     if(!existing)throw new Error('Article introuvable');
     const article=toArticle(existing);validateInsights([article]);
     if(article.publishedAt>todayParis()||article.updatedAt>todayParis())throw new Error('Les dates de publication et de révision ne peuvent pas être dans le futur.');
     const expected='/insights/'+article.theme+'/'+article.slug;
     if(existing.canonicalPath&&existing.canonicalPath!==expected)throw new Error('L’URL publiée ne peut pas être modifiée.');
     if(!existing.canonicalPath)await strapi.documents(uid).update({documentId:params.documentId,data:{canonicalPath:expected}});
    } else {
     const seed=defaults[existing?.slug];if(!seed)throw new Error('Page inconnue');
     const keys=(existing.texts||[]).map((t:any)=>t.repere);
     if(keys.length!==new Set(keys).size||Object.keys(seed.texts).some(k=>!keys.includes(k))||keys.some(k=>!(k in seed.texts)))throw new Error('Conservez les blocs de texte et leurs repères ; seul le contenu doit être modifié.');
    }
   } catch(error:any){throw new errors.ValidationError('Publication impossible : '+error.message);}
  }
  return next();
 });
}
