const test=require('node:test'),assert=require('node:assert/strict'),load=require('./load-module.cjs');
function setup(send, captchaSiteKey='test-site-key') {
 const events=[],hooks=[];let cursor=0,root;
 const react={
  useState(initial){const index=cursor++;if(!(index in hooks))hooks[index]=index===0?{name:'Private name',email:'private@example.com',organization:'Private',situation:'Film ou série vidéo',message:'Private message'}:initial;return [hooks[index],value=>{hooks[index]=typeof value==='function'?value(hooks[index]):value;}];},
  useRef(initial){const index=cursor++;return hooks[index]??(hooks[index]={current:initial});},useEffect(){}
 };
 const component=load('app/contact/ContactForm.tsx',{react,'@emailjs/browser':{init(){},send},'app/lib/measurement.ts':{measure:(...args)=>events.push(args),needCode:()=> 'video'}}).default;
 function find(el,predicate){if(!el||typeof el!=='object')return;if(predicate(el))return el;for(const child of [el.props?.children].flat()){const found=find(child,predicate);if(found)return found;}}
 function render(){cursor=0;root=component({email:'contact@bywharf.com',captchaSiteKey});}
 render();
 return {events,submit:()=>{const form=find(root,el=>el.type==='form');return form.props.onSubmit({preventDefault(){}});},
  verify(token){find(root,el=>el.props?.siteKey===captchaSiteKey && typeof el.props?.onChange==='function').props.onChange(token);render();},
  render,get root(){return root;},get formData(){return hooks[0];},get resetCount(){return hooks[5];}};
}

test('A configured CAPTCHA blocks missing, expired and revoked responses before EmailJS',async()=>{
 let calls=0;const s=setup(async()=>{calls++;});
 await s.submit();assert.equal(calls,0);
 s.verify('verified-token');s.verify('');await s.submit();assert.equal(calls,0);
 assert.deepEqual(s.events,[]);assert.equal(s.formData.message,'Private message');
});
test('Only provider confirmation triggers conversion; token reaches EmailJS but no personal fields reach measurement',async()=>{
 const sent=[];const s=setup(async(...args)=>{sent.push(args);return {status:200};});
 s.verify('verified-token');await s.submit();
 assert.equal(sent.length,1);assert.equal(sent[0][0],'service_dl0m9h9');assert.equal(sent[0][1],'template_fobl3ib');
 assert.equal(sent[0][2]['g-recaptcha-response'],'verified-token');
 assert.equal(sent[0][2].message,'Private message');
 assert.deepEqual(JSON.parse(JSON.stringify(s.events)),[['contact_form_success',{offer:'video'}]]);
});
test('A failed send preserves the message and requires a fresh token before retry',async()=>{
 let calls=0;const s=setup(async()=>{calls++;throw new Error('Provider failure');});
 s.verify('consumed-token');await s.submit();s.render();
 assert.equal(s.formData.message,'Private message');assert.equal(s.resetCount,1);
 await s.submit();assert.equal(calls,1);assert.deepEqual(s.events,[]);
 s.verify('new-token');await s.submit();assert.equal(calls,2);
});
test('Two overlapping submissions produce one send and one conversion',async()=>{
 let resolve,calls=0;const s=setup(()=>{calls++;return new Promise(r=>resolve=r);});
 s.verify('verified-token');const one=s.submit();await s.submit();assert.equal(calls,1);assert.equal(s.events.length,0);
 resolve({status:200});await one;assert.equal(s.events.length,1);
});
test('An unconfigured integration does not load Google or change existing EmailJS parameters',async()=>{
 let payload;const s=setup(async(...args)=>{payload=args[2];},'');
 await s.submit();assert.ok(!Object.hasOwn(payload,'g-recaptcha-response'));
 assert.equal(s.events.length,1);
});
