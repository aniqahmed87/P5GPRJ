/**
 * Slide 2 — Network Security Architecture (v20, fully rebuilt)
 *
 * Design notes for future maintainers:
 *  - All artwork is authored inline SVG (no raster crops), so it stays crisp on
 *    projectors, follows the light/dark theme, and can be animated directly.
 *  - Zone bands, nodes and every label are real HTML. That keeps Arabic shaping
 *    perfect and makes RTL mirroring free.
 *  - Connection lines are drawn into one SVG overlay whose coordinates are
 *    measured from the live DOM (archWire). Lines therefore always land exactly
 *    on the nodes regardless of font, language, theme or stage scale.
 *
 *  Wording lives in archText() below — safe for customer edits.
 */

/* ------------------------------------------------------------------ */
/* Vector icon set — drawn on a 64x64 canvas                           */
/* ------------------------------------------------------------------ */
const ARCH_ART = {
  firewall: `<svg viewBox="0 0 64 64" class="aArt"><defs><linearGradient id="afwG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8a9c"/><stop offset="1" stop-color="#d3213c"/></linearGradient></defs><rect x="4" y="12" width="46" height="40" rx="5" fill="url(#afwG)"/><g stroke="rgba(255,255,255,.55)" stroke-width="1.5" fill="none"><path d="M4 25.3h46M4 38.6h46M17 12v13.3M38 12v13.3M28 25.3v13.3M11 38.6V52M44 38.6V52"/></g><path d="M37 28l12-4.4 12 4.4v9c0 7.4-5 12.9-12 15.3-7-2.4-12-7.9-12-15.3z" fill="#0b1220" opacity=".5"/><path d="M36 27l12-4.4 12 4.4v9c0 7.4-5 12.9-12 15.3-7-2.4-12-7.9-12-15.3z" fill="#63e2ff"/><path d="M43 36.6l3.7 3.8L54 32.8" stroke="#0b1220" stroke-width="3.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

  encryptor: `<svg viewBox="0 0 64 64" class="aArt"><defs><linearGradient id="aenG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4fd6ff"/><stop offset="1" stop-color="#1f7fd8"/></linearGradient></defs><rect x="7" y="13" width="50" height="38" rx="8" fill="url(#aenG)"/><rect x="7" y="13" width="50" height="38" rx="8" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1.4"/><path d="M24 30v-4.5a8 8 0 0116 0V30" fill="none" stroke="#08131f" stroke-width="4" stroke-linecap="round"/><rect x="20" y="29.5" width="24" height="17" rx="4" fill="#08131f"/><circle cx="32" cy="36" r="3" fill="#4fd6ff"/><rect x="30.6" y="36" width="2.8" height="6" rx="1.4" fill="#4fd6ff"/></svg>`,

  router: `<svg viewBox="0 0 64 64" class="aArt"><defs><linearGradient id="artG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2ea6ec"/><stop offset="1" stop-color="#0f4f9e"/></linearGradient><linearGradient id="artT" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#bff1ff"/><stop offset="1" stop-color="#5cc8f5"/></linearGradient></defs><path d="M6 20v22c0 5.2 11.6 9.4 26 9.4s26-4.2 26-9.4V20z" fill="url(#artG)"/><ellipse cx="32" cy="20" rx="26" ry="9.4" fill="url(#artT)"/><ellipse cx="32" cy="20" rx="26" ry="9.4" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.2"/><g stroke="#08243f" stroke-width="4.6" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M17 30.5l13 13M47 41.5l-13-13"/><path d="M17 30.5h9M17 30.5v9M47 41.5h-9M47 41.5v-9"/></g><g stroke="#eaf8ff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M17 30.5l13 13M47 41.5l-13-13"/><path d="M17 30.5h9M17 30.5v9M47 41.5h-9M47 41.5v-9"/></g></svg>`,

  dwdm: `<svg viewBox="0 0 64 64" class="aArt"><rect x="3" y="18" width="24" height="28" rx="4" fill="#2f9bd6"/><rect x="37" y="18" width="24" height="28" rx="4" fill="#2f9bd6"/><rect x="6" y="21" width="18" height="22" rx="3" fill="#e8f6ff"/><rect x="40" y="21" width="18" height="22" rx="3" fill="#e8f6ff"/><path d="M8 39l7-13 7 13z" fill="#1f76b8"/><path d="M42 39l7-13 7 13z" fill="#1f76b8"/><g stroke-width="2.6" fill="none" stroke-linecap="round"><path d="M27 27h10" stroke="#ff4f6d"/><path d="M27 32h10" stroke="#ffcc4d"/><path d="M27 37h10" stroke="#42e3a8"/></g></svg>`,

  coreNode: `<svg viewBox="0 0 64 64" class="aArt"><defs><linearGradient id="acoG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd98a"/><stop offset="1" stop-color="#c4913c"/></linearGradient></defs><rect x="9" y="7" width="46" height="15" rx="4" fill="url(#acoG)"/><rect x="9" y="24.5" width="46" height="15" rx="4" fill="url(#acoG)" opacity=".84"/><rect x="9" y="42" width="46" height="15" rx="4" fill="url(#acoG)" opacity=".66"/><g fill="#1a1206"><circle cx="17" cy="14.5" r="2.6"/><circle cx="17" cy="32" r="2.6"/><circle cx="17" cy="49.5" r="2.6"/></g><g stroke="rgba(26,18,6,.45)" stroke-width="2" stroke-linecap="round"><path d="M27 14.5h20M27 32h20M27 49.5h20"/></g></svg>`,

  popNode: `<svg viewBox="0 0 64 64" class="aArt"><defs><linearGradient id="apoG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9fc0ff"/><stop offset="1" stop-color="#3f63d8"/></linearGradient></defs><path d="M32 5l24 12v14c0 12-9.6 21.6-24 26C17.6 52.6 8 43 8 31V17z" fill="url(#apoG)"/><g stroke="#0c1526" stroke-width="3" fill="none" stroke-linecap="round"><path d="M22 34l10-9 10 9"/><path d="M32 25v16"/></g><circle cx="22" cy="34" r="3.4" fill="#0c1526"/><circle cx="42" cy="34" r="3.4" fill="#0c1526"/></svg>`,

  agency: `<svg viewBox="0 0 64 64" class="aArt"><defs><linearGradient id="aagG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb0bd"/><stop offset="1" stop-color="#d8324c"/></linearGradient></defs><path d="M32 6l23 9.5V26H9V15.5z" fill="url(#aagG)"/><rect x="9" y="29" width="46" height="26" rx="3" fill="url(#aagG)" opacity=".85"/><g fill="rgba(11,18,32,.5)"><rect x="15" y="34" width="8" height="16" rx="1.6"/><rect x="28" y="34" width="8" height="16" rx="1.6"/><rect x="41" y="34" width="8" height="16" rx="1.6"/></g><circle cx="32" cy="17" r="4.6" fill="rgba(11,18,32,.45)"/></svg>`,

  shelter: `<svg viewBox="0 0 64 64" class="aArt"><path d="M6 46c0-15 11.6-26 26-26s26 11 26 26z" fill="#5c6b7e"/><path d="M6 46c0-15 11.6-26 26-26s26 11 26 26z" fill="none" stroke="rgba(235,242,250,.35)" stroke-width="1.5"/><rect x="3" y="45" width="58" height="9" rx="2.6" fill="#3c4757"/><rect x="24" y="30" width="16" height="16" rx="2" fill="#0f1826"/><path d="M28 38h8" stroke="#ffb85b" stroke-width="3" stroke-linecap="round"/><g stroke="rgba(255,255,255,.2)" stroke-width="1.4"><path d="M18 24.5v21M32 20v10M46 24.5v21"/></g></svg>`,

  fiber: `<svg viewBox="0 0 64 64" class="aArt"><path d="M4 46c14 0 14-28 28-28s14 28 28 28" fill="none" stroke="#1fd09a" stroke-width="5.5" stroke-linecap="round"/><path d="M4 46c14 0 14-28 28-28s14 28 28 28" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="1.6" stroke-linecap="round"/><circle cx="5" cy="46" r="5" fill="#1fd09a"/><circle cx="59" cy="46" r="5" fill="#1fd09a"/></svg>`,

  microwave: `<svg viewBox="0 0 64 64" class="aArt"><path d="M25 54l7-33 7 33z" fill="#6c7d94"/><rect x="21" y="53" width="22" height="5" rx="2" fill="#47566b"/><g fill="none" stroke="#e8952b" stroke-width="3.4" stroke-linecap="round"><path d="M43 15a17 17 0 010 24"/><path d="M50 9a26 26 0 010 36"/></g><circle cx="32" cy="17" r="4.6" fill="#e8952b"/></svg>`,

  satellite: `<svg viewBox="0 0 64 64" class="aArt"><ellipse cx="32" cy="33" rx="28" ry="11" transform="rotate(-22 32 33)" fill="none" stroke="rgba(120,145,175,.55)" stroke-width="1.6"/><rect x="26" y="19" width="12" height="16" rx="2.5" fill="#8fa3ba"/><rect x="26" y="19" width="12" height="16" rx="2.5" fill="none" stroke="rgba(20,35,55,.35)" stroke-width="1"/><rect x="8" y="22" width="16" height="10" rx="2" fill="#3f66d8"/><rect x="40" y="22" width="16" height="10" rx="2" fill="#3f66d8"/><path d="M32 35c0 7.5 5 12.5 12 13.5" fill="none" stroke="#1f9ed0" stroke-width="2.8" stroke-linecap="round"/><circle cx="32" cy="53" r="5" fill="#1f9ed0"/></svg>`,

  lock: `<svg viewBox="0 0 64 64" class="aArt"><path d="M21 30v-6a11 11 0 0122 0v6" fill="none" stroke="currentColor" stroke-width="5.5" stroke-linecap="round"/><rect x="14" y="29" width="36" height="26" rx="6" fill="currentColor"/><circle cx="32" cy="39" r="4" fill="#0b1220"/><rect x="30.3" y="39" width="3.4" height="8" rx="1.7" fill="#0b1220"/></svg>`
};

/* ------------------------------------------------------------------ */
/* Wording                                                             */
/* ------------------------------------------------------------------ */
function archText(en){
  return {
    eyebrow:en?'Security Architecture':'عرض التصميم العام',
    title:en?'Network Components: Isolated Network':'مكونات الشبكة: شبكة معزولة',
    sub:en?'Security zones, trust boundaries, segmentation, and the controlled gateways through which entities connect.'
          :'مناطق الحماية، حدود الثقة، العزل والتجزئة، والبوابات المحكومة التي ترتبط الجهات عبرها بالشبكة.',

    zones:[
      {id:'core',name:en?'Isolated Core':' الشبكة المركزية المعزولة',
       trust:en?'Trust level 1 — highest':'مستوى الثقة الاول — الأعلى',
       note:en?'Dual core sites on a protected optical ring, with no direct external reachability.'
              :'موقعا الشبكة المركزية على حلقة ضوئية محمية، دون أي وصول خارجي مباشر.'},
      {id:'agg',name:en?'Aggregation':'طبقة التجميع',
       trust:en?'Trust level 2 — controlled transit':'مستوى الثقة الثاني — عبور محكوم',
       note:en?'Policy enforcement and per-entity segmentation before traffic reaches the core.'
              :'تطبيق السياسات وفصل كل جهة قبل وصول الحركة إلى النواة.'},
      {id:'access',name:en?'Isolated Access':'الوصول المعزول',
       trust:en?'Trust level 3 — protected endpoints':'مستوى الثقة الثالث — نقاط تشغيل محمية',
       note:en?'Every entity terminates in its own segment and cannot see the others.'
              :'كل جهة تنتهي في شريحة مستقلة ولا يمكنها رؤية الجهات الأخرى.'}
    ],

    boundary:en?'Trust boundary':'حد الثقة',
    gateway:en?'Secure gateway':'بوابة آمنة',
    inspect:en?'Inspection · encryption · policy':'فحص · تشفير · سياسات',

    coreA:en?'Core Site A':'موقع الشبكةالمركزية الاحتياطي',
    coreB:en?'Core Site B':'موقع الشبكةالمركزية الاساسي',
    coreASub:en?'Primary command & control':'احتياطي فوري · تكرار كامل',
    coreBSub:en?'Hot standby · full redundancy':'القيادة والسيطرة الأساسية',
    ring:en?'Protected optical ring':'الحلقة الضوئية المحمية',
    ringSub:en?'DWDM · encrypted lambdas':'DWDM · موجات مشفّرة',

    popX:en?'Aggregation POP X':'نقطة التجميع X',
    popY:en?'Aggregation POP Y':'نقطة التجميع Y',
    popSub:en?'PE + DWDM · segmentation':'PE + DWDM · تجزئة',

    entity:en?'Entity':'جهة',
    entitySub:en?'Isolated segment':'شريحة معزولة',

    continuityTitle:en?'Operational continuity':'استمرارية العمليات',
    continuity:[
      {icon:'shield',t:en?'A resilient network that withstands cyberattacks and jamming attempts.'
                        :'شبكة مرنة تتحمل الهجمات السيبرانية ومحاولات التشويش.'},
      {icon:'route',t:en?'Alternate paths (Fiber + Microwave + Satellite) preserve connectivity even when the primary route is cut or disrupted.'
                       :'مسارات بديلة (الالياف الضوئية و الاتصالات اللاسلكية والاقمار الصناعية) لضمان الاتصال حتى في حال قطع أو تعطيل البنية الأساسية.'},
      {icon:'server',t:en?'Hardened military shelters with backup power and full redundancy sustain command and control.'
                        :'ملاجئ عسكرية محصنة مع طاقة احتياطية وتكرار كامل (Redundancy) يضمن استمرار القيادة والسيطرة.'}
    ],

    pathsTitle:en?'Alternate transport paths':'مسارات الاتصال البديلة',
    pathsHint:en?'Click a path to simulate a cut':'اضغط أي مسار لمحاكاة قطعه',
    paths:[
      {id:'fiber',art:'fiber',name:en?'Fiber':'الألياف الضوئية',sub:en?'Primary · high capacity':'أساسي · سعة عالية'},
      {id:'mw',art:'microwave',name:en?'Microwave':'الاتصال اللاسلكي',sub:en?'Secondary · rapid restore':'ثانوي · استعادة سريعة'},
      {id:'sat',art:'satellite',name:en?'Satellite':'الأقمار الصناعية',sub:en?'Beyond terrestrial':'خارج الشبكات الأرضية'}
    ],
    live:en?'Carrying traffic':'يحمل الحركة',
    standby:en?'Standby':'احتياطي',
    cut:en?'Link cut':'مقطوع',
    restore:en?'Restore all paths':'استعادة جميع المسارات',
    shelter:en?'Hardened shelter':'ملجأ محصن',
    shelterSub:en?'Backup power · full redundancy':'طاقة احتياطية · تكرار كامل',

    chainBtn:en?'Secure connection chain':'مسار الاتصال الآمن',
    chainTitle:en?'How every connection is secured':'كيف يتم تأمين كل اتصال',
    chainFrom:en?'Entity site':'موقع الجهة',
    chainTo:en?'Core site':'موقع النواة',
    chainSub:en?'Traffic crosses the same enforced chain in both directions — inspected, encrypted, routed, then carried over protected optical transport.'
               :'تعبر الحركة السلسلة ذاتها في الاتجاهين — فحص، ثم تشفير، ثم توجيه، ثم نقل عبر شبكة ضوئية محمية.',
    chain:[
      {art:'firewall',name:en?'Firewall':'الجدار الناري',sub:en?'Inspect & filter':'فحص وتصفية'},
      {art:'encryptor',name:en?'Encryptor':'وحدة التشفير',sub:en?'Encrypt at the edge':'تشفير عند الحافة'},
      {art:'router',name:en?'Router':'الموجّه',sub:en?'Segmented routing':'توجيه مجزّأ'},
      {art:'dwdm',name:'DWDM',sub:en?'Protected optical transport':'نقل ضوئي محمي'},
      {art:'router',name:en?'Router':'الموجّه',sub:en?'Segmented routing':'توجيه مجزّأ'},
      {art:'encryptor',name:en?'Encryptor':'وحدة التشفير',sub:en?'Decrypt at the edge':'فك التشفير'},
      {art:'firewall',name:en?'Firewall':'الجدار الناري',sub:en?'Inspect & filter':'فحص وتصفية'}
    ],
    close:en?'Close':'إغلاق',

    legend:[
      {k:'enc',t:en?'Encrypted path':'مسار مشفّر'},
      {k:'ctrl',t:en?'Control path':'مسار التحكم'},
      {k:'alt',t:en?'Alternate path':'مسار بديل'}
    ]
  };
}

/* ------------------------------------------------------------------ */
/* Markup                                                              */
/* ------------------------------------------------------------------ */
function architectureSlide(){
  const en=state.lang==='en', T=archText(en), art=k=>ARCH_ART[k]||'';

  const gateway=side=>`<div class="archGate" data-gate="${side}"><span class="archGateLock">${art('lock')}</span><span class="archGateTxt"><b>${esc(T.gateway)}</b><i>${esc(T.inspect)}</i></span></div>`;

  const boundary=n=>`<div class="archBoundary" data-boundary="${n}"><span class="archBoundaryLine"></span><span class="archBoundaryTag">${esc(T.boundary)}</span>${gateway('a')}${gateway('b')}</div>`;

  const entities=[1,2,3,4,5].map(i=>`<article class="archNode archEntity ent-${i}" data-node="e${i}" data-zone="access" tabindex="0"><span class="archNodeSeal">${art('lock')}</span><span class="archNodeArt">${art('agency')}</span><span class="archNodeTxt"><b>${esc(T.entity)} ${i}</b><i>${esc(T.entitySub)}</i></span></article>`).join('');

  const paths=T.paths.map((p,i)=>`<button class="archPath path-${p.id} ${i===0?'is-live':'is-standby'}" data-path="${p.id}" type="button"><span class="archPathBackdrop" aria-hidden="true"></span><span class="archPathArt">${art(p.art)}</span><span class="archPathTxt"><b>${esc(p.name)}</b><i>${esc(p.sub)}</i></span><span class="archPathTrack"><span class="archPathBeam"></span><span class="archPathBreak"></span></span><span class="archPathState">${esc(i===0?T.live:T.standby)}</span></button>`).join('');

  const zoneRows=T.zones.map(z=>`<button class="archZoneRow" data-zonelink="${z.id}" type="button"><span class="archZoneDot"></span><span class="archZoneRowTxt"><b>${esc(z.name)}</b><i>${esc(z.trust)}</i><u>${esc(z.note)}</u></span></button>`).join('');

  const chainItems=T.chain.map((c,i)=>`<div class="archChainItem" style="--ci:${i}"><span class="archChainArt">${art(c.art)}</span><b>${esc(c.name)}</b><i>${esc(c.sub)}</i></div>`).join('<span class="archChainLink"></span>');

  return `<div class="frame"><div class="body archBody archBodyV22">
  ${hdr(T.eyebrow,T.title,T.sub,2)}
  <div class="archGrid">
    <div class="archStage" id="archStage">
      <svg class="archWires" aria-hidden="true"></svg>
      <div class="archStageGlow" aria-hidden="true"></div>

      <div class="archHud">
        ${T.legend.map(l=>`<span class="archLegend ${l.k}"><i></i>${esc(l.t)}</span>`).join('')}
        <button class="archChainBtn" id="archChainBtn" type="button">${art('lock')}<span>${esc(T.chainBtn)}</span></button>
      </div>

      <section class="archZone" data-zone="core">
        <header class="archZoneHead"><b>${esc(T.zones[0].name)}</b><i>${esc(T.zones[0].trust)}</i></header>
        <div class="archZoneBody">
          <article class="archNode archCore" data-node="coreA" data-zone="core" tabindex="0"><span class="archNodeBadge">${esc(en?'Primary':'أساسي')}</span><span class="archNodeArt">${art('coreNode')}</span><span class="archNodeTxt"><b>${esc(T.coreA)}</b><i>${esc(T.coreASub)}</i></span></article>
          <div class="archRing" data-node="ring"><span class="archRingSpin" data-node="ringDisc"></span><span class="archRingCore"></span><span class="archRingTxt"><b>${esc(T.ring)}</b><i>${esc(T.ringSub)}</i></span></div>
          <article class="archNode archCore" data-node="coreB" data-zone="core" tabindex="0"><span class="archNodeBadge is-standby">${esc(en?'Standby':'احتياطي')}</span><span class="archNodeArt">${art('coreNode')}</span><span class="archNodeTxt"><b>${esc(T.coreB)}</b><i>${esc(T.coreBSub)}</i></span></article>
        </div>
      </section>

      ${boundary(1)}

      <section class="archZone" data-zone="agg">
        <header class="archZoneHead"><b>${esc(T.zones[1].name)}</b><i>${esc(T.zones[1].trust)}</i></header>
        <div class="archZoneBody">
          <article class="archNode archPop" data-node="popX" data-zone="agg" tabindex="0"><span class="archNodeBadge is-pop">POP</span><span class="archNodeArt">${art('popNode')}</span><span class="archNodeTxt"><b>${esc(T.popX)}</b><i>${esc(T.popSub)}</i></span></article>
          <article class="archNode archPop" data-node="popY" data-zone="agg" tabindex="0"><span class="archNodeBadge is-pop">POP</span><span class="archNodeArt">${art('popNode')}</span><span class="archNodeTxt"><b>${esc(T.popY)}</b><i>${esc(T.popSub)}</i></span></article>
        </div>
      </section>

      ${boundary(2)}

      <section class="archZone" data-zone="access">
        <header class="archZoneHead"><b>${esc(T.zones[2].name)}</b><i>${esc(T.zones[2].trust)}</i></header>
        <div class="archZoneBody archEntityRow">${entities}</div>
      </section>
    </div>

    <aside class="archRail">
      <section class="archCard archCardZones">
        <h3>${esc(T.title)}</h3>
        <div class="archZoneList">${zoneRows}</div>
      </section>

      <section class="archCard archCardPaths">
        <div class="archCardHead"><h3>${esc(T.pathsTitle)}</h3><span class="archCardHint">${esc(T.pathsHint)}</span></div>
        <div class="archPathSimStatus" id="archPathSimStatus"></div>
        <div class="archPathList">${paths}</div>
        <button class="archRestore" id="archRestore" type="button" hidden>${esc(T.restore)}</button>
        <div class="archShelter"><span class="archShelterArt">${art('shelter')}</span><span class="archShelterTxt"><b>${esc(T.shelter)}</b><i>${esc(T.shelterSub)}</i></span></div>
      </section>

      <section class="archCard archCardCont">
        <h3>${esc(T.continuityTitle)}</h3>
        <ul class="archContList">${T.continuity.map(c=>`<li><span class="archContIcon">${icon(c.icon)}</span><span>${esc(c.t)}</span></li>`).join('')}</ul>
      </section>
    </aside>
  </div>

  <div class="archChainOverlay" id="archChainOverlay" aria-hidden="true">
    <div class="archChainPanel" role="dialog" aria-modal="true">
      <button class="archChainClose" id="archChainClose" type="button" aria-label="${esc(T.close)}">×</button>
      <h3>${esc(T.chainTitle)}</h3>
      <p>${esc(T.chainSub)}</p>
      <div class="archChainEnds"><span>${esc(T.chainFrom)}</span><i></i><span>${esc(T.chainTo)}</span></div>
      <div class="archChainFlow">${chainItems}</div>
    </div>
  </div>
  </div></div>`;
}

/* ------------------------------------------------------------------ */
/* Connector geometry — measured from the live DOM                     */
/* ------------------------------------------------------------------ */
function archWire(stage){
  const svg=stage.querySelector('.archWires');
  if(!svg)return;
  const box=stage.getBoundingClientRect();
  if(box.width<10||box.height<10)return;

  const H=Math.round(1000*box.height/box.width);
  svg.setAttribute('viewBox',`0 0 1000 ${H}`);
  svg.setAttribute('preserveAspectRatio','none');

  const pt=(sel,ax,ay)=>{
    const el=stage.querySelector(sel);
    if(!el)return null;
    const r=el.getBoundingClientRect();
    return{
      x:((r.left-box.left)+r.width*ax)/box.width*1000,
      y:((r.top-box.top)+r.height*ay)/box.height*H
    };
  };
  const rectOf=(el,pad=3)=>{
    const r=el.getBoundingClientRect();
    const x=((r.left-box.left)/box.width)*1000, y=((r.top-box.top)/box.height)*H;
    const w=(r.width/box.width)*1000, h=(r.height/box.height)*H;
    const sx=1000/box.width, sy=H/box.height;
    return{x:x-pad*sx,y:y-pad*sy,w:w+pad*2*sx,h:h+pad*2*sy,rx:Math.max(4,Math.min(18,Math.min(w,h)*.12))};
  };

  const links=[];
  const add=(from,to,kind,id,orient,tag)=>{if(from&&to)links.push({from,to,kind,id,orient:orient||'v',tag:tag||''});};

  // Every cross-boundary link is routed through a secure gateway on purpose:
  // it is the visual argument that nothing traverses a trust boundary unchecked.
  const coreAr=pt('[data-node="coreA"]',1,.5), coreBl=pt('[data-node="coreB"]',0,.5);
  const ringL=pt('[data-node="ringDisc"]',0,.5), ringR=pt('[data-node="ringDisc"]',1,.5);
  const coreAb=pt('[data-node="coreA"]',.5,1), coreBb=pt('[data-node="coreB"]',.5,1);
  const ringLb=pt('[data-node="ringDisc"]',.22,.86), ringRb=pt('[data-node="ringDisc"]',.78,.86);
  const popXt=pt('[data-node="popX"]',.5,0),  popYt=pt('[data-node="popY"]',.5,0);
  const popXb=pt('[data-node="popX"]',.5,1),  popYb=pt('[data-node="popY"]',.5,1);

  const g=(b,s,ax,ay)=>pt(`[data-boundary="${b}"] [data-gate="${s}"]`,ax,ay);
  const g1at=g(1,'a',.5,0), g1ab=g(1,'a',.5,1), g1bt=g(1,'b',.5,0), g1bb=g(1,'b',.5,1);
  const g2at=g(2,'a',.5,0), g2ab=g(2,'a',.5,1), g2bt=g(2,'b',.5,0), g2bb=g(2,'b',.5,1);

  // core sites onto the protected optical ring (horizontal)
  add(coreAr,ringL,'ctrl','r1','h','coreA');
  add(ringR,coreBl,'ctrl','r2','h','coreB');

  // core -> boundary 1 gateways
  add(coreAb,g1at,'enc','c1','v','coreA');
  add(coreBb,g1bt,'enc','c2','v','coreB');
  // ring to boundary gateways — routed from the lower flanks so they never cross the optical ring label
  if(ringLb && g1at) links.push({from:ringLb,to:g1at,kind:'ctrl',id:'c3',route:'ringLeft'});
  if(ringRb && g1bt) links.push({from:ringRb,to:g1bt,kind:'ctrl',id:'c4',route:'ringRight'});

  // boundary 1 gateways -> aggregation (straight + cross-connect for redundancy)
  add(g1ab,popXt,'enc','c5','v','popX');
  add(g1bb,popYt,'enc','c6','v','popY');
  add(g1ab,popYt,'alt','c7','v','popY');
  add(g1bb,popXt,'alt','c8','v','popX');

  // aggregation -> boundary 2 gateways
  add(popXb,g2at,'enc','c9','v','popX');
  add(popYb,g2bt,'enc','c10','v','popY');

  // boundary 2 gateways -> entities, every entity dual-homed
  for(let i=1;i<=5;i++){
    const e=pt(`[data-node="e${i}"]`,.5,0);
    if(!e)continue;
    const nearA=i<=3;
    add(nearA?g2ab:g2bb,e,'enc','p'+i,'v','e'+i);
    add(nearA?g2bb:g2ab,e,'alt','s'+i,'v','e'+i);
  }

  const blockers=[...stage.querySelectorAll('.archNode,.archGate,.archBoundaryTag,.archZoneHead,.archRingSpin,.archRingTxt')].map(el=>rectOf(el,4));
  const maskCuts=blockers.map(r=>`<rect x="${r.x.toFixed(1)}" y="${r.y.toFixed(1)}" width="${r.w.toFixed(1)}" height="${r.h.toFixed(1)}" rx="${r.rx.toFixed(1)}" fill="black"/>`).join('');
  const defs=`<defs>
    <linearGradient id="awEnc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fe9ff"/><stop offset="1" stop-color="#2b6bff"/></linearGradient>
    <linearGradient id="awCtrl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe0a2"/><stop offset="1" stop-color="#e0913a"/></linearGradient>
    <linearGradient id="awAlt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6cf0c0"/><stop offset="1" stop-color="#149c76"/></linearGradient>
    <mask id="awBlockMask" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="${H}"><rect x="0" y="0" width="1000" height="${H}" fill="white"/>${maskCuts}</mask>
  </defs>`;

  const paths=links.map(l=>{
    const f=l.from,t=l.to;let d;
    if(l.route==='ringLeft'){
      const c1x=f.x-72, c1y=f.y+26, c2x=t.x-42, c2y=t.y-18;
      d=`M${f.x.toFixed(1)} ${f.y.toFixed(1)} C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${t.x.toFixed(1)} ${t.y.toFixed(1)}`;
    }else if(l.route==='ringRight'){
      const c1x=f.x+72, c1y=f.y+26, c2x=t.x+42, c2y=t.y-18;
      d=`M${f.x.toFixed(1)} ${f.y.toFixed(1)} C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${t.x.toFixed(1)} ${t.y.toFixed(1)}`;
    }else if(l.orient==='h'){
      const c=Math.max(12,Math.abs(t.x-f.x)*.42);
      d=`M${f.x.toFixed(1)} ${f.y.toFixed(1)} C${(f.x+c).toFixed(1)} ${f.y.toFixed(1)} ${(t.x-c).toFixed(1)} ${t.y.toFixed(1)} ${t.x.toFixed(1)} ${t.y.toFixed(1)}`;
    }else{
      const c=Math.max(12,Math.abs(t.y-f.y)*.55);
      d=`M${f.x.toFixed(1)} ${f.y.toFixed(1)} C${f.x.toFixed(1)} ${(f.y+c).toFixed(1)} ${t.x.toFixed(1)} ${(t.y-c).toFixed(1)} ${t.x.toFixed(1)} ${t.y.toFixed(1)}`;
    }
    return `<path id="aw-${l.id}" class="awLine ${l.kind}" data-tag="${l.tag}" d="${d}"/>`;
  }).join('');

  const dots=links.map((l,i)=>`<circle class="awDot ${l.kind}" data-tag="${l.tag}" r="3.4"><animateMotion dur="${(2.6+(i%5)*.5).toFixed(2)}s" begin="${(i*.17).toFixed(2)}s" repeatCount="indefinite"><mpath href="#aw-${l.id}"/></animateMotion></circle>`).join('');
  const ports=links.map(l=>`<circle class="awPort ${l.kind}" cx="${l.from.x.toFixed(1)}" cy="${l.from.y.toFixed(1)}" r="4.1"/><circle class="awPort ${l.kind}" cx="${l.to.x.toFixed(1)}" cy="${l.to.y.toFixed(1)}" r="4.1"/>`).join('');

  svg.innerHTML=defs+`<g class="awMasked" mask="url(#awBlockMask)"><g class="awLines">${paths}</g><g class="awDots">${dots}</g></g><g class="awPorts">${ports}</g>`;
}

/* ------------------------------------------------------------------ */
/* Behaviour                                                           */
/* ------------------------------------------------------------------ */
function bindArchitecture(){
  const slide=document.querySelector('.slide.active');
  if(!slide)return;
  const stage=slide.querySelector('.archStage');
  if(!stage||stage.dataset.bound==='1')return;
  stage.dataset.bound='1';

  const root=slide.querySelector('.archBody');
  const T=archText(state.lang==='en');

  /* connection lines */
  const draw=()=>archWire(stage);
  draw();
  requestAnimationFrame(draw);
  setTimeout(draw,280);
  setTimeout(draw,900);
  if(window.ResizeObserver)new ResizeObserver(draw).observe(stage);
  window.addEventListener('resize',draw);

  /* zone cross-highlighting */
  const setZone=z=>{root.classList.toggle('archFocus',!!z);root.dataset.zone=z||'';};
  root.querySelectorAll('[data-zonelink]').forEach(btn=>{
    const z=btn.dataset.zonelink;
    btn.addEventListener('mouseenter',()=>setZone(z));
    btn.addEventListener('focus',()=>setZone(z));
    btn.addEventListener('mouseleave',()=>setZone(null));
    btn.addEventListener('blur',()=>setZone(null));
  });
  stage.querySelectorAll('.archZone').forEach(sec=>{
    const z=sec.dataset.zone;
    sec.addEventListener('mouseenter',()=>setZone(z));
    sec.addEventListener('mouseleave',()=>setZone(null));
  });

  /* node lift */
  const svgEl=()=>stage.querySelector('.archWires');
  const traceOn=tag=>{
    const sv=svgEl();if(!sv||!tag)return;
    sv.classList.add('is-tracing');
    sv.querySelectorAll(`[data-tag="${tag}"]`).forEach(el=>el.classList.add('is-traced'));
  };
  const traceOff=()=>{
    const sv=svgEl();if(!sv)return;
    sv.classList.remove('is-tracing');
    sv.querySelectorAll('.is-traced').forEach(el=>el.classList.remove('is-traced'));
  };
  stage.querySelectorAll('.archNode').forEach(n=>{
    const tag=n.dataset.node;
    const on=()=>{n.classList.add('is-hot');traceOn(tag);};
    const off=()=>{n.classList.remove('is-hot');traceOff();};
    n.addEventListener('mouseenter',on);
    n.addEventListener('focus',on);
    n.addEventListener('mouseleave',off);
    n.addEventListener('blur',off);
  });

  /* alternate path cut simulation */
  const pathBtns=Array.from(root.querySelectorAll('.archPath'));
  const restore=root.querySelector('#archRestore');
  const applyPaths=()=>{
    let liveFound=false,activeName='',cutCount=0;
    pathBtns.forEach(b=>{
      const isCut=b.classList.contains('is-cut');
      const name=b.querySelector('.archPathTxt b')?.textContent?.trim()||'';
      b.classList.remove('is-live','is-standby','is-reroute');
      let label;
      if(isCut){label=T.cut;cutCount++;}
      else if(!liveFound){b.classList.add('is-live');if(cutCount>0)b.classList.add('is-reroute');liveFound=true;activeName=name;label=T.live;}
      else{b.classList.add('is-standby');label=T.standby;}
      const s=b.querySelector('.archPathState');
      if(s)s.textContent=label;
    });
    const anyCut=cutCount>0;
    root.dataset.activeRoute = activeName || '';
    root.dataset.routeState = liveFound ? (cutCount>0 ? 'rerouted' : 'normal') : 'outage';
    if(restore)restore.hidden=!anyCut;
    root.classList.toggle('archDegraded',anyCut);
    const status=root.querySelector('#archPathSimStatus');
    if(status){
      if(!anyCut){status.className='archPathSimStatus normal';status.textContent=state.lang==='en'?'Normal operation · Fiber carrying traffic':'تشغيل طبيعي · الألياف الضوئية تحمل الحركة';}
      else if(activeName){status.className='archPathSimStatus rerouted';status.textContent=(state.lang==='en'?'Traffic automatically rerouted to ':'تم تحويل الحركة تلقائياً إلى ')+activeName;}
      else{status.className='archPathSimStatus outage';status.textContent=state.lang==='en'?'All alternate paths are unavailable':'جميع المسارات البديلة غير متاحة';}
    }
  };
  pathBtns.forEach(b=>b.addEventListener('click',()=>{
    b.classList.toggle('is-cut');
    b.classList.remove('is-snapping');
    void b.offsetWidth;
    if(b.classList.contains('is-cut'))b.classList.add('is-snapping');
    applyPaths();
  }));
  if(restore)restore.addEventListener('click',()=>{
    pathBtns.forEach(b=>b.classList.remove('is-cut','is-snapping'));
    applyPaths();
  });
  applyPaths();

  /* secure connection chain overlay */
  const overlay=root.querySelector('#archChainOverlay');
  const openBtn=root.querySelector('#archChainBtn');
  const closeBtn=root.querySelector('#archChainClose');
  const setOpen=on=>{
    if(!overlay)return;
    overlay.classList.toggle('open',on);
    overlay.setAttribute('aria-hidden',on?'false':'true');
  };
  if(openBtn)openBtn.addEventListener('click',()=>setOpen(true));
  if(closeBtn)closeBtn.addEventListener('click',()=>setOpen(false));
  if(overlay)overlay.addEventListener('click',e=>{if(e.target===overlay)setOpen(false);});
  if(!window.__archEsc){
    window.__archEsc=true;
    document.addEventListener('keydown',e=>{
      if(e.key!=='Escape')return;
      const o=document.querySelector('.archChainOverlay.open');
      if(o){o.classList.remove('open');o.setAttribute('aria-hidden','true');}
    });
  }

  /* boundary hover */
  stage.querySelectorAll('.archBoundary').forEach(b=>{
    b.addEventListener('mouseenter',()=>b.classList.add('is-hot'));
    b.addEventListener('mouseleave',()=>b.classList.remove('is-hot'));
  });
}
