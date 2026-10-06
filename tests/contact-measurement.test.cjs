const test=require('node:test'),assert=require('node:assert/strict'),load=require('./load-module.cjs');
function setup(send){
 const events=[];let state=0;
 const react={useState:initial=>[state++===0?{name:'Private name',email:'private@example.com',organization:'Private',situation:'Film ou série vidéo',message:'Private message'}:initial,()=>{}],useRef:initial=>({current:initial}),useEffect:()=>{}};
 const component=load('app/contact/ContactForm.tsx',{react,'@emailjs/browser':{init(){},send},'app/lib/measurement.ts':{measure:(...args)=>events.push(args),needCode:()=> 'video'}}).default;
 const root=component({email:'contact@bywharf.com'});function find(el){if(!el||typeof el!=='object')return;if(el.type==='form')return el;for(const child of [el.props?.children].flat()) {const found=find(child);if(found)return found;}}
 return {submit:find(root).props.onSubmit,events};
}
test('Only the provider confirmation triggers conversion; no personal fields in event',async()=>{
 const s=setup(async()=>({status:200}));await s.submit({preventDefault(){}});assert.deepEqual(JSON.parse(JSON.stringify(s.events)),[['contact_form_success',{offer:'video'}]]);
 const failure=setup(async()=>{throw new Error('Provider failure')});await failure.submit({preventDefault(){}});assert.deepEqual(failure.events,[]);
});
test('Two overlapping submissions produce one send and one conversion',async()=>{
 let resolve,calls=0;const s=setup(()=>{calls++;return new Promise(r=>resolve=r)});
 const one=s.submit({preventDefault(){}});await s.submit({preventDefault(){}});assert.equal(calls,1);assert.equal(s.events.length,0);resolve({status:200});await one;assert.equal(s.events.length,1);
});
