// Run through existing SSH access; no new API credential or public write endpoint.
const path=require('node:path'),fs=require('node:fs'),assert=require('node:assert/strict');const project=process.cwd();const req=require('node:module').createRequire(path.join(project,'package.json'));
const {createStrapi}=req('@strapi/strapi');const {articleUid,deepPopulate,toArticle,toArticleInput}=req(path.join(project,'dist/src/api/wharf-content/utils/content.js'));const {validateInsights}=req(path.join(project,'dist/src/api/wharf-content/utils/validate.js'));
(async()=>{const article=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));validateInsights([article]);const app=await createStrapi({appDir:project,distDir:path.join(project,'dist')}).load();try{
 let entry=await app.documents(articleUid).findFirst({status:'draft',filters:{slug:article.slug},populate:deepPopulate(app,articleUid)});
 if(entry)assert.deepEqual(toArticle(entry),article,'Le créneau existe avec un contenu différent : ne pas écraser les modifications.');
 else entry=await app.documents(articleUid).create({data:toArticleInput(article)});
 let published=await app.documents(articleUid).findOne({documentId:entry.documentId,status:'published',populate:deepPopulate(app,articleUid)});
 if(!published){await app.documents(articleUid).publish({documentId:entry.documentId});published=await app.documents(articleUid).findOne({documentId:entry.documentId,status:'published',populate:deepPopulate(app,articleUid)});}
 assert.deepEqual(toArticle(published),article);console.log('ARTICLE_PUBLISHED',JSON.stringify({title:article.title,path:'/insights/'+article.theme+'/'+article.slug,documentId:entry.documentId}));
}finally{await app.destroy()}})().catch(e=>{console.error(e.message);process.exitCode=1});
