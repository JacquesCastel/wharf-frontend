const test=require('node:test'),assert=require('node:assert/strict');
const m=require('./load-module.cjs')('app/lib/measurement.ts');
test('Only published paths are measurable; queries, hashes and private paths are stripped/excluded',()=>{
 const routes=['/','/contact','/insights/content-b2b/article'];
 assert.equal(m.publicPath('/contact?email=private@example.com#token',routes),'/contact');
 for(const value of ['/clients','/admin','/work/draft','https://evil.example/contact'])assert.equal(m.publicPath(value,routes),null);
 assert.equal(m.safeReferrer('https://chatgpt.com/c/private?email=x#token'),'https://chatgpt.com');
 assert.equal(m.safeReferrer('javascript:alert(1)'),'');
});
test('Consent expires, invalid or future timestamps fail closed',()=>{
 const now=1800000000000;
 assert.equal(m.readChoice(JSON.stringify({choice:'accepted',at:now}),now),'accepted');
 for(const value of [null,'{}','broken',JSON.stringify({choice:'accepted',at:now+1}),JSON.stringify({choice:'accepted',at:now-m.CONSENT_MAX_AGE})])assert.equal(m.readChoice(value,now),null);
});
test('Event payloads cannot carry form data or arbitrary identifiers',()=>{
 const result=JSON.parse(JSON.stringify(m.eventData('contact_form_success',{offer:'private@example.com',email:'secret',message:'private'},'/contact')));
 assert.deepEqual(result,{page:'/contact',offer:'other'});
 assert.equal(m.needCode('Film ou série vidéo'),'video');
 assert.equal(m.eventData('film_play',{film:'https://private/token'},'/work/project').film,undefined);
 assert.equal(m.eventData('contact_click',{},'/insights/topic/article').origin,'article');
});
