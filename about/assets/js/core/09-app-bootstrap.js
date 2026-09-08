/**
 * 09-app-bootstrap.js
 * Seven-slide presentation shell with Coverage inserted as slide 2.
 */

function connectedEntitiesCard(){
 const ar=state.lang==='ar';
 const ce=ASSETS.connectedEntities||{};
 const mod=ce.mod||'assets/images/connected-entities/ministry-of-defence.png';
 const csc=ce.csc||'assets/images/connected-entities/cyber-security-council.png';
 return `<aside class="connectedEntitiesSideCard reveal" data-s="2" aria-label="Connected Entities"><div class="connectedEntitiesSideHead"><span class="connectedEntitiesSideDot"></span><div><strong>Connected Entities</strong><small>${ar?'الجهات المتصلة بالمنظومة':'Entities connected to the network'}</small></div></div><div class="connectedEntitiesSideLogos"><div class="connectedLogoTall mod"><img src="${assetUrl(mod)}" alt="${ar?'وزارة الدفاع':'Ministry of Defence'}"></div><div class="connectedLogoTall csc"><img src="${assetUrl(csc)}" alt="${ar?'مجلس الأمن السيبراني':'Cyber Security Council'}"></div></div></aside>`;
}
function capabilitiesHeader(){
 const ar=state.lang==='ar';
 return `<div class="header capabilitiesHeader"><div class="title reveal" data-s="1"><h2 class="titleWithDot">${esc(ar?'القدرات':'Capabilities')}</h2><p>${esc(ar?'نقاط القوة التشغيلية التي توفرها المنظومة.':'Operational strengths enabled by the solution.')}</p></div><div class="index reveal" data-s="2">${String(4).padStart(2,'0')} / ${String(TOTAL_SLIDES).padStart(2,'0')}</div></div>`;
}

function render(){
 const t=CONTENT[state.lang];
 document.body.classList.toggle('light',state.theme==='light');
 document.body.classList.toggle('rtl',state.lang==='ar');
 document.documentElement.lang=state.lang==='ar'?'ar':'en';
 document.documentElement.dir='ltr';
 document.title=state.lang==='ar'?'شبكة نبض الأمنية - الجيل الخامس':'Pulse 5G Network';
 document.getElementById('langBtn').textContent=state.lang==='en'?'ع':'EN';
 document.getElementById('langBtn').title=state.lang==='en'?'العربية':'الإنجليزية';
 document.getElementById('langBtn').setAttribute('aria-label',state.lang==='en'?'التبديل إلى العربية':'التبديل إلى الإنجليزية');
 document.getElementById('themeBtn').title=state.lang==='en'?'Theme':'السمة';
 document.getElementById('themeBtn').setAttribute('aria-label',state.lang==='en'?'Toggle theme':'تبديل السمة');
 document.getElementById('fullBtn').title=state.lang==='en'?'Fullscreen':'ملء الشاشة';
 document.getElementById('fullBtn').setAttribute('aria-label',state.lang==='en'?'Toggle fullscreen':'تبديل وضع ملء الشاشة');
 
 function syncEdgeNavGlyphs(){
  const left=document.getElementById('edgePrev')?.querySelector('span');
  const right=document.getElementById('edgeNext')?.querySelector('span');
  const ar=state.lang==='ar';
  if(left) left.textContent=ar?'‹':'‹';
  if(right) right.textContent=ar?'›':'›';
 }

 const edgePrev=document.getElementById('edgePrev'),edgeNext=document.getElementById('edgeNext');
 if(edgePrev)edgePrev.setAttribute('aria-label',state.lang==='ar'?'الشريحة التالية':'Previous slide');
 if(edgeNext)edgeNext.setAttribute('aria-label',state.lang==='ar'?'الشريحة السابقة':'Next slide');
 renderNav(t);
 syncEdgeNavGlyphs();
 slidesEl.innerHTML=`
${landingSlide(t)}
<section class="slide ${state.slide===1?'active':''}">${coverageSlide(t)}</section>
<section class="slide ${state.slide===2?'active':''}">${architectureSlide(t)}</section>
<section class="slide ${state.slide===3?'active':''}"><div class="frame"><div class="body capabilitiesBody">${capabilitiesHeader()}<div class="capabilitiesLayout">${connectedEntitiesCard()}<div class="cardGrid3 capabilitiesGrid">${t.caps.map((it,i)=>card(it,i)).join('')}</div></div></div></div></section>
<section class="slide ${state.slide===4?'active':''}">${whyCapabilitiesSlide(t)}</section>
<section class="slide ${state.slide===5?'active':''}">${pocSlide(t)}</section>
<section class="slide ${state.slide===6?'active':''}">${dashboardSlide(t)}</section>`;
 bindDynamic();
}

function bindDashboardTabs(){document.querySelectorAll('.dashTabBtn').forEach(b=>b.onclick=()=>{const next=+b.dataset.tab;if(next===state.dashTab)return;state.dashTab=next;document.querySelectorAll('.dashTabBtn').forEach((x,i)=>x.classList.toggle('active',i===state.dashTab));const root=document.getElementById('opsPortal')?.classList.contains('open')?document.getElementById('opsPortal'):document.querySelector('.slide.active');const sh=root?.querySelector('.dashboardShell');const pane=root?.querySelector('.dashPane');if(sh)sh.dataset.tab=state.dashTab;if(pane){pane.className='dashPane dashPane'+state.dashTab;pane.innerHTML=dashboardContent();requestAnimationFrame(()=>{initDashboardAnimations();bindOpsDrilldowns();});}});}
function bindDynamic(){bindDashboardTabs();bindCoverage();bindArchitecture();document.querySelectorAll('.js-open-ops-overlay').forEach(b=>b.onclick=()=>openOpsOverlay());}
function onSlideEnter(idx){clearInterval(window.__tw);if(idx===0){typewriterScript();startIntroAnimations();}if(idx===1)setTimeout(bindCoverage,30);if(idx===2)setTimeout(bindArchitecture,40);if(idx===5)setTimeout(initPocMap,50);}
function setActiveSlide(next,dir,instant=false){document.documentElement.setAttribute('data-navdir',String(dir));document.querySelectorAll('#slides>.slide').forEach((s,i)=>s.classList.toggle('active',i===next));state.slide=next;setDeckProgress();applyNavDepth();centerActiveNav(instant);syncNavSlider();onSlideEnter(next);requestAnimationFrame(fit);}
let __slideSwitchLock=false;
function go(i){const next=(i+TOTAL_SLIDES)%TOTAL_SLIDES;if(next===state.slide||__slideSwitchLock)return;closeOpsOverlay();__slideSwitchLock=true;const dir=next>state.slide?1:-1;navRail.dataset.dir=String(dir);navRail.classList.remove('navmoving');void navRail.offsetWidth;navRail.classList.add('navmoving');document.body.classList.remove('slide-switching');void document.body.offsetWidth;document.body.classList.add('slide-switching');setActiveSlide(next,dir,false);setTimeout(()=>{navRail.classList.remove('navmoving');document.body.classList.remove('slide-switching');__slideSwitchLock=false;},430);}
function toggleTheme(){state.theme=state.theme==='dark'?'light':'dark';render();}
function toggleLang(){state.lang=state.lang==='en'?'ar':'en';render();}
function toggleFullscreen(){if(!document.fullscreenElement)document.documentElement.requestFullscreen?.();else document.exitFullscreen?.();}

navRail.addEventListener('wheel',e=>{if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){navRail.scrollLeft+=e.deltaY*.7;e.preventDefault();}},{passive:false});
document.getElementById('themeBtn').onclick=toggleTheme;
document.getElementById('langBtn').onclick=toggleLang;
document.getElementById('fullBtn').onclick=toggleFullscreen;

// In Arabic, physical left is next and physical right is previous to align with RTL flow.
const __edgePrev=document.getElementById('edgePrev'),__edgeNext=document.getElementById('edgeNext');
if(__edgePrev)__edgePrev.onclick=()=>go(state.lang==='ar'?state.slide+1:state.slide-1);
if(__edgeNext)__edgeNext.onclick=()=>go(state.lang==='ar'?state.slide-1:state.slide+1);

document.addEventListener('keydown',e=>{
 if(e.target.closest('input,textarea,select,[contenteditable=true]'))return;
 if(e.key==='Escape'){
   if(document.querySelector('#opsPortal.open .opsDrilldown.open')){closeOpsDrilldown();return;}
   if(document.querySelector('#opsPortal.open')){closeOpsOverlay();return;}
 }
 if(e.key==='ArrowRight')go(state.lang==='ar'?state.slide-1:state.slide+1);
 if(e.key==='ArrowLeft')go(state.lang==='ar'?state.slide+1:state.slide-1);
 if(e.key==='PageDown'||e.key===' ')go(state.slide+1);
 if(e.key==='PageUp')go(state.slide-1);
 if(e.key.toLowerCase()==='d')toggleTheme();
 if(e.key.toLowerCase()==='l')toggleLang();
 if(e.key.toLowerCase()==='f')toggleFullscreen();
});

window.addEventListener('resize',()=>{fit();centerActiveNav(true);syncNavSlider();});
if(window.visualViewport)window.visualViewport.addEventListener('resize',()=>{fit();centerActiveNav(true);syncNavSlider();});
document.addEventListener('fullscreenchange',()=>requestAnimationFrame(()=>{fit();centerActiveNav(true);syncNavSlider();}));
window.go=go;window.toggleFullscreen=toggleFullscreen;window.openOpsOverlay=openOpsOverlay;window.closeOpsOverlay=closeOpsOverlay;
const __baseRender=render;render=function(){__baseRender();setTimeout(()=>{onSlideEnter(state.slide);centerActiveNav(true);syncNavSlider();},60)};
render();requestAnimationFrame(()=>{fit();centerActiveNav(true);syncNavSlider();});setTimeout(()=>{fit();centerActiveNav(true);syncNavSlider();},120);
