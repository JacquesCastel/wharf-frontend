// Run on the Wharf server. Reads only this site's isolated analytics database.
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const {createStrapi}=require('@strapi/strapi');
const config=Object.fromEntries(fs.readFileSync('/home/wharf/umami-v3.4.0/.env','utf8').split('\n').filter(l=>l.includes('=')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i),l.slice(i+1)];}));
const db=new URL(config.DATABASE_URL),website=config.WHARF_WEBSITE_ID;
if(!/^[0-9a-f-]{36}$/.test(website||''))throw new Error('Missing configured website ID');
const now=new Date(),parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Paris',year:'numeric',month:'2-digit'}).formatToParts(now),year=Number(parts.find(p=>p.type==='year').value),month=Number(parts.find(p=>p.type==='month').value);
const defaultPeriod=new Date(Date.UTC(year,month-2,1)).toISOString().slice(0,7);
const period=process.argv[2]||defaultPeriod;if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(period))throw new Error('Invalid month');
if(period < (config.WHARF_ACTIVATED_AT||'9999').slice(0,7)){console.log('NO_ELIGIBLE_MONTH_BEFORE_ACTIVATION');process.exit(0);}
const sqlEnv={...process.env,PGHOST:db.hostname,PGPORT:db.port,PGUSER:decodeURIComponent(db.username),PGPASSWORD:decodeURIComponent(db.password),PGDATABASE:db.pathname.slice(1)};
const query=sql=>JSON.parse(execFileSync('psql',['-X','-At','-v','ON_ERROR_STOP=1','-c',`SELECT COALESCE(json_agg(t),'[]') FROM (${sql}) t`],{env:sqlEnv,encoding:'utf8'}));
// Interpret calendar-month boundaries in Paris, including daylight-saving changes.
const where=`website_id='${website}' AND created_at >= ('${period}-01'::date::timestamp AT TIME ZONE 'Europe/Paris') AND created_at < (('${period}-01'::date + interval '1 month')::timestamp AT TIME ZONE 'Europe/Paris')`;
const bounds=query(`SELECT '${period}-01'::date::timestamp AT TIME ZONE 'Europe/Paris' AS start, ('${period}-01'::date + interval '1 month')::timestamp AT TIME ZONE 'Europe/Paris' AS finish`)[0];
const audience={period,collectionStartedAt:config.WHARF_ACTIVATED_AT,status:period===`${year}-${String(month).padStart(2,'0')}`?'partial':'completed',timeZone:'Europe/Paris',coverage:'Uniquement les visiteurs consentants ; les identifiants anonymes tournent chaque jour. Les renvois IA ne prouvent pas une citation.',totals:query(`SELECT count(*) FILTER (WHERE event_type=1)::int AS pageviews, count(DISTINCT visit_id) FILTER (WHERE event_type=1)::int AS visits FROM website_event WHERE ${where}`)[0],pages:query(`SELECT url_path AS page,count(*)::int AS views FROM website_event WHERE ${where} AND event_type=1 GROUP BY url_path ORDER BY views DESC LIMIT 20`),referrers:query(`SELECT COALESCE(NULLIF(referrer_domain,''),'direct_or_unknown') AS origin,count(*)::int AS pageviews FROM website_event WHERE ${where} AND event_type=1 GROUP BY origin ORDER BY pageviews DESC`),events:query(`SELECT event_name AS event,count(*)::int AS count FROM website_event WHERE ${where} AND event_type=2 GROUP BY event_name ORDER BY count DESC`)};
(async()=>{const app=await createStrapi({appDir:process.cwd(),distDir:path.join(process.cwd(),'dist')}).load();try{
 const nextMonth=new Date(Date.UTC(Number(period.slice(0,4)),Number(period.slice(5)),1)).toISOString().slice(0,10),start=period+'-01';
 const entries=await app.documents('api::commercial-opportunity.commercial-opportunity').findMany({filters:{receivedAt:{$gte:start,$lt:nextMonth}},limit:10000});
 const milestones={};for(const field of ['qualifiedAt','meetingAt','quoteAt','signedAt'])milestones[field]=(await app.documents('api::commercial-opportunity.commercial-opportunity').count({filters:{[field]:{$gte:start,$lt:nextMonth}}}));
 const commercial={received:entries.length,stages:entries.reduce((a,e)=>(a[e.stage]=(a[e.stage]||0)+1,a),{}),milestones,definition:'Demandes enregistrées manuellement ; étapes du stock reçu et dates des transitions distinguées. Aucun rattachement automatique à un visiteur.'};
 const observations=await app.documents('api::geo-observation.geo-observation').findMany({filters:{observedAt:{$gte:new Date(bounds.start).toISOString(),$lt:new Date(bounds.finish).toISOString()}},limit:10000});
 const geo={discoveryTests:observations.filter(o=>!o.brandInQuestion&&o.outcome!=='not_tested').length,brandedTests:observations.filter(o=>o.brandInQuestion&&o.outcome!=='not_tested').length,withoutEvidence:observations.filter(o=>o.outcome!=='not_tested'&&!o.evidenceReference?.trim()).length,observations:observations.length,tested:observations.filter(o=>o.outcome!=='not_tested').length,outcomes:observations.reduce((a,o)=>(a[o.outcome]=(a[o.outcome]||0)+1,a),{}),limitation:'Tests ponctuels documentés, pas un score global ni une estimation de part de marché.'};
 const data={period,generatedAt:new Date().toISOString(),audience,commercial,geo};
 const uid='api::measurement-review.measurement-review',existing=await app.documents(uid).findFirst({filters:{period}});
 if(existing)await app.documents(uid).update({documentId:existing.documentId,data});else await app.documents(uid).create({data});
 const exportDir='/root/wharf-maintenance/measurement-reports';fs.mkdirSync(exportDir,{recursive:true,mode:0o700});
 fs.writeFileSync(path.join(exportDir,period+'.json'),JSON.stringify({...data,searchConsole:existing?{clicks:existing.searchConsoleClicks??null,impressions:existing.searchConsoleImpressions??null,brandClicks:existing.searchConsoleBrandClicks??null,nonBrandClicks:existing.searchConsoleNonBrandClicks??null,source:existing.searchConsoleSource||null,importedAt:existing.searchConsoleImportedAt||null}:null},null,2),{mode:0o600});
 console.log('MONTHLY_REVIEW_SAVED',period);
}finally{await app.destroy()}})().catch(e=>{console.error(e.message);process.exitCode=1});
