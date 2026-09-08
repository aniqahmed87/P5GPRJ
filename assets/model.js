(function(root){
'use strict';
const f=(key,label,type='text',choices)=>({key,label,type,choices});
const schemas={
 actions:{title:'Action Point Tracker',short:'Action points',icon:'check',description:'Commitments, owners and follow-through.',file:'template_Action(2).xlsx',fields:[f('name','Action Name'),f('owner','Owner'),f('status','Status','select',['Not Started','In Progress','Completed']),f('remarks','Remarks','textarea'),f('assignedDate','Assign Date','date'),f('dueDate','Due Date','date'),f('closeDate','Close Date','date')]},
 risks:{title:'Risk Management',short:'Risks',icon:'shield',description:'Exposure, mitigation and accountability.',file:'tempalate_Risks(1).xlsx',fields:[f('name','Risk Name'),f('owner','Owner'),f('impact','Impact','textarea'),f('mitigation','Mitigation','textarea'),f('status','Risk Status','select',['Open','Closed'])]},
 rfp:{title:'RFP Tracker',short:'RFPs',icon:'file',description:'Procurement progress across workstreams.',file:'template_RFP(2).xlsx',fields:[f('name','RFP Name'),f('owner','Owners'),f('status','Status','select',['Not Started','In Progress','Completed']),f('reference','RFP Ref#'),f('remarks','Remarks','textarea')]},
 milestones:{title:'Key Milestones Tracker',short:'Milestones',icon:'flag',description:'Delivery checkpoints and completion.',file:'template_Milestones(2).xlsx',fields:[f('category','Milestone'),f('name','Task'),f('startDate','Start Date','date'),f('status','Status','select',['Not Started','In Progress','Completed']),f('dueDate','Due Date','date'),f('completionDate','Completion Date','date'),f('progress','Progress (%)','number')]},
 escalations:{title:'Escalations & Approvals',short:'Escalations & approvals',icon:'decision',description:'Decisions that need stakeholder attention.',file:'template_Escalations(2).xlsx',fields:[f('category','Category','select',['Escalation','Approval']),f('name','Title')]},
 team:{title:'Team Structure',short:'Team structure',icon:'users',fields:[f('group','Group','select',['Governance Board','e& Business','e& Technology','Client']),f('name','Role / Workstream'),f('owner','Name(s)','textarea')]},
 raci:{title:'RACI',short:'RACI',icon:'grid',fields:[f('name','Activity'),...['e&','Vendor','C42','Client'].map((x,i)=>f('role'+i,x,'select',['','R','A','C','I','A/R']))]}
};
const uid=()=>globalThis.crypto?.randomUUID?.()||('p-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2));
const now=()=>new Date().toISOString();
const clone=o=>JSON.parse(JSON.stringify(o));
function defaults(key){return Object.fromEntries(schemas[key].fields.map(f=>[f.key,f.type==='select'?f.choices[0]:'']));}
function clean(value,depth=0){if(depth>50)throw Error('Snapshot nesting is too deep.');if(Array.isArray(value))return value.map(x=>clean(x,depth+1));if(value&&typeof value==='object'){const out={};for(const [k,v]of Object.entries(value)){if(['__proto__','prototype','constructor'].includes(k))continue;out[k]=clean(v,depth+1);}return out;}return value;}
function normalize(input){
 if(!input||typeof input!=='object'||Array.isArray(input)||input.app!=='pulse-5g-project-updates')throw Error('Choose a Pulse 5G Project Updates snapshot.');
 if(!Number.isInteger(input.schemaVersion)||input.schemaVersion<1||input.schemaVersion>1)throw Error('This snapshot version needs a compatible portal release. Your current data has not changed.');
 const out=clean(clone(input));
 if(out.baselineDate!==undefined&&!validDate(out.baselineDate))throw Error('Invalid baseline date in snapshot.');
 for(const key of ['modifiedAt','exportedAt'])if(out[key]!==undefined&&(typeof out[key]!=='string'||!Number.isFinite(Date.parse(out[key]))))throw Error('Invalid '+key+' timestamp.');
 if(!out.collections||typeof out.collections!=='object'||Array.isArray(out.collections))throw Error('Snapshot collections are missing or invalid.');
 for(const [key,s]of Object.entries(schemas)){
  const rows=out.collections[key]??[];if(!Array.isArray(rows)||rows.length>50000)throw Error('Invalid '+key+' records.');const ids=new Set();
  out.collections[key]=rows.map((r,i)=>{
   if(!r||typeof r!=='object'||Array.isArray(r))throw Error('Invalid record in '+key+'.');
   const result={...defaults(key),...r};result.id=r.id||uid();if(typeof result.id!=='string'||ids.has(result.id))throw Error('Duplicate or invalid ID in '+key+'.');ids.add(result.id);
   for(const field of s.fields){if(result[field.key]==null)result[field.key]='';if(typeof result[field.key]!=='string')throw Error('Invalid '+field.label+' in '+key+' row '+(i+1)+'.');if(field.type==='select'&&result[field.key]&&!field.choices.includes(result[field.key]))throw Error('Unrecognised '+field.label+' in '+key+' row '+(i+1)+'.');if(field.type==='number'&&result[field.key]!==''&&(!Number.isFinite(Number(result[field.key]))||Number(result[field.key])<0||Number(result[field.key])>100))throw Error('Progress must be between 0 and 100.');if(field.type==='date'&&result[field.key]&&!validDate(result[field.key]))throw Error('Invalid date in '+key+' row '+(i+1)+'.');}
   if(key==='milestones'&&result.startDate&&result.dueDate&&result.startDate>result.dueDate)throw Error('Start Date is after Due Date in milestones row '+(i+1)+'.');
   if(!result.name.trim())throw Error('Missing name/title in '+key+' row '+(i+1)+'.');
   if(result.deletedAt&&(typeof result.deletedAt!=='string'||!Number.isFinite(Date.parse(result.deletedAt))))throw Error('Invalid deletion date in '+key+'.');
   if(result.extraFields!==undefined&&(!result.extraFields||typeof result.extraFields!=='object'||Array.isArray(result.extraFields)))throw Error('Invalid additional fields in '+key+'.');
   if(r.updates!==undefined&&!Array.isArray(r.updates))throw Error('Invalid update history in '+key+'.');
   result.updates=(r.updates||[]).map(u=>{if(!u||typeof u!=='object'||Array.isArray(u)||typeof u.text!=='string'||typeof u.at!=='string'||!Number.isFinite(Date.parse(u.at)))throw Error('Invalid history entry in '+key+'.');return {...u,id:u.id||uid()};});return result;
  });
 }
 if(out.audit!==undefined&&!Array.isArray(out.audit))throw Error('Invalid audit history.');out.audit=out.audit||[];
 for(const entry of out.audit){if(!entry||typeof entry!=='object'||Array.isArray(entry)||typeof entry.at!=='string'||!Number.isFinite(Date.parse(entry.at))||typeof entry.text!=='string'||typeof entry.collection!=='string')throw Error('Invalid change-history entry.');}
 if(out.milestoneCategoryOrder!==undefined&&(!Array.isArray(out.milestoneCategoryOrder)||out.milestoneCategoryOrder.some(x=>typeof x!=='string')))throw Error('Invalid milestone category order.');
 if(out.milestoneCategorySources!==undefined&&!Array.isArray(out.milestoneCategorySources))throw Error('Invalid milestone category references.');
 for(const r of out.milestoneCategorySources||[]){if(!r||typeof r!=='object'||typeof r.id!=='string'||typeof r.category!=='string'||typeof r.remarks!=='string'||!Array.isArray(r.updates)||r.updates.some(u=>!u||typeof u.text!=='string'||typeof u.at!=='string'||!Number.isFinite(Date.parse(u.at))))throw Error('Invalid preserved milestone reference.');}
 const normalized=globalThis.PulseInsights?PulseInsights.migrate(out):out;for(const r of normalized.collections.milestones){if(r.dueDate==null)r.dueDate='';if(r.startDate==null)r.startDate='';}normalized.milestoneCategoryOrder=[...new Set([...(normalized.milestoneCategoryOrder||[]),...normalized.collections.milestones.filter(r=>!r.deletedAt).map(r=>r.category.trim()||'Unassigned milestone')])];return normalized;
}
function validDate(v){return /^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v+'T00:00:00Z').toISOString().slice(0,10)===v;}
function active(db,key){return db.collections[key].filter(r=>!r.deletedAt);}
function finished(r){return ['Completed','Closed'].includes(r.status);}
// Date-only deadlines use the UAE calendar, independent of the viewer's time zone.
function uaeToday(now=new Date()){const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Dubai',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);const part=k=>parts.find(p=>p.type===k).value;return part('year')+'-'+part('month')+'-'+part('day');}
function dueState(r,today=uaeToday()){
 if(r.deletedAt||finished(r))return {kind:'none',days:null};
 if(!r.dueDate||!validDate(r.dueDate))return {kind:'undated',days:null};
 const days=Math.round((Date.parse(r.dueDate+'T00:00:00Z')-Date.parse(today+'T00:00:00Z'))/86400000);
 return {kind:days<0?'overdue':days<=7?'soon':'scheduled',days};
}
function dueStats(rows,today=uaeToday()){const result={overdue:[],soon:[],undated:[]};for(const r of rows){const state=dueState(r,today);if(result[state.kind])result[state.kind].push(r);}for(const key of ['overdue','soon'])result[key].sort((a,b)=>a.dueDate.localeCompare(b.dueDate));return result;}
function log(db,key,id,text,type='change'){db.audit.push({id:uid(),at:now(),collection:key,recordId:id,text,type});db.modifiedAt=now();}
function newRecord(key,values,source){return {...defaults(key),...values,id:uid(),createdAt:now(),modifiedAt:now(),updates:[],...(source?{source}:{} )};}
// Explicitly scoped reset. Returned copy lets the UI keep the original if persistence fails.
function clearCollection(db,key,confirmation){
 if(!['actions','risks','rfp','milestones','escalations'].includes(key))throw Error('Choose an importable tracker.');
 if(confirmation!=='DELETE')throw Error('Type DELETE exactly to confirm.');
 const next=clone(db);next.collections[key]=[];next.audit=(next.audit||[]).filter(a=>a.collection!==key);
 if(key==='milestones'){next.milestoneCategoryOrder=[];next.milestoneCategorySources=[];}
 log(next,key,'','All records and update history cleared from '+schemas[key].short+'.','reset');return next;
}
root.PulseModel={clearCollection,schemas,uaeToday,dueState,dueStats,uid,now,clone,defaults,normalize,validDate,active,finished,log,newRecord};
})(typeof window==='undefined'?globalThis:window);
