const path=require('node:path'),fs=require('node:fs'),assert=require('node:assert/strict');
const project=process.cwd();const req=require('node:module').createRequire(path.join(project,'package.json'));
const {createStrapi}=req('@strapi/strapi');
const {articleUid,pageUid,deepPopulate,toArticle,toArticleInput}=req(path.join(project,'dist/src/api/wharf-content/utils/content.js'));
(async()=>{
 const app=await createStrapi({appDir:project,distDir:path.join(project,'dist')}).load();
 try {
  const articles=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
  const pages=JSON.parse(fs.readFileSync(process.argv[3],'utf8'));
  for(const article of articles){
   let existing=await app.documents(articleUid).findFirst({filters:{slug:article.slug},status:'draft',populate:deepPopulate(app,articleUid)});
   if(existing){assert.deepEqual(toArticle(existing),article,'Ne pas écraser un article modifié dans le CMS : '+article.slug);}
   else {existing=await app.documents(articleUid).create({data:toArticleInput(article)});await app.documents(articleUid).publish({documentId:existing.documentId});}
   let published=await app.documents(articleUid).findOne({documentId:existing.documentId,status:'published',populate:deepPopulate(app,articleUid)});if(!published){await app.documents(articleUid).publish({documentId:existing.documentId});published=await app.documents(articleUid).findOne({documentId:existing.documentId,status:'published',populate:deepPopulate(app,articleUid)});}
   assert.deepEqual(toArticle(published),article);
  }
  for(const [slug,page] of Object.entries(pages)){
   let existing=await app.documents(pageUid).findFirst({filters:{slug},status:'draft'});
   if(!existing){existing=await app.documents(pageUid).create({data:{nom:page.name,slug,texts:Object.entries(page.texts).map(([repere,item])=>({repere,libelle:item.label,texte:item.value})),seoTitle:page.seo?.title,seoDescription:page.seo?.description}});await app.documents(pageUid).publish({documentId:existing.documentId});}
  }
  const count=(await app.documents(articleUid).findMany({status:'published'})).length;assert.equal(count,articles.length);console.log('IMPORT_VERIFIED',JSON.stringify({articles:count,pages:Object.keys(pages).length}));
 } finally {await app.destroy();}
})().catch(e=>{console.error(e.message);process.exitCode=1});
