const {test}=require('node:test');const assert=require('node:assert/strict');const load=require('./load-module.cjs');
const cms=()=>load('app/lib/cms-content.ts',{react:{cache:fn=>fn}});
test('an empty published CMS collection stays empty instead of resurrecting archived articles',async()=>{
 const result=await cms().fetchPublishedContent(async()=>({ok:true,json:async()=>({data:{articles:[],pages:[]}})}));assert.equal(result.articles.length,0);
});
test('a CMS outage fails explicitly and cannot silently replace edited content with the import archive',async()=>{
 await assert.rejects(()=>cms().fetchPublishedContent(async()=>({ok:false,status:503})),/CMS indisponible/);
});
test('CMS responses keep the existing editorial validation and disable the fetch cache',async()=>{
 let options;const module=cms();const data=require('../app/lib/insights-content.json');
 const result=await module.fetchPublishedContent(async(url,init)=>{options=init;assert.match(String(url),/\/api\/wharf-content$/);return{ok:true,json:async()=>({data:{articles:data,pages:[]}})}});
 assert.equal(options.cache,'no-store');assert.equal(result.articles.length,8);
 await assert.rejects(()=>module.fetchPublishedContent(async()=>({ok:true,json:async()=>({data:{articles:[{...data[0],slug:data[1].slug},data[1]],pages:[]}})})),/duplicate/);
});
test('the rendering contract is independent of the retired import archive',async()=>{
 const module=load('app/lib/cms-content.ts',{react:{cache:fn=>fn},'app/lib/insights-content.json':[{title:'Archive deliberately invalid for this test'}]});
 const result=await module.fetchPublishedContent(async()=>({ok:true,json:async()=>({data:{articles:[],pages:[]}})}));assert.equal(result.articles.length,0);
});
