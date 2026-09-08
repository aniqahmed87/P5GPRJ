/**
 * 01-foundation.js
 * Core state, paths, layout scaling, generic card helpers and global dashboard portal helpers.
 *
 * Advanced file: normal wording/card edits should be made in
 * /assets/config/presentation-content.js instead.
 */

const STAGE_W=1440,STAGE_H=900,NAV_H=74; const TOTAL_SLIDES=7;
const IS_IOS=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const IS_LOCAL_CONTEXT=!/^https?:$/.test(location.protocol)||location.href.indexOf('external-file')>-1;
const IS_HOSTED_CONTEXT=/^https?:$/.test(location.protocol);
const USE_OFFLINE_MAP=false; // Hosted branch: online map tiles are primary, embedded maps remain the fallback.
if(IS_IOS||IS_LOCAL_CONTEXT)document.documentElement.classList.add('ios-lite');if(IS_HOSTED_CONTEXT)document.documentElement.classList.add('hosted-live');
let state={lang:'en',theme:'dark',slide:1, dashTab:0};
const slidesEl=document.getElementById('slides'), navRail=document.getElementById('navRail');
function assetUrl(path){if(!path)return '';try{return new URL(path,document.baseURI).href}catch(_){return path}}
function cssAsset(path){const u=assetUrl(path);return u?`url('${u.replace(/'/g,'%27')}')`:'none'}
function icon(name){return ASSETS.icons[name]?`<img src="${assetUrl(ASSETS.icons[name])}" alt="" decoding="async" draggable="false">`:''}
function esc(s){return String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}
function introCardImageFor(iconName,idx){const map={users:'adSkyline',tower:'kcapCity',globe2:'adMobility',server:'kcap_core_clean',shield:'security',phone:'kcapVoice',database:'operations',building:'adCorniche',lock:'security',network:'kcapMap'};const key=map[iconName]||['adSkyline','kcapCity','adMobility','kcap_core_clean','security','kcapVoice','kcapMap','operations'][idx%8];return ASSETS[key]||ASSETS.adHero||ASSETS.heroIntro;}
function syncNavSlider(){requestAnimationFrame(()=>{const rail=navRail; if(!rail) return; let slider=rail.querySelector('.navActiveSlider'); if(!slider){slider=document.createElement('div'); slider.className='navActiveSlider'; rail.appendChild(slider);} const active=rail.querySelector('.railbtn.active'); if(!active){slider.style.opacity='0'; return;} slider.style.opacity='1'; slider.style.width=active.offsetWidth+'px'; slider.style.transform=`translateX(${active.offsetLeft}px)`;});}
function setDeckProgress(){
 const wrap=document.getElementById('deckProgressBar'); if(!wrap) return;
 const span=wrap.querySelector('span'); if(!span) return;
 const rtl=state.lang==='ar';
 // Keep the progress fill physically anchored to the reading start edge.
 // English grows left -> right; Arabic grows right -> left.
 span.dataset.flow=rtl?'rtl':'ltr';
 span.style.setProperty('position','absolute','important');
 span.style.setProperty('top','0','important');
 span.style.setProperty('bottom','0','important');
 span.style.setProperty('margin','0','important');
 span.style.setProperty('left',rtl?'auto':'0','important');
 span.style.setProperty('right',rtl?'0':'auto','important');
 span.style.setProperty('display','block','important');
 span.style.setProperty('opacity','1','important');
 span.style.setProperty('visibility','visible','important');
 const pct=((state.slide+1)/TOTAL_SLIDES)*100;
 const wrapWidth=Math.max(1,wrap.getBoundingClientRect().width||wrap.clientWidth||1);
 const targetPx=wrapWidth*(pct/100);
 const currentPx=parseFloat(getComputedStyle(span).width)||0;
 if(span.__deckRaf){cancelAnimationFrame(span.__deckRaf); span.__deckRaf=null;}
 const delta=targetPx-currentPx;
 const distance=Math.abs(delta);
 const duration=Math.max(680,Math.min(1120,680+distance*.55));
 const start=performance.now();
 span.style.width=currentPx+'px';
 const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
 const tick=now=>{
   const t=Math.min(1,(now-start)/duration);
   const value=currentPx+delta*ease(t);
   span.style.width=value+'px';
   wrap.style.setProperty('--deck-progress',((value/wrapWidth)*100).toFixed(3)+'%');
   if(t<1){span.__deckRaf=requestAnimationFrame(tick)}
   else{span.style.width=pct.toFixed(2)+'%';wrap.style.setProperty('--deck-progress',pct.toFixed(2)+'%');span.__deckRaf=null;}
 };
 span.__deckRaf=requestAnimationFrame(tick);
}
function buildOpsPortal(){const host=document.getElementById('opsPortal');if(!host)return null;const t=CONTENT[state.lang],tabs=t.dashboard.tabs,en=state.lang==='en';host.innerHTML=`<div class="opsPortalBackdrop"></div><section class="opsPortalPanel" role="dialog" aria-modal="true" aria-label="${esc(t.dashboard.title)}"><div class="opsOverlayHeader"><div><div class="eyebrow">${esc((t.dashboard.launcher||{}).portalEyebrow||'')}</div><h3>${esc(t.dashboard.title)}</h3></div><div class="opsOverlayHeaderActions"><button class="opsOverlayX js-close-ops-overlay" aria-label="Close">×</button></div></div>${dashboardToolbar()}${opsTopTicker()}<div class="tabs dashboardTabs">${tabs.map((x,i)=>`<button class="dashTabBtn ${i===state.dashTab?'active':''}" data-tab="${i}"><span class="tabNo">0${i+1}</span><span>${esc(x)}</span></button>`).join('')}</div><div class="opsPortalBody"><div class="dashboardShell portalMode" data-tab="${state.dashTab}"><div class="dashPane dashPane${state.dashTab}">${dashboardContent()}</div></div><div class="opsDrilldown" aria-hidden="true"></div></div></section>`;return host;}
function openOpsOverlay(){const host=buildOpsPortal();if(!host)return;host.classList.add('open');host.setAttribute('aria-hidden','false');document.body.classList.add('ops-overlay-open');const close=host.querySelector('.js-close-ops-overlay');if(close)close.onclick=()=>closeOpsOverlay();bindDashboardTabs();requestAnimationFrame(()=>{initDashboardAnimations();bindOpsDrilldowns();});}
function closeOpsOverlay(){const host=document.getElementById('opsPortal');if(!host)return;closeOpsDrilldown();host.classList.remove('open');host.setAttribute('aria-hidden','true');document.body.classList.remove('ops-overlay-open');setTimeout(()=>{if(!host.classList.contains('open'))host.innerHTML='';},220);}
function fit(){const stage=document.querySelector('.stage'); const vp=document.getElementById('viewport'); if(!stage||!vp)return; const r=stage.getBoundingClientRect(); const pad=Math.max(8,Math.min(18,r.width*.012)); const aw=Math.max(1,r.width-pad*2), ah=Math.max(1,r.height-pad*2); const s=Math.min(aw/STAGE_W,ah/STAGE_H); const x=(r.width-STAGE_W*s)/2, y=(r.height-STAGE_H*s)/2; vp.style.left='0px'; vp.style.top='0px'; vp.style.transformOrigin='0 0'; vp.style.transform=`translate3d(${x}px,${y}px,0) scale(${s})`; }
function hdr(ey,title,sub,idx){return `<div class="header"><div class="title reveal" data-s="1"><h2 class="titleWithDot">${esc(title)}</h2><p>${esc(sub)}</p></div><div class="index reveal" data-s="2">${String(idx+1).padStart(2,'0')} / ${String(TOTAL_SLIDES).padStart(2,'0')}</div></div>`;}
function metric(v,l,i,s){return `<div class="metric reveal" data-s="${s}"><div class="metricIcon">${icon(i)}</div><div class="metricVal">${esc(v)}</div><div class="metricLbl">${esc(l)}</div></div>`}
function mini(v,t,i,s){return `<div class="mini reveal" data-s="${s}"><div class="miniTop"><span class="miniNum">${esc(v)}</span>${icon(i)}</div><div class="miniTxt">${esc(t)}</div></div>`}
function introMetric(v,l,i,s){const numeric=/^\d[\d,]*$/.test(String(v));const cls=numeric?'reveal intro-animate':'';return `<div class="metric intro-metric photo-card ${cls}" style="--photoimg:${cssAsset(introCardImageFor(i,s))}" data-s="${s}"><div class="metricVal intro-count ${numeric?'is-number':'is-text'}" data-final="${esc(v)}">${numeric?'0':esc(v)}</div><div class="metricLbl">${esc(l)}</div></div>`}
function introMini(v,t,i,s){return `<div class="mini intro-mini photo-card reveal intro-animate" style="--photoimg:${cssAsset(introCardImageFor(i,s))}" data-s="${s}"><div class="miniTop"><span class="miniBadge">${icon(i)}</span><span class="miniNum highlight-type" data-text="${esc(t)}"></span></div></div>`}
function cardImageFor(iconName,idx){const map={rocket:'kcapCity',shield:'kcapArch',route:'kcapMap',wifi:'kcap_ran_clean',lock:'kcap_core_clean',star:'heroIntro',tachometer:'kcapCity','line-chart':'kcapArch',cloud:'kcap_share_clean',mobile:'kcap_voice_clean',refresh:'kcapMap',sitemap:'kcap_core_clean',forward:'kcap_subs_clean',signal:'kcap_ran_clean'};const key=map[iconName]||['kcapCity','kcapArch','kcapMap','kcapVoice'][idx%4];return ASSETS[key]||ASSETS.heroIntro;}
function card(it,idx){const chips=(Array.isArray(it[3])?it[3]:[]).map(x=>`<span class="infochip">${esc(x)}</span>`).join('');const subtag=it[4]||it[0].split(' ')[0]; return `<div class="card reveal" data-s="${(idx%8)+1}" style="--cardimg:${cssAsset(cardImageFor(it[2],idx))}"><div class="cardVisual">${icon(it[2])}</div><div class="cardTagRow"><div class="tag">${String(idx+1).padStart(2,'0')}</div><div class="subtag">${esc(subtag)}</div></div><h3>${esc(it[0])}</h3><p>${esc(it[1])}</p>${chips?`<div class="subchips">${chips}</div>`:''}<div class="line"></div></div>`}
