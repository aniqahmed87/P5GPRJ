/* Optional, explicitly marked PIP sample schedule. Never replaces imported project data. */
(function(root){
'use strict';
const SET='pip-demo-v17',PREFIX='DEMO · ';
function create(today=root.PulseModel.uaeToday()){
 const M=root.PulseModel,at=offset=>offset===null?'':new Date(Date.parse(today+'T00:00:00Z')+offset*86400000).toISOString().slice(0,10);
 const groups=[
 ['01 Scope & approvals',[
 ['Confirm private 5G service requirements',-35,-28,'Completed','100'],
 ['Approve high-level architecture',-28,-19,'Completed','100'],
 ['Close spectrum and security review',-18,-2,'In Progress','65'],
 ['Baseline the implementation plan',-20,-7,'Completed','100']]],
 ['02 Optical transport',[
 ['Complete fibre route survey',-24,-12,'Completed','100'],
 ['Install DWDM nodes and patching',-14,3,'In Progress','85'],
 ['Commission protected transport paths',-9,9,'In Progress','40'],
 ['Complete transport acceptance',5,20,'Not Started','0']]],
 ['03 Radio deployment',[
 ['Confirm radio site readiness',-15,-5,'Completed','100'],
 ['Install and integrate 5G radios',-8,6,'In Progress','55'],
 ['Optimise island coverage',7,24,'Not Started','0'],
 ['Radio acceptance approval',null,27,'Not Started','0']]],
 ['04 Service readiness',[
 ['Integrate enterprise applications',15,30,'Not Started','0'],
 ['Prepare service assurance runbooks',-2,12,'In Progress','25'],
 ['Run end-to-end service acceptance',25,38,'Not Started','0'],
 ['Confirm operational handover dates',null,null,'Not Started','0']]]
 ];
 const rows=groups.flatMap(([name,tasks],g)=>tasks.map(([name,start,due,status,progress],i)=>({...M.newRecord('milestones',{category:PREFIX+groups[g][0],name,startDate:at(start),dueDate:at(due),status,progress,completionDate:status==='Completed'?at(due):''},{kind:'demo',demoSet:SET}),id:SET+'-'+(g+1)+'-'+(i+1),demo:true})));
 return {rows,order:groups.map(g=>PREFIX+g[0]),asOf:today};
}
const isDemo=r=>r.source?.demoSet===SET;
function populate(db,today){
 if(db.collections.milestones.some(isDemo))return 0;
 const sample=create(today);db.collections.milestones.push(...sample.rows);
 db.milestoneCategoryOrder=[...sample.order,...(db.milestoneCategoryOrder||[])];return sample.rows.length;
}
function remove(db){const removedNames=new Set(db.collections.milestones.filter(isDemo).map(r=>r.category));const next=root.PulseModel.clone(db);next.collections.milestones=next.collections.milestones.filter(r=>!isDemo(r));const activeNames=new Set(next.collections.milestones.filter(r=>!r.deletedAt).map(r=>r.category));next.milestoneCategoryOrder=(next.milestoneCategoryOrder||[]).filter(n=>!removedNames.has(n)||activeNames.has(n));next.audit=next.audit.filter(a=>!String(a.recordId||'').startsWith(SET));return next;}
root.PulseDemo={create,populate,remove,isDemo};
})(typeof window==='undefined'?globalThis:window);
