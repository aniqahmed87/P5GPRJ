(function(root){
'use strict';
const M=root.PulseModel;
const xml=s=>String(s??'').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const elements=(doc,name)=>Array.from(doc.getElementsByTagNameNS('*',name));
const parse=s=>{const d=new DOMParser().parseFromString(s,'application/xml');if(elements(d,'parsererror').length)throw Error('Workbook contains invalid XML.');return d;};
const norm=s=>String(s??'').trim().toLowerCase().replace(/[\s_\-#]+/g,'').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const col=n=>{let s='';for(n++;n;n=Math.floor((n-1)/26))s=String.fromCharCode(65+(n-1)%26)+s;return s;};
const colIndex=s=>{let n=0;for(const c of s.replace(/\d/g,''))n=n*26+c.charCodeAt(0)-64;return n-1;};
async function open(file){
 if(file.size>25*1024*1024)throw Error('Choose an XLSX file smaller than 25 MB.');
 const zip=await JSZip.loadAsync(await file.arrayBuffer());const entries=Object.values(zip.files);if(entries.length>5000)throw Error('Workbook has too many parts.');
 const uncompressed=entries.reduce((a,x)=>a+(x._data?.uncompressedSize||0),0);if(uncompressed>100*1024*1024)throw Error('Workbook expands beyond the supported size.');
 const get=async path=>{if(!zip.file(path))throw Error('Missing workbook component: '+path);return parse(await zip.file(path).async('string'));};
 const wb=await get('xl/workbook.xml'),rels=await get('xl/_rels/workbook.xml.rels');const targets=Object.fromEntries(elements(rels,'Relationship').filter(r=>r.getAttribute('TargetMode')!=='External').map(r=>[r.getAttribute('Id'),r.getAttribute('Target')]));
 let shared=[];if(zip.file('xl/sharedStrings.xml'))shared=elements(await get('xl/sharedStrings.xml'),'si').map(n=>elements(n,'t').map(t=>t.textContent).join(''));
 const date1904=elements(wb,'workbookPr')[0]?.getAttribute('date1904');
 const sheets=elements(wb,'sheet').map(n=>({name:n.getAttribute('name'),target:targets[n.getAttribute('r:id')]}));
 return {sheets,read:async index=>{
  const target=sheets[index]?.target;if(!target)throw Error('Worksheet is unavailable.');const path=target.startsWith('/')?target.slice(1):'xl/'+target.replace(/^\.\//,'');if(path.includes('..'))throw Error('Unsupported worksheet path.');
  const doc=await get(path),rows=elements(doc,'row');if(rows.length>5001)throw Error('Import up to 5,000 records at a time.');
  return rows.map(row=>{const values=[];for(const c of elements(row,'c')){const index=colIndex(c.getAttribute('r')||'A1');if(index>200)throw Error('Too many worksheet columns.');const type=c.getAttribute('t');const value=elements(c,'v')[0]?.textContent??'';if(elements(c,'f').length&&!value)throw Error('A formula has no saved value. Recalculate and save the workbook in Excel.');values[index]=type==='s'?(shared[Number(value)]??''):type==='inlineStr'?elements(c,'t').map(t=>t.textContent).join(''):value;}return {number:Number(row.getAttribute('r')),values,date1904:date1904==='1'||date1904==='true'};});
 }};
}
function dateValue(v,date1904){
 if(v==='')return '';
 if(/^\d+(\.\d+)?$/.test(v)){const n=Number(v);if(n<(date1904?0:1)||n>(date1904?2957003:2958465))throw Error('Date is outside Excel’s supported range.');if(!date1904&&Math.floor(n)===60)throw Error('Excel serial 60 represents a non-existent date.');const days=Math.floor(n)+(!date1904&&n<60?1:0);return new Date(Date.UTC(date1904?1904:1899,date1904?0:11,date1904?1:30)+days*86400000).toISOString().slice(0,10);}
 if(M.validDate(v))return v;
 const m=v.match(/^(\d{1,2})[-\s]([a-z]{3})[-\s](\d{4})$/i);if(m){const month=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(m[2].toLowerCase())+1;const s=`${m[3]}-${String(month).padStart(2,'0')}-${m[1].padStart(2,'0')}`;if(M.validDate(s))return s;}
 throw Error('Use an Excel date or YYYY-MM-DD (ambiguous dates are not imported).');
}
function validate(rows,key,existing=[]){
 const s=M.schemas[key],errors=[],warnings=[],records=[],duplicates=[];
 const headerIndex=rows.findIndex(r=>r.values.some(v=>String(v??'').trim()));if(headerIndex<0)throw Error('The worksheet is empty.');
 const header=rows[headerIndex].values.map(v=>String(v??'').trim()),seen=new Set(),mapping=[],extras=[];
 header.forEach((h,i)=>{if(!h)return;let n=norm(h);if(n==='imact')n='impact';if(seen.has(n))errors.push('Duplicate header: '+h);seen.add(n);const f=s.fields.find(f=>norm(f.label)===n);if(f)mapping.push({index:i,field:f});else extras.push({index:i,label:h});});
 if(!mapping.some(x=>x.field.key==='name'))errors.push('Required header is missing: '+s.fields.find(f=>f.key==='name').label+'. Check that this is the correct tracker template.');
 if(errors.length)return {errors,warnings,records,duplicates,mapping,extras,header};
 const missing=s.fields.filter(f=>!mapping.some(x=>x.field.key===f.key));if(missing.length)warnings.push('Optional columns not supplied: '+missing.map(f=>f.label).join(', ')+'.');if(extras.length)warnings.push('Additional columns will be preserved: '+extras.map(e=>e.label).join(', ')+'.');
 const identity=r=>(key==='milestones'?(r.category||'').trim().toLocaleLowerCase()+'\u0000':'')+r.name.trim().toLocaleLowerCase();
 const names=new Set(existing.filter(r=>!r.deletedAt).map(identity));let defaults=0;
 for(const row of rows.slice(headerIndex+1)){
  if(!row.values.some(v=>String(v??'').trim()))continue;
  const value=M.defaults(key);let valid=true;
  for(const {index,field}of mapping){let v=String(row.values[index]??'').trim();if(v.length>30000){errors.push(`Row ${row.number}: ${field.label} exceeds 30,000 characters.`);valid=false;continue;}
   if(field.type==='number'&&v&&(!Number.isFinite(Number(v))||Number(v)<0||Number(v)>100)){errors.push(`Row ${row.number}: Progress must be between 0 and 100.`);valid=false;}
   if(field.type==='date'&&v){try{v=dateValue(v,row.date1904);}catch(e){errors.push(`Row ${row.number}, ${field.label}: ${e.message}`);valid=false;}}
   if(field.type==='select'){if(!v){defaults++;v=field.choices[0];}else{const choice=field.choices.find(c=>c.toLowerCase()===v.toLowerCase());if(choice===undefined){errors.push(`Row ${row.number}: “${v}” is not a valid ${field.label}. Use ${field.choices.filter(Boolean).join(' / ')}.`);valid=false;}else v=choice;}}
   value[field.key]=v;
  }
  if(!value.name.trim()){errors.push(`Row ${row.number}: name/title is required.`);valid=false;}
  if(key==='actions'&&value.assignedDate&&value.closeDate&&value.closeDate<value.assignedDate){errors.push(`Row ${row.number}: Close Date precedes Assign Date.`);valid=false;}
  value.extraFields=Object.fromEntries(extras.map(e=>[e.label,String(row.values[e.index]??'')]));
  if(valid){const n=identity(value);const duplicate=names.has(n);if(duplicate)duplicates.push(row.number);names.add(n);records.push({values:value,row:row.number,duplicate});}
 }
 if(defaults)warnings.push(`${defaults} blank status/category cell(s) will use the default option.`);
 return {errors,warnings,records,duplicates,mapping,extras,header};
}
async function exportWorkbook(db,options={}){
 const page=options.page||'',scoped=Boolean(page);if(scoped&&!M.schemas[page]&&page!=='assets')throw Error('Unknown report page.');
 const selected=scoped&&M.schemas[page]?(options.records||M.active(db,page)):[],ids=new Set(selected.map(r=>r.id)),categories=new Set(selected.map(r=>r.category));
 const z=new JSZip(),rows=[],merges=[];let rowNo=0;
 const row=(values,style=3,height=36)=>{rowNo++;const cells=values.map((v,i)=>{if(v===undefined||v===null)return '';if(String(v).length>32767)throw Error('A field exceeds Excel’s cell limit. Export JSON for the complete snapshot.');return `<c r="${col(i)}${rowNo}" s="${style}" t="inlineStr"><is><t xml:space="preserve">${xml(v)}</t></is></c>`;}).join('');rows.push(`<row r="${rowNo}" ht="${height}" customHeight="1">${cells}</row>`);return rowNo;};
 const merged=(text,style,height)=>{const n=row([text,...Array(9).fill('')],style,height);merges.push(`A${n}:J${n}`);};
 merged('PULSE 5G  /  '+(scoped?(M.schemas[page]?.title||'Network Assets').toUpperCase():'PROJECT UPDATES'),1,42);
 merged('Project snapshot • Exported '+new Date().toLocaleString('en-GB',{timeZone:'Asia/Dubai'})+' GST (UTC+4) • Baseline: '+(db.baselineDate||'Not specified'),5,28);
 const completed=['actions','rfp','milestones'].flatMap(k=>M.active(db,k)).filter(M.finished).length;
 if(scoped)merged(options.scope||'Current page export',6,30);else merged(`${M.active(db,'actions').length} actions   •   ${M.active(db,'risks').filter(r=>r.status==='Open').length} open risks   •   ${M.active(db,'escalations').length} decisions   •   ${completed} completed actions / RFPs / milestones`,6,30);
 merged('Status counts describe the current saved records. Previously reported percentages are historical values, not current project completion.',5,28);
 for(const [key,s]of Object.entries(M.schemas).filter(([key])=>!scoped||key===page)){
  row([],3,12);const records=scoped?selected:M.active(db,key);merged(`${s.title.toUpperCase()}   /   ${records.length} records`,2,32);
  const fields=s.fields;row(['#',...fields.map(f=>f.label),'Updates / Reference'],4,30);
  records.forEach((r,i)=>{
   const ref=[r.remarks&&!fields.some(f=>f.key==='remarks')?r.remarks:'',r.expectedCompletion?'Previously reported expected completion: '+r.expectedCompletion:'',r.baselineProgress!=null?'Previously reported progress (27-Feb-2026): '+r.baselineProgress+'%':'',r.extraFields&&Object.keys(r.extraFields).length?'Additional fields: '+JSON.stringify(r.extraFields):''].filter(Boolean).join('\n');
   const vals=[String(i+1),...fields.map(f=>f.key==='progress'?String(PulseInsights.progress(r))+'%':r[f.key]||'—'),ref||`${r.updates.length} project updates`];
   const height=Math.min(300,Math.max(42,...vals.map(v=>Math.ceil(String(v).length/28)*14)));row(vals,i%2?7:3,height);
   for(const u of r.updates){merged('UPDATE • '+new Date(u.at).toLocaleString('en-GB',{timeZone:'Asia/Dubai'})+' GST'+(u.author?' • '+u.author:'')+' • '+r.name,8,26);merged(u.text,5,Math.min(409,Math.max(32,Math.ceil(u.text.length/120)*16)));}
  });if(!records.length)merged('No records',5,30);
 }
 if((!scoped||page==='milestones')&&db.milestoneCategorySources?.some(r=>!scoped||categories.has(r.category))){row([],3,12);merged('MILESTONE CATEGORY NOTES & HISTORY',2,32);for(const r of db.milestoneCategorySources.filter(r=>!scoped||categories.has(r.category))){merged(r.category+' • Original status: '+(r.status||'Not set')+' • Previously reported progress: '+(r.baselineProgress==null?'Not provided':r.baselineProgress+'%'),8,30);merged(r.remarks||'',5,Math.min(300,Math.max(40,(r.remarks||'').split('\n').length*18)));for(const u of r.updates||[]){merged('PRESERVED UPDATE • '+u.at+' • '+(u.author||''),8,26);merged(u.text,5,Math.min(409,Math.max(32,Math.ceil(u.text.length/120)*16)));}}}
 if(!scoped||page==='assets'){row([],3,12);merged('NETWORK ASSETS   /   INVENTORY · 27 FEB 2026',2,32);row(['Mobile sites','Count','Physical infrastructure','Count','Device mix','Share'],4,30);
 [['Shared outdoor','365','Shared mobile aggregation','71','Critical IoT','10%'],['Shared IBS','257','Dedicated mobile aggregation','31','Communication terminals','60%'],['Dedicated VVIP','140','Pulse aggregation DC','4','Streaming','10%'],['Devices','10,000','IP core sites','2','Voice','20%'],['','','Central data centers','2','','']].forEach(v=>row(v,3,40));}
 if(page!=='assets'){row([],3,12);merged(scoped?'PAGE CHANGE HISTORY':'CHANGE HISTORY & DELETED RECORDS',2,32);row(['Time (GST)','Tracker','Record','Change'],4,30);
 for(const a of db.audit.filter(a=>!scoped||a.collection===page&&ids.has(a.recordId))){const record=db.collections[a.collection]?.find(r=>r.id===a.recordId)||(db.milestoneCategorySources||[]).find(r=>r.id===a.recordId);const n=row([a.at?new Date(a.at).toLocaleString('en-GB',{timeZone:'Asia/Dubai'}):'',M.schemas[a.collection]?.short||a.collection||'',record?.name||'',a.text||''],5,48);merges.push(`D${n}:J${n}`);}
 if(!scoped)for(const [key,list]of Object.entries(db.collections)){if(!Array.isArray(list))continue;for(const r of list.filter(r=>r.deletedAt)){merged(`DELETED • ${M.schemas[key]?.short||key} • ${r.name}`,8,28);merged(JSON.stringify(r),5,Math.min(409,Math.max(48,Math.ceil(JSON.stringify(r).length/120)*16)));}}
 }
 z.file('[Content_Types].xml','<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>');
 z.file('_rels/.rels','<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>');
 z.file('xl/workbook.xml','<?xml version="1.0"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Project Updates" sheetId="1" r:id="rId1"/></sheets></workbook>');
 z.file('xl/_rels/workbook.xml.rels','<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>');
 const font=(size,color,bold)=>`<font><sz val="${size}"/><color rgb="FF${color}"/><name val="Aptos"/>${bold?'<b/>':''}</font>`;
 const fill=c=>`<fill><patternFill patternType="solid"><fgColor rgb="FF${c}"/><bgColor indexed="64"/></patternFill></fill>`;
 const xf=(fontId,fillId)=>`<xf numFmtId="0" fontId="${fontId}" fillId="${fillId}" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>`;
 z.file('xl/styles.xml',`<?xml version="1.0"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="6">${font(11,'202B3C',false)}${font(22,'FFFFFF',true)}${font(12,'FFFFFF',true)}${font(11,'506078',false)}${font(11,'202B3C',true)}${font(11,'A32540',true)}</fonts><fills count="7"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>${fill('141C2B')}${fill('CF2946')}${fill('E8EDF5')}${fill('F5F7FA')}${fill('FFF0F3')}</fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="9">${xf(0,0)}${xf(1,2)}${xf(2,3)}${xf(0,0)}${xf(4,4)}${xf(3,0)}${xf(4,4)}${xf(0,5)}${xf(5,6)}</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`);
 z.file('xl/worksheets/sheet1.xml',`<?xml version="1.0"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><dimension ref="A1:J${rowNo}"/><sheetViews><sheetView workbookViewId="0" showGridLines="0"><pane ySplit="4" topLeftCell="A5" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols><col min="1" max="1" width="23" customWidth="1"/><col min="2" max="2" width="42" customWidth="1"/><col min="3" max="3" width="30" customWidth="1"/><col min="4" max="4" width="25" customWidth="1"/><col min="5" max="5" width="46" customWidth="1"/><col min="6" max="7" width="23" customWidth="1"/><col min="8" max="10" width="25" customWidth="1"/></cols><sheetData>${rows.join('')}</sheetData><mergeCells count="${merges.length}">${merges.map(ref=>`<mergeCell ref="${ref}"/>`).join('')}</mergeCells><pageMargins left="0.25" right="0.25" top="0.5" bottom="0.5" header="0.2" footer="0.2"/><pageSetup orientation="landscape" paperSize="8" fitToWidth="1" fitToHeight="0"/></worksheet>`);
 return z.generateAsync({type:'blob',mimeType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',compression:'DEFLATE'});
}
root.PulseExcel={open,validate,dateValue,exportWorkbook};
})(typeof window==='undefined'?globalThis:window);
