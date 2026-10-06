const fs=require('node:fs'),{execFileSync}=require('node:child_process');
const env=Object.fromEntries(fs.readFileSync('/home/wharf/umami-v3.4.0/.env','utf8').split('\n').filter(l=>l.includes('=')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i),l.slice(i+1)];}));
const u=new URL(env.DATABASE_URL),id=env.WHARF_WEBSITE_ID;
if(!/^[0-9a-f-]{36}$/.test(id||'')||u.pathname!=='/wharf_analytics')throw new Error('Not the configured isolated analytics database');
const tables=['session_replay_saved','session_replay','heatmap_event','revenue','event_data','session_data','website_event'];
const sql='BEGIN; '+tables.map(t=>`DELETE FROM ${t} WHERE website_id='${id}' AND created_at < now()-interval '13 months';`).join(' ')+`DELETE FROM session s WHERE website_id='${id}' AND created_at < now()-interval '13 months' AND NOT EXISTS (SELECT 1 FROM website_event e WHERE e.session_id=s.session_id); COMMIT;`;
execFileSync('psql',['-X','-v','ON_ERROR_STOP=1'],{input:sql,env:{...process.env,PGHOST:u.hostname,PGPORT:u.port,PGUSER:decodeURIComponent(u.username),PGPASSWORD:decodeURIComponent(u.password),PGDATABASE:'wharf_analytics'},stdio:['pipe','ignore','pipe']});
console.log('AUDIENCE_RETENTION_APPLIED_13_MONTHS');
