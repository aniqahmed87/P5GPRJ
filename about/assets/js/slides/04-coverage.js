/**
 * Slide 2 — Coverage
 * v58 selector layout: one active map with left-side coverage selector.
 */
function coverageSlide(t){
  const en=state.lang==='en', C=t.coverage||{};
  const items=[
    {
      band:'5g',
      badge:'5G',
      tone:'blue',
      title:C.label5g||(en?'5G Coverage':'تغطية الجيل الخامس'),
      src:assetUrl(ASSETS.coverage5g||'assets/images/coverage/5g-coverage.png'),
      desc:en?'Private 5G coverage layer for priority mobility and field operations.':'طبقة تغطية الجيل الخامس الخاصة للتنقل والعمليات الميدانية ذات الأولوية.'
    },
    {
      band:'4g',
      badge:'4G',
      tone:'amber',
      title:C.label4g||(en?'4G Coverage':'تغطية الجيل الرابع'),
      src:assetUrl(ASSETS.coverage4g||'assets/images/coverage/4g-coverage.png'),
      desc:en?'Existing 4G coverage reference for comparison and service baseline.':'مرجع تغطية الجيل الرابع للمقارنة وخط الأساس التشغيلي للخدمة.'
    },
    {
      band:'offshore',
      badge:en?'SEA':'بحر',
      tone:'teal',
      title:C.labelOffshore||(en?'Offshore Coverage':'تغطية الاتصال البحري'),
      src:assetUrl(ASSETS.coverageOffshore||'assets/images/coverage/offshore-coverage.png'),
      desc:en?'Offshore communication coverage across coastal and maritime operating zones.':'نطاق تغطية الاتصال البحري للمناطق الساحلية والبحرية التشغيلية.'
    }
  ];
  const active=items.find(x=>x.band==='5g')||items[0];
  const safeAttr=s=>esc(String(s)).replace(/"/g,'&quot;');
  const choice=it=>`<button type="button" class="coverageChoice ${it.band===active.band?'active':''}" data-cover-choice="${it.band}" data-cover-title="${safeAttr(it.title)}" data-cover-src="${safeAttr(it.src)}" data-cover-badge="${safeAttr(it.badge)}" data-cover-desc="${safeAttr(it.desc)}" data-cover-tone="${it.tone}" aria-pressed="${it.band===active.band?'true':'false'}">
    <span class="coverageChoiceBadge tech-${it.band}">${esc(it.badge)}</span>
    <span class="coverageChoiceText"><b>${esc(it.title)}</b><small>${esc(it.desc)}</small></span>
    <span class="coverageChoiceArrow">${en?'›':'‹'}</span>
  </button>`;
  return `<div class="frame"><div class="body coverageBody">
    ${hdr('',C.title||(en?'Coverage':'التغطية'),C.subtitle||'',1)}
    <div class="coverageShell coverageShellV58" id="coverageShell" data-active="${active.band}">
      <aside class="coveragePicker" aria-label="${esc(C.title||'Coverage')}">
        <div class="coveragePickerHead"><small>${esc(en?'Coverage layers':'طبقات التغطية')}</small><b>${esc(en?'Select one map':'اختر خريطة واحدة')}</b></div>
        <div class="coverageChoices">${items.map(choice).join('')}</div>
        <div class="coverageHint coverageHintV58">${esc(C.hint||(en?'Select a coverage layer, then expand for closer inspection.':'اختر طبقة التغطية ثم قم بتكبيرها لعرض أوضح.'))}</div>
      </aside>
      <section class="coverageShowcase">
        <div class="coverageShowcaseTop">
          <div class="coverageActiveTitleWrap">
            <span class="coverageTechBadge tech-${active.band}" id="coverageActiveBadge">${esc(active.badge)}</span>
            <div><small id="coverageActiveKicker">${esc(en?'Active layer':'الطبقة النشطة')}</small><h3 id="coverageActiveTitle">${esc(active.title)}</h3><p id="coverageActiveDesc">${esc(active.desc)}</p></div>
          </div>
          <button class="coverageExpand coverageExpandMain" type="button" data-cover-expand-active aria-label="${esc(C.expand||'Expand')}"><span>⤢</span><b>${esc(C.expand||'Expand')}</b></button>
        </div>
        <button class="coverageImageFrame coverageMainFrame" type="button" data-cover-expand-active aria-label="${esc(active.title)}">
          <span class="coverageImageGlow"></span>
          <img id="coverageMainImg" src="${active.src}" alt="${esc(active.title)}" draggable="false" decoding="async">
          <span class="coverageHoverHint">${esc(C.expand||'Expand')}</span>
        </button>
      </section>
      <div class="coverageViewer" id="coverageViewer" aria-hidden="true">
        <div class="coverageViewerBackdrop" data-cover-close></div>
        <div class="coverageViewerPanel" role="dialog" aria-modal="true">
          <div class="coverageViewerTop">
            <div class="coverageViewerTitle" id="coverageViewerTitle"></div>
            <div class="coverageViewerControls">
              <button type="button" data-cover-zoom-out aria-label="${esc(C.zoomOut||'Zoom out')}">−</button>
              <button type="button" data-cover-zoom-in aria-label="${esc(C.zoomIn||'Zoom in')}">＋</button>
              <button type="button" data-cover-reset aria-label="${esc(C.reset||'Reset')}">${esc(C.reset||'Reset')}</button>
              <button type="button" class="coverageViewerClose" data-cover-close aria-label="${esc(C.close||'Close')}">×</button>
            </div>
          </div>
          <div class="coverageViewerCanvas" id="coverageViewerCanvas"><img id="coverageViewerImg" alt="" draggable="false"></div>
        </div>
      </div>
    </div>
  </div></div>`;
}

function bindCoverage(){
  const root=document.querySelector('.slide.active .coverageShellV58');
  if(!root||root.dataset.bound==='1')return;
  root.dataset.bound='1';
  const choices=[...root.querySelectorAll('[data-cover-choice]')];
  const items={};
  choices.forEach(btn=>{
    items[btn.dataset.coverChoice]={
      band:btn.dataset.coverChoice,
      title:btn.dataset.coverTitle,
      src:btn.dataset.coverSrc,
      badge:btn.dataset.coverBadge,
      desc:btn.dataset.coverDesc,
      tone:btn.dataset.coverTone
    };
  });
  const mainImg=root.querySelector('#coverageMainImg');
  const activeTitle=root.querySelector('#coverageActiveTitle');
  const activeDesc=root.querySelector('#coverageActiveDesc');
  const activeBadge=root.querySelector('#coverageActiveBadge');
  let active=root.dataset.active||'5g';
  const setActive=band=>{
    const it=items[band]||items[active]||Object.values(items)[0];
    if(!it)return;
    active=it.band;
    root.dataset.active=active;
    choices.forEach(btn=>{
      const on=btn.dataset.coverChoice===active;
      btn.classList.toggle('active',on);
      btn.setAttribute('aria-pressed',on?'true':'false');
    });
    if(activeTitle)activeTitle.textContent=it.title;
    if(activeDesc)activeDesc.textContent=it.desc;
    if(activeBadge){
      activeBadge.className=`coverageTechBadge tech-${it.band}`;
      activeBadge.textContent=it.badge;
    }
    if(mainImg){
      const url=it.src;
      if(mainImg.getAttribute('src')!==url && mainImg.src!==url){
        mainImg.classList.add('is-swapping');
        mainImg.src=url;
        mainImg.alt=it.title;
        const done=()=>requestAnimationFrame(()=>mainImg.classList.remove('is-swapping'));
        if(mainImg.complete) done();
        else {
          mainImg.onload=done;
          mainImg.onerror=done;
        }
      }else{
        mainImg.alt=it.title;
      }
    }
  };
  choices.forEach(btn=>btn.addEventListener('click',()=>setActive(btn.dataset.coverChoice)));

  const viewer=root.querySelector('#coverageViewer');
  const viewerImg=root.querySelector('#coverageViewerImg');
  const viewerTitle=root.querySelector('#coverageViewerTitle');
  const canvas=root.querySelector('#coverageViewerCanvas');
  let scale=1,tx=0,ty=0,dragging=false,startX=0,startY=0,startTx=0,startTy=0;
  const apply=()=>{if(viewerImg)viewerImg.style.transform=`translate(${tx}px,${ty}px) scale(${scale})`;};
  const reset=()=>{scale=1;tx=0;ty=0;apply();};
  const zoom=d=>{scale=Math.max(1,Math.min(4,Math.round((scale+d)*100)/100));if(scale===1){tx=0;ty=0;}apply();};
  const open=()=>{
    const it=items[active]||Object.values(items)[0];
    if(!viewer||!viewerImg||!it)return;
    viewerImg.src=it.src;
    viewerImg.alt=it.title;
    if(viewerTitle)viewerTitle.textContent=it.title;
    reset();
    viewer.classList.add('open');
    viewer.setAttribute('aria-hidden','false');
  };
  const close=()=>{if(!viewer)return;viewer.classList.remove('open');viewer.setAttribute('aria-hidden','true');reset();};
  root.querySelectorAll('[data-cover-expand-active]').forEach(b=>b.addEventListener('click',open));
  root.querySelectorAll('[data-cover-close]').forEach(b=>b.addEventListener('click',close));
  root.querySelector('[data-cover-zoom-in]')?.addEventListener('click',()=>zoom(.25));
  root.querySelector('[data-cover-zoom-out]')?.addEventListener('click',()=>zoom(-.25));
  root.querySelector('[data-cover-reset]')?.addEventListener('click',reset);
  canvas?.addEventListener('wheel',e=>{e.preventDefault();zoom(e.deltaY<0?.2:-.2);},{passive:false});
  canvas?.addEventListener('pointerdown',e=>{if(scale<=1)return;dragging=true;startX=e.clientX;startY=e.clientY;startTx=tx;startTy=ty;canvas.setPointerCapture?.(e.pointerId);canvas.classList.add('dragging');});
  canvas?.addEventListener('pointermove',e=>{if(!dragging)return;tx=startTx+(e.clientX-startX);ty=startTy+(e.clientY-startY);apply();});
  const end=e=>{dragging=false;canvas?.classList.remove('dragging');try{canvas?.releasePointerCapture?.(e.pointerId);}catch(_){}};
  canvas?.addEventListener('pointerup',end);
  canvas?.addEventListener('pointercancel',end);
  setActive(active);
}
