(function(root){
'use strict';
const done=r=>['Completed','Closed'].includes(r.status);
const tone=r=>done(r)?'success':r.status==='Open'||r.category==='Escalation'?'danger':r.category==='Approval'?'violet':r.status==='In Progress'?'warning':r.status==='Not Started'?'neutral':'unconfirmed';
function stats(rows){return {total:rows.length,complete:rows.filter(done).length,inProgress:rows.filter(r=>r.status==='In Progress').length,notStarted:rows.filter(r=>r.status==='Not Started').length,unconfirmed:rows.filter(r=>!r.status).length};}
function migrate(db){
 const originals=db.collections.milestones.filter(r=>/^baseline-milestones-\d+$/.test(r.id)&&r.name===r.category&&r.remarks&&!r.deletedAt&&!r.milestoneExpanded);
 if(!originals.length)return db;
 db.milestoneCategorySources=Array.isArray(db.milestoneCategorySources)?db.milestoneCategorySources:[];
 for(const r of originals){
  if(db.milestoneCategorySources.some(s=>s.id===r.id))continue;
  db.milestoneCategorySources.push({...r,milestoneExpanded:true});
  const names=r.remarks.split('\n').map(x=>x.trim()).filter(Boolean);
  const children=names.map((name,i)=>({id:r.id+'-point-'+(i+1),category:r.category,name,status:r.status==='Completed'?'Completed':'',completionDate:r.status==='Completed'?r.completionDate:'',progress:r.status==='Completed'?'100':'',updates:[],source:{...r.source,categoryRecordId:r.id},statusReviewRequired:r.status!=='Completed'}));
  const index=db.collections.milestones.findIndex(x=>x.id===r.id);db.collections.milestones.splice(index,1,...children);
 }
 return db;
}
function group(rows,order=[]){const names=[...new Set(rows.map(r=>r.category.trim()||'Uncategorized'))];const seq=[...new Set([...order.filter(n=>names.includes(n)),...names])];return seq.map(name=>{const records=rows.filter(r=>(r.category.trim()||'Uncategorized')===name),s=stats(records);return {name,records,...s,percent:s.total?Math.round(s.complete/s.total*100):0};});}
function filterRows(rows,fields,{query='',status='',columns={},sort}={}){
 const text=v=>String(v??'').toLocaleLowerCase();
 const matches=(r)=>{
  const statusMatches=!status||(status==='__blank__'?!r.status:(r.status||r.category)===status);
  const queryMatches=!query||fields.some(f=>text(r[f.key]).includes(text(query)))||(r.updates||[]).some(u=>text(u.text).includes(text(query)));
  const columnsMatch=Object.entries(columns).every(([key,value])=>!value||(value==='__blank__'?!r[key]:text(r[key]).includes(text(value))));
  return statusMatches&&queryMatches&&columnsMatch;
 };
 let result=rows.filter(matches);
 if(sort?.key){const f=fields.find(f=>f.key===sort.key);result=[...result].sort((a,b)=>{const av=String(sort.key==='progress'?progress(a):a[sort.key]??''),bv=String(sort.key==='progress'?progress(b):b[sort.key]??'');if(!av||!bv)return !av&&!bv?0:!av?1:-1;return (f?.type==='date'?av.localeCompare(bv):av.localeCompare(bv,undefined,{numeric:true,sensitivity:'base'}))*(sort.direction==='desc'?-1:1);});}return result;
}
const progress=r=>done(r)?100:r.status==='Not Started'?0:r.progress!==''&&r.progress!=null&&Number.isFinite(Number(r.progress))?Math.max(0,Math.min(100,Number(r.progress))):0;
function projectUpdates(db){const entries=Object.entries(db.collections).filter(([k])=>['actions','risks','rfp','milestones','escalations','team','raci'].includes(k)).flatMap(([key,rows])=>rows.filter(r=>!r.deletedAt).flatMap(record=>(record.updates||[]).map(u=>({...u,key,name:record.name,recordId:record.id,record}))));entries.push(...(db.milestoneCategorySources||[]).filter(r=>!r.deletedAt).flatMap(record=>(record.updates||[]).map(u=>({...u,key:'milestones',name:record.category,recordId:record.id,record}))));return entries.sort((a,b)=>b.at.localeCompare(a.at));}
function reorderTeam(rows,id,targetId,delta=0){const item=rows.find(r=>r.id===id&&!r.deletedAt);if(!item)return null;const group=rows.filter(r=>r.group===item.group&&!r.deletedAt),from=group.findIndex(r=>r.id===id),to=targetId?group.findIndex(r=>r.id===targetId):from+delta;if(to<0||to>=group.length||from===to)return null;group.splice(to,0,group.splice(from,1)[0]);let i=0;return rows.map(r=>r.group===item.group&&!r.deletedAt?group[i++]:r);}
root.PulseInsights={projectUpdates,reorderTeam,progress,done,tone,stats,migrate,group,filterRows};
})(typeof window==='undefined'?globalThis:window);
