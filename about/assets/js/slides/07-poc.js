/**
 * 07-poc.js
 * Slide 8 POC map renderer and map interaction.
 *
 * Advanced file: normal wording/card edits should be made in
 * /assets/config/presentation-content.js instead.
 */

function lineElt(x1,y1,x2,y2,dur){const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),ang=Math.atan2(dy,dx)*180/Math.PI; return `<div class="mline" style="left:${x1}%;top:${y1}%;width:${len}%;transform:rotate(${ang}deg);animation-duration:${dur}s"></div>`}
function pocMapControls(en){return `<div class="pocMapControls pocMapControlsOverlay"><select id="pocMapFilter" class="pocMapFilter" aria-label="${en?'Map filter':'تصفية الخريطة'}"><option value="all">${en?'All elements':'جميع العناصر'}</option><option value="core">${en?'Core / DC anchor':'نقطة مركز البيانات الرئيسية'}</option><option value="active">${en?'Active RAN site':'موقع اتصال لاسلكي نشط'}</option><option value="planned">${en?'Planned RAN site':'موقع اتصال لاسلكي مخطط'}</option></select><label class="pocConnectionToggle"><input id="pocShowConnections" type="checkbox" checked><span>${en?'Show connections':'إظهار المسارات'}</span></label><button id="pocMapReset" class="pocMapReset" type="button" aria-label="Reset">↺</button></div>`}
function pocGetFilter(){return document.getElementById('pocMapFilter')?.value||'all'}
function pocConnectionsEnabled(){return document.getElementById('pocShowConnections')?.checked!==false}
function pocMatchesSite(site,filter){return filter==='all'||site?.type===filter}
function pocShouldShowLink(link,siteMap,filter){const a=siteMap[link.from],b=siteMap[link.to];return !!(a&&b&&pocMatchesSite(a,filter)&&pocMatchesSite(b,filter))}
function pocBindMapControls(apply,resetView){const sel=document.getElementById('pocMapFilter'),chk=document.getElementById('pocShowConnections'),reset=document.getElementById('pocMapReset');if(sel&&sel.dataset.bound!=='1'){sel.dataset.bound='1';sel.addEventListener('change',e=>{e.stopPropagation();apply&&apply();});sel.addEventListener('click',e=>e.stopPropagation());sel.addEventListener('pointerdown',e=>e.stopPropagation())}if(chk&&chk.dataset.bound!=='1'){chk.dataset.bound='1';chk.addEventListener('change',e=>{e.stopPropagation();apply&&apply();});chk.addEventListener('click',e=>e.stopPropagation());chk.addEventListener('pointerdown',e=>e.stopPropagation())}if(reset&&reset.dataset.bound!=='1'){reset.dataset.bound='1';reset.addEventListener('click',e=>{e.stopPropagation();if(sel)sel.value='all';if(chk)chk.checked=true;apply&&apply();resetView&&resetView();});reset.addEventListener('pointerdown',e=>e.stopPropagation())}}
function pocSlide(t){const en=state.lang==='en', p=t.poc, sites=p.sites||[]; return `<div class="frame"><div class="body">${hdr(en?'POC Connectivity Footprint':'نطاق ربط منظومة التشغيل', p.title, p.subtitle,5)}<div class="pocStage"><div class="pocMapPanel panel"><div class="pocTopbar"><div class="pocChips"><span class="pocChip map"><span class="dot"></span>${en?'Interactive map':'خريطة تفاعلية'}</span><span class="pocChip active"><span class="dot"></span>${en?'Active links':'مسارات ربط نشطة'}</span><span class="pocChip planned"><span class="dot"></span>${en?'Planned expansion':'توسيع مخطط'}</span></div><div class="pocChips"><span class="pocChip"><span class="dot"></span>${en?'Abu Dhabi':'أبوظبي'}</span></div></div><div class="pocMapShell">${pocMapControls(en)}<div id="pocMapCanvas"></div><svg id="pocMapOverlay" class="pocMapOverlay" aria-hidden="true"></svg><div class="pocMapFrame"></div><div class="pocMapFooter"><div class="pocLegend"><span class="pocLegendItem"><span class="pocLegendSwatch"></span>${en?'Core / DC anchor':'نقطة مركز البيانات الرئيسية'}</span><span class="pocLegendItem"><span class="pocLegendSwatch active"></span>${en?'Active RAN site':'موقع اتصال لاسلكي نشط'}</span><span class="pocLegendItem"><span class="pocLegendSwatch planned"></span>${en?'Planned RAN site':'موقع اتصال لاسلكي مخطط'}</span><span class="pocLegendItem"><span class="pocLegendSwatch link"></span>${en?'Animated transport link':'مسار نقل بيانات متحرك'}</span></div><div class="pocMapHint">${esc(p.summary||'')}<br><span style="opacity:.72">${en?'Tip: use the map controls to zoom, and tap any marker to inspect the site.':'ملاحظة: يمكن استخدام أدوات الخريطة للتكبير والضغط على أي مؤشر لعرض تفاصيل الموقع.'}</span></div></div></div></div><div class="pocInfoCol"><div class="panel pocSnapshotPanel"><h2 class="pocPanelTitle">${en?'POC Snapshot':'ملخص المواقع التجريبية'}</h2><div class="pocStats">${(p.stats||[]).map(s=>`<div class="pocStat"><div class="val">${esc(s[0])}</div><div class="lbl">${esc(s[1])}</div></div>`).join('')}</div></div><div class="panel pocSitesPanel"><h2 class="pocPanelTitle">${en?'Mapped Locations':'المواقع المحددة على الخريطة'}</h2><div class="pocSiteList">${sites.map(s=>`<div class="pocSiteItem ${esc(s.type)}"><div class="pocSiteTop"><div><div class="pocSiteName">${esc(s.name)}</div><div class="pocSiteDesc">${esc(s.desc)}</div></div><span class="pocRole ${esc(s.type)}">${esc(s.role||s.status||'')}</span></div><div class="pocSiteMeta">${esc(s.status||'')}</div></div>`).join('')}</div></div></div></div></div></div>`}

const POC_OFFLINE_POS={
'Apollo DC':{x:72,y:56},'Al Khaznah DC':{x:54,y:64},'Mubadala':{x:31,y:43},'MOD HQ':{x:43,y:64}
};
const __pocLeaflet={promise:null};
function loadLeaflet(){
 if(window.L&&window.L.map)return Promise.resolve(window.L);
 if(__pocLeaflet.promise)return __pocLeaflet.promise;
 const cssHref='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
 const jsSrc='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
 if(!document.querySelector('link[data-poc-leaflet]')){const l=document.createElement('link');l.rel='stylesheet';l.href=cssHref;l.setAttribute('data-poc-leaflet','1');document.head.appendChild(l);}
 __pocLeaflet.promise=new Promise((resolve,reject)=>{
   let settled=false;
   let timer;
   const finish=(ok,value)=>{if(settled)return;settled=true;clearTimeout(timer);ok?resolve(value):reject(value);};
   timer=setTimeout(()=>finish(false,new Error('Leaflet load timeout')),4500);
   const done=()=>window.L&&window.L.map?finish(true,window.L):finish(false,new Error('Leaflet failed to load'));
   const existing=document.querySelector('script[data-poc-leaflet]');
   if(existing){if(existing.dataset.loaded==='1')return done();existing.addEventListener('load',done,{once:true});existing.addEventListener('error',()=>finish(false,new Error('Leaflet script load failed')),{once:true});return;}
   const scr=document.createElement('script');scr.src=jsSrc;scr.defer=true;scr.setAttribute('data-poc-leaflet','1');scr.onload=()=>{scr.dataset.loaded='1';done();};scr.onerror=()=>finish(false,new Error('Leaflet script load failed'));document.head.appendChild(scr);
 }).catch(err=>{__pocLeaflet.promise=null;throw err;});
 return __pocLeaflet.promise;
}
function pocPopupHTML(site){return `<div class="pocPopup"><h4>${esc(site.name)}</h4><div class="role">${esc(site.role||site.status||'')}</div><p>${esc(site.desc||'')}</p></div>`}
function initOfflinePocMap(host,overlay,p){
 overlay.innerHTML='';
 const fallback=state.theme==='dark'?ASSETS.mapDark:ASSETS.mapLight;
 const sites=p.sites||[];
 const linkPaths=(p.links||[]).map((link,idx)=>{const a=POC_OFFLINE_POS[link.from],b=POC_OFFLINE_POS[link.to];if(!a||!b)return'';const mx=(a.x+b.x)/2,my=(a.y+b.y)/2+(idx%2===0?-4:4),from=esc(link.from),to=esc(link.to);return `<g class="offlinePocLink" data-from="${from}" data-to="${to}"><path class="oGlow ${link.type}" d="M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}"></path><path class="oDash ${link.type}" d="M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}"></path></g>`}).join('');
 const markers=sites.map(s=>{const q=POC_OFFLINE_POS[s.name]||{x:50,y:50};return `<div class="offlinePocMarker" style="left:${q.x}%;top:${q.y}%" data-name="${esc(s.name)}" data-type="${esc(s.type)}"><div class="offlinePocDot ${esc(s.type)}"></div><div class="offlinePocLabel">${esc(s.name)}</div></div>`}).join('');
 host.innerHTML=`<div class="offlinePocViewport"><div class="offlinePocLayer"><img src="${fallback}" alt=""><div class="offlinePocShade"></div><svg class="offlinePocSvg" viewBox="0 0 100 100" preserveAspectRatio="none">${linkPaths}</svg>${markers}</div><div class="offlinePocBadge">${state.lang==='en'?'Offline presentation map':'خريطة العرض دون اتصال'}</div><div class="offlinePocControls"><button class="offlinePocCtrl" data-z="1">+</button><button class="offlinePocCtrl" data-z="-1">−</button><button class="offlinePocCtrl" data-z="0">↺</button></div></div>`;
 const siteMap=sites.reduce((a,s)=>(a[s.name]=s,a),{});
 const applyPocOfflineFilter=()=>{const filter=pocGetFilter(),show=pocConnectionsEnabled();host.querySelectorAll('.offlinePocMarker').forEach(m=>{m.hidden=!(filter==='all'||m.dataset.type===filter)});host.querySelectorAll('.offlinePocLink').forEach(g=>{const link={from:g.dataset.from,to:g.dataset.to};g.style.display=(show&&pocShouldShowLink(link,siteMap,filter))?'':'none'});};
 pocBindMapControls(applyPocOfflineFilter,()=>{scale=1;tx=0;ty=0;apply();});applyPocOfflineFilter();
 const vp=host.querySelector('.offlinePocViewport'),layer=host.querySelector('.offlinePocLayer');let scale=1,tx=0,ty=0,drag=false,sx=0,sy=0,stx=0,sty=0;
 const apply=()=>{layer.style.transform=`translate3d(${tx}px,${ty}px,0) scale(${scale})`};
 host.querySelectorAll('.offlinePocCtrl').forEach(b=>b.onclick=e=>{e.stopPropagation();const z=+b.dataset.z;if(z===0){scale=1;tx=0;ty=0}else scale=Math.max(1,Math.min(2.3,scale+(z>0?.2:-.2)));apply()});
 vp.addEventListener('pointerdown',e=>{drag=true;sx=e.clientX;sy=e.clientY;stx=tx;sty=ty;try{vp.setPointerCapture(e.pointerId)}catch(_){}});
 vp.addEventListener('pointermove',e=>{if(!drag)return;tx=stx+(e.clientX-sx);ty=sty+(e.clientY-sy);apply()});
 const stop=()=>drag=false;vp.addEventListener('pointerup',stop);vp.addEventListener('pointercancel',stop);
 vp.addEventListener('wheel',e=>{e.preventDefault();scale=Math.max(1,Math.min(2.3,scale+(e.deltaY<0?.12:-.12)));apply()},{passive:false});
 host.dataset.pocMode='offline';
}
function initOnlinePocMap(host,overlay,p){
 const fallback=state.theme==='dark'?ASSETS.mapDark:ASSETS.mapLight;host.style.backgroundImage=cssAsset(fallback);
 host.innerHTML='<div class="osmTileLayer"></div><div class="osmMapShade"></div><div class="osmOverlayLayer"></div><div class="osmAttribution">© OpenStreetMap contributors</div><div class="osmControls"><button class="osmCtrl" data-z="1">+</button><button class="osmCtrl" data-z="-1">−</button></div>';
 const tileLayer=host.querySelector('.osmTileLayer'),markerLayer=host.querySelector('.osmOverlayLayer');let zoom=12,dragging=false,start=null,startCenter=null;
 const sites=p.sites||[],siteMap=sites.reduce((a,s)=>(a[s.name]=s,a),{});const avg={lat:sites.reduce((a,s)=>a+s.lat,0)/Math.max(1,sites.length),lon:sites.reduce((a,s)=>a+s.lng,0)/Math.max(1,sites.length)};let center={lat:avg.lat,lon:avg.lon};
 function draw(){const w=host.clientWidth,h=host.clientHeight,filter=pocGetFilter(),showLinks=pocConnectionsEnabled();if(!w||!h)return;tileLayer.innerHTML='';markerLayer.innerHTML='';overlay.innerHTML='';const cp=osmProject(center.lat,center.lon,zoom);const minX=cp.x-w/2-256,maxX=cp.x+w/2+256,minY=cp.y-h/2-256,maxY=cp.y+h/2+256;const tminX=Math.floor(minX/256),tmaxX=Math.floor(maxX/256),tminY=Math.floor(minY/256),tmaxY=Math.floor(maxY/256);
  for(let x=tminX;x<=tmaxX;x++)for(let y=tminY;y<=tmaxY;y++){const img=document.createElement('img');img.className='osmTile';img.draggable=false;img.src=`https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;img.style.left=(x*256-cp.x+w/2)+'px';img.style.top=(y*256-cp.y+h/2)+'px';img.onerror=()=>img.remove();tileLayer.appendChild(img)}
  const pts={};sites.forEach(s=>{if(!pocMatchesSite(s,filter))return;const q=osmProject(s.lat,s.lng,zoom);const px=q.x-cp.x+w/2,py=q.y-cp.y+h/2;pts[s.name]={x:px,y:py};const mk=document.createElement('button');mk.type='button';mk.className='siteMarker '+s.type;mk.style.left=px+'px';mk.style.top=py+'px';mk.innerHTML='<div class="siteDot"></div><div class="siteLabel">'+esc(s.name)+'</div>';mk.onclick=e=>{e.stopPropagation();showPocMiniPopup(host,s,px,py)};markerLayer.appendChild(mk)});
  const svg=[];if(showLinks)(p.links||[]).forEach((link,idx)=>{if(!pocShouldShowLink(link,siteMap,filter))return;const a=pts[link.from],b=pts[link.to];if(!a||!b)return;const dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len,bend=Math.min(32,Math.max(12,len*.08))*(idx%2===0?1:-1),c1x=a.x+dx*.32+nx*bend,c1y=a.y+dy*.18+ny*bend,c2x=a.x+dx*.68+nx*bend,c2y=a.y+dy*.82+ny*bend,d=`M ${a.x} ${a.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${b.x} ${b.y}`;svg.push(`<path class="route-glow ${link.type}" d="${d}"></path><path class="route-dash ${link.type}" d="${d}"></path>`)});overlay.setAttribute('viewBox',`0 0 ${w} ${h}`);overlay.innerHTML=svg.join('');
 }
 host.querySelectorAll('.osmCtrl').forEach(b=>b.onclick=e=>{e.stopPropagation();zoom=Math.max(9,Math.min(15,zoom+Number(b.dataset.z)));requestAnimationFrame(draw)});
 host.addEventListener('pointerdown',e=>{dragging=true;start={x:e.clientX,y:e.clientY};startCenter=osmProject(center.lat,center.lon,zoom);try{host.setPointerCapture(e.pointerId)}catch(_){}});host.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;center=osmUnproject(startCenter.x-dx,startCenter.y-dy,zoom);draw()});host.addEventListener('pointerup',()=>dragging=false);host.addEventListener('pointercancel',()=>dragging=false);host.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(9,Math.min(15,zoom+(e.deltaY<0?1:-1)));draw()},{passive:false});pocBindMapControls(draw,()=>{center={lat:avg.lat,lon:avg.lon};zoom=12;draw();});draw();host.dataset.pocMode='online';host.__pocDraw=draw;
}
function showPocMiniPopup(host,site,x,y){host.querySelectorAll('.pocMiniPopup').forEach(n=>n.remove());const d=document.createElement('div');d.className='pocMiniPopup';d.style.position='absolute';d.style.zIndex='70';d.style.left=Math.min(host.clientWidth-230,Math.max(12,x+14))+'px';d.style.top=Math.min(host.clientHeight-120,Math.max(12,y-70))+'px';d.style.width='215px';d.style.padding='12px';d.style.borderRadius='14px';d.style.background='rgba(7,12,20,.88)';d.style.border='1px solid rgba(255,255,255,.10)';d.style.color='#f5f7fb';d.style.boxShadow='0 14px 28px rgba(0,0,0,.24)';d.innerHTML=pocPopupHTML(site);host.appendChild(d);setTimeout(()=>{const close=()=>d.remove();host.addEventListener('pointerdown',close,{once:true,capture:true})},20)}
function initPocMap(){
 // Initialize by DOM presence rather than a hard-coded slide number.
 // This keeps the OSM map working if slides are inserted or reordered.
 const host=document.getElementById('pocMapCanvas');
 const overlay=document.getElementById('pocMapOverlay');
 if(!host||!overlay)return;
 const p=CONTENT[state.lang].poc;
 if(window.__pulsePocMap){try{window.__pulsePocMap.off();window.__pulsePocMap.remove();}catch(_){ }window.__pulsePocMap=null;}
 host.innerHTML='';overlay.innerHTML='';host.style.backgroundImage='none';delete host.dataset.pocMode;delete host.__pocDraw;
 loadLeaflet().then(L=>{
   const map=L.map(host,{zoomControl:false,attributionControl:false,scrollWheelZoom:true,dragging:true,doubleClickZoom:true,touchZoom:true,boxZoom:false,tap:true,preferCanvas:true});
   window.__pulsePocMap=map;
   L.control.zoom({position:'bottomright'}).addTo(map);
   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,subdomains:'abc',attribution:'© OpenStreetMap contributors'}).addTo(map);
   const siteMap={},markerRecords=[];
   const allSites=(p.sites||[]);
   const bounds=L.latLngBounds(allSites.map(s=>[s.lat,s.lng]));
   map.fitBounds(bounds.pad(.08),{padding:[28,28]});
   allSites.forEach(site=>{
     siteMap[site.name]=site;
     const marker=L.marker([site.lat,site.lng],{icon:L.divIcon({className:'pocDivIcon',html:`<div class="poc-marker ${site.type}"><span></span></div>`,iconSize:[20,20],iconAnchor:[10,10]})}).addTo(map);markerRecords.push({site,marker});
     marker.bindPopup(pocPopupHTML(site),{offset:[0,-10],autoPanPadding:[18,18]});
     marker.bindTooltip(site.name,{permanent:false,direction:'top',offset:[0,-16],className:'pocTip'});
   });
   function renderOverlay(){
     if(!window.__pulsePocMap||!document.body.contains(host))return;
     const size=map.getSize(),filter=pocGetFilter(),showLinks=pocConnectionsEnabled();
     overlay.setAttribute('viewBox',`0 0 ${size.x} ${size.y}`);
     overlay.setAttribute('width',size.x);
     overlay.setAttribute('height',size.y);
     const parts=[];
     if(showLinks)(p.links||[]).forEach((link,idx)=>{
       if(!pocShouldShowLink(link,siteMap,filter))return;
       const a=siteMap[link.from],b=siteMap[link.to];if(!a||!b)return;
       const pa=map.latLngToContainerPoint([a.lat,a.lng]);
       const pb=map.latLngToContainerPoint([b.lat,b.lng]);
       const dx=pb.x-pa.x,dy=pb.y-pa.y,len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len;
       const bend=Math.min(34,Math.max(16,len*.08))*(idx%2===0?1:-1);
       const c1x=pa.x+dx*.32+nx*bend,c1y=pa.y+dy*.18+ny*bend,c2x=pa.x+dx*.68+nx*bend,c2y=pa.y+dy*.82+ny*bend;
       const d=`M ${pa.x.toFixed(1)} ${pa.y.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${pb.x.toFixed(1)} ${pb.y.toFixed(1)}`;
       parts.push(`<path class="route-glow ${link.type}" d="${d}"></path>`);
       parts.push(`<path class="route-dash ${link.type}" d="${d}"></path>`);
     });
     overlay.innerHTML=parts.join('');
   }
   const applyPocLeafletFilter=()=>{const filter=pocGetFilter();markerRecords.forEach(({site,marker})=>{const on=pocMatchesSite(site,filter);if(on&&!map.hasLayer(marker))marker.addTo(map);else if(!on&&map.hasLayer(marker))map.removeLayer(marker);});renderOverlay();};
   pocBindMapControls(applyPocLeafletFilter,()=>{map.fitBounds(bounds.pad(.08),{padding:[28,28]});setTimeout(renderOverlay,80);});
   map.on('zoom move resize',renderOverlay);
   map.whenReady(()=>{applyPocLeafletFilter();setTimeout(renderOverlay,80);});
   setTimeout(()=>{map.invalidateSize();renderOverlay();},220);
  }).catch(err=>{
    console.warn('Leaflet unavailable; using the built-in POC map runtime.',err);
    if(navigator.onLine) initOnlinePocMap(host,overlay,p); else initOfflinePocMap(host,overlay,p);
  });
}
