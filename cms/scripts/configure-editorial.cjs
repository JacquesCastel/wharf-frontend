const path=require('node:path');const project=process.cwd();const req=require('node:module').createRequire(path.join(project,'package.json'));const {createStrapi}=req('@strapi/strapi');
const labels={title:'Titre',slug:'Adresse de l’article (à conserver après publication)',theme:'Thème',format:'Format éditorial',tag:'Rubrique affichée',seoTitle:'Titre SEO',description:'Description SEO et résumé de la carte',intro:'Introduction',takeaway:'À retenir',author:'Signature',publicationDate:'Date éditoriale de publication',revisionDate:'Date de révision éditoriale',cta:'Titre de la conclusion / appel à l’action',service:'Offre Wharf associée',sections:'Sections de l’article',research:'Méthode et périmètre',relatedProjectIds:'Identifiants de réalisations liées',nom:'Nom de la page',texts:'Textes de la page',seoDescription:'Description SEO',libelle:'Bloc à modifier',repere:'Repère interne',texte:'Contenu affiché',text:'Texte',anchor:'Ancre du sommaire',paragraphs:'Paragraphes',items:'Liste à puces',table:'Tableau',source:'Source',label:'Libellé de la source',url:'Lien de la source',accessedAt:'Date réelle de consultation',organization:'Organisme',caption:'Titre du tableau',headers:'En-têtes des colonnes',rows:'Lignes du tableau',cells:'Cellules de la ligne',period:'Période étudiée',scope:'Périmètre',method:'Méthode',limitations:'Limites',question:'Question étudiée',sample:'Échantillon',findings:'Résultats observés',analysis:'Analyse',sources:'Sources documentées',series:'Série éditoriale'};
(async()=>{const app=await createStrapi({appDir:project,distDir:path.join(project,'dist')}).load();try{
 for(const uid of ['api::insight-article.insight-article','api::site-page.site-page',...Object.keys(app.components).filter(k=>k.startsWith('editorial.'))]){
  const component=uid.startsWith('editorial.');const model=component?app.components[uid]:app.contentTypes[uid];const svc=app.plugin('content-manager').service(component?'components':'content-types');const conf=await svc.findConfiguration(model);
  for(const [name,meta] of Object.entries(conf.metadatas||{}))if(labels[name]){meta.edit={...meta.edit,label:labels[name]};meta.list={...meta.list,label:labels[name]};}
  if(uid==='api::insight-article.insight-article'){conf.settings.mainField='title';conf.layouts.list=['title','theme','format','publicationDate'];conf.layouts.edit=Object.keys(model.attributes).filter(k=>!['canonicalPath','id','documentId','createdAt','updatedAt','publishedAt','createdBy','updatedBy','locale','localizations'].includes(k)).map(name=>[{name,size:['text','component'].includes(model.attributes[name].type)?12:6}]);}
  if(uid==='api::site-page.site-page'){conf.settings.mainField='nom';conf.layouts.list=['nom','slug'];conf.layouts.edit=['nom','slug','texts','seoTitle','seoDescription'].map(name=>[{name,size:['texts','seoDescription'].includes(name)?12:6}]);conf.metadatas.slug.edit={...conf.metadatas.slug.edit,editable:false,label:'Page du site (repère à conserver)'};}
  if(uid==='editorial.page-text'){conf.settings.mainField='libelle';conf.layouts.edit=[[{name:'libelle',size:12}],[{name:'texte',size:12}]];conf.metadatas.libelle.edit.editable=false;conf.metadatas.repere.edit.visible=false;}
  if(uid==='editorial.section')conf.settings.mainField='title';
  if(uid==='editorial.text')conf.settings.mainField='text';
  await svc.updateConfiguration(model,conf);
 }
 for(const [uid,visible] of [
 ['api::page-home.page-home',['hero_video','bloc_we_image','bloc_work_image','bloc_you_image']],
 ['api::page-contact.page-contact',['email']],
 ['api::footer.footer',['Logo','copyright']],
 ]) {
  const model=app.contentTypes[uid];const svc=app.plugin('content-manager').service('content-types');const conf=await svc.findConfiguration(model);
  conf.layouts.edit=visible.map(name=>[{name,size:model.attributes[name].type==='media'?12:6}]);
  for(const [name,meta] of Object.entries(conf.metadatas||{}))if(meta.edit)meta.edit.visible=visible.includes(name);
  await svc.updateConfiguration(model,conf);
 }
 console.log('CMS_EDITOR_LABELS_CONFIGURED');
}finally{await app.destroy()}})().catch(e=>{console.error(e.message);process.exitCode=1});
