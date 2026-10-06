const path=require('node:path');
const {createStrapi}=require('@strapi/strapi');
const labels={reference:'Référence interne (sans coordonnées)',receivedAt:'Date de réception',source:'Origine déclarée de la demande',offer:'Offre concernée',stage:'Étape actuelle',qualifiedAt:'Date de qualification',meetingAt:'Date du rendez-vous',quoteAt:'Date du devis',signedAt:'Date de signature',amount:'Montant signé HT (€)',notes:'Notes privées',question:'Question exacte testée',observedAt:'Date du test',engine:'Moteur testé',model:'Modèle et mode utilisés',searchEnabled:'Recherche Web activée',brandInQuestion:'Wharf nommé dans la question',outcome:'Observation',citedUrl:'URL Wharf réellement citée',evidenceReference:'Référence de la preuve privée',period:'Mois (YYYY-MM)',generatedAt:'Date de génération',audience:'Audience observée (consentement requis)',commercial:'Activité commerciale renseignée',geo:'Tests GEO renseignés',searchConsoleClicks:'Clics Search Console — Web',searchConsoleImpressions:'Impressions Search Console — Web',searchConsoleBrandClicks:'Clics des requêtes de marque visibles',searchConsoleNonBrandClicks:'Clics des requêtes hors marque visibles',searchConsoleSource:'Référence de l’export Search Console',searchConsoleImportedAt:'Date de l’import Search Console',analysis:'Analyse et limites',priorities:'Actions du mois suivant'};
(async()=>{const app=await createStrapi({appDir:process.cwd(),distDir:path.join(process.cwd(),'dist')}).load();try{
 for(const [slug,main,list] of [['commercial-opportunity','reference',['reference','receivedAt','source','offer','stage']],['geo-observation','question',['question','observedAt','engine','outcome']],['measurement-review','period',['period','generatedAt']]]){
  const model=app.contentTypes[`api::${slug}.${slug}`],svc=app.plugin('content-manager').service('content-types');const conf=await svc.findConfiguration(model);
  conf.settings.mainField=main;conf.layouts.list=list;
  conf.layouts.edit=Object.entries(model.attributes).filter(([key])=>labels[key]).map(([name,attr])=>[{name,size:['json','text'].includes(attr.type)?12:6}]);
  for(const [name,meta] of Object.entries(conf.metadatas||{}))if(labels[name]){meta.edit={...meta.edit,label:labels[name]};meta.list={...meta.list,label:labels[name]};}
  await svc.updateConfiguration(model,conf);
 }
 console.log('PRIVATE_MEASUREMENT_COLLECTIONS_CONFIGURED');
}finally{await app.destroy()}})().catch(e=>{console.error(e.message);process.exitCode=1});
