const test=require('node:test'),assert=require('node:assert/strict'),load=require('./load-module.cjs');
function browser(){
 const scripts=[],timers=new Map();let next=0;
 return {scripts,timers,document:{createElement(){return {remove(){this.removed=true;}};},head:{appendChild(script){scripts.push(script);}}},
  setTimeout(fn){timers.set(++next,fn);return next;},clearTimeout(id){timers.delete(id);}};
}
test('The loader shares one script and waits for the Google readiness callback',async()=>{
 const {loadRecaptcha}=load('app/lib/recaptcha.ts'),b=browser();
 const one=loadRecaptcha(b),two=loadRecaptcha(b);assert.equal(one,two);assert.equal(b.scripts.length,1);
 assert.equal(b.scripts[0].src,'https://www.google.com/recaptcha/api.js?onload=wharfContactRecaptchaReady&render=explicit&hl=fr');
 b.grecaptcha={render(){},reset(){}};b.wharfContactRecaptchaReady();assert.equal(await one,b.grecaptcha);assert.equal(b.timers.size,0);
 assert.equal(await loadRecaptcha(b),b.grecaptcha);assert.equal(b.scripts.length,1);
});
test('Network failures and timeouts release the failed loader so the visitor can retry',async()=>{
 for(const reason of ['network','timeout']){
  const {loadRecaptcha}=load('app/lib/recaptcha.ts'),b=browser(),request=loadRecaptcha(b);
  const rejection=assert.rejects(request,/unavailable/);
  if(reason==='network')b.scripts[0].onerror();else [...b.timers.values()][0]();
  await rejection;assert.equal(b.scripts[0].removed,true);assert.equal(b.timers.size,0);
  const retry=loadRecaptcha(b);assert.equal(b.scripts.length,2);
  b.grecaptcha={render(){},reset(){}};b.wharfContactRecaptchaReady();await retry;
 }
});
