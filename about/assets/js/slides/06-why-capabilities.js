/** Slide 5 — v49 clean three-tab "Why Private 5G" experience. */
(function(){
  const S5 = window.__s5CleanState || (window.__s5CleanState={tab:'caps',cap:0,infra:0,cont:0});
  const P='assets/images/slide5-clean/';
  const CAP_IMAGES=[
    P+'secure-private-v49.webp',
    P+'central-ops-v49.webp',
    P+'deployment-v49.webp',
    P+'uav-robotics-v49.webp',
    P+'protected-sites-v49.webp',
    P+'tactical-field-v49.webp',
    P+'fast-response-v49.webp'
  ];
  const INFRA_IMAGES=[P+'infra-fiber-v49.webp',P+'infra-dwdm-v49.webp',P+'infra-dc-v49.webp',P+'infra-sovereignty-v49.webp'];
  const CONT_IMAGES=[P+'cont-alternate-v49.webp',P+'cont-power-v49.webp',P+'cont-redundancy-v49.webp',P+'cont-ops-v49.webp',P+'cont-suppliers-v49.webp'];
  const COPY={
    en:{
      title:'Why Private 5G',
      subtitle:'Private 5G gives critical operations a secure, controlled and resilient wireless layer for field teams, assets, sensors and command centers.',
      tabs:['Private 5G Value','Infrastructure, Control & Security','Continuity in Critical Conditions'],
      focusLabel:'ACTIVE FOCUS',
      caps:[
        ['Private & Secure Network','A dedicated and encrypted network for secure communications.','lock'],
        ['Centralized Management','Centralized management through dedicated 24/7 network monitoring and operations rooms.','desktop'],
        ['Deployment Flexibility','Fast data flow supports surveillance video streaming, live site views and direct updates from the field.','signal'],
        ['Drone & Robotics Integration','Connects hundreds of sensors, cameras, drones and robotic assets for synchronized data exchange and real-time monitoring and control.','mobile'],
        ['Monitoring & Protection','Supports monitoring and protection of borders and military sites.','eye'],
        ['Secure Tactical Communications','Secure communications for operational units and forward bases.','comments'],
        ['High Performance & Faster Response','Immediate control of drones, robots and tactical communication systems with faster response.','rocket']
      ],
      infraTitle:'Infrastructure, Control & Security',
      infraSub:'Sovereign local infrastructure keeps sensitive services controlled, protected and within the required geographic scope.',
      infraExact:'Provides a high level of control and security through dedicated fiber, DWDM technology for more efficient data transport, and local data centers that keep data within the required geographic scope, strengthening compliance and digital sovereignty.',
      infra:[
        ['Dedicated Fiber','Private high-capacity transport under direct control.','link'],
        ['DWDM','Efficient optical transport for high-volume data movement.','network'],
        ['Local Data Centers','Keeps data and critical services within the required geography.','server'],
        ['Compliance & Digital Sovereignty','Strengthens governance, control, compliance and sovereignty over sensitive data.','shield']
      ],
      contTitle:'Continuity in Critical Conditions',
      contSub:'Resilient connectivity and operational readiness preserve service during disruption and critical scenarios.',
      contExact1:'High resilience: alternate paths such as fiber, microwave and satellite ensure connectivity when part of the network is disrupted.',
      contExact2:'Service continuity and immediate response: high readiness through backup power and full redundancy, with a local operations center and strategic suppliers supporting network continuity during critical conditions.',
      cont:[
        ['Alternate Paths','Fiber, microwave and satellite provide path diversity when part of the network is disrupted.','refresh'],
        ['Backup Power','High readiness through independent backup power.','database'],
        ['Full Redundancy','Full redundancy protects critical service components.','random'],
        ['Local Operations Center','Local monitoring and operations sustain immediate response.','desktop'],
        ['Strategic Suppliers','Strategic suppliers reinforce continuity during critical conditions.','briefcase']
      ]
    },
    ar:{
      title:'اهمية شبكة الجيل الخامس الخاصة',
      subtitle:'شبكة الجيل الخامس الخاصة تمنح العمليات الحرجة طبقة اتصال لاسلكية آمنة ومحكومة ومرنة للفرق الميدانية والأصول والحساسات ومراكز القيادة.',
      tabs:['القيمة المضافة لشبكة الجيل الخامس ','البنية التحتية والتحكم والأمان','استمرارية الاتصال في الظروف الحرجة'],
      focusLabel:'التركيز الحالي',
      caps:[
        ['شبكة خاصة وآمنة','شبكة مخصصة ومشفّرة للاتصالات الآمنة','lock'],
        ['إدارة مركزية','إدارة مركزية عبر غرف عمليات مراقبة الشبكة  مخصصه 24/7','desktop'],
        ['مرونة النشر','تدفق سريع للبيانات لدعم بث فيديو المراقبة وعرض المواقع بشكل لحظي مع تحديث مباشر من الميدان.','signal'],
        ['تكامل مع الطائرات بدون طيار والروبوتات','ربط مئات من الأجهزة مثل المستشعرات، الكاميرات، والطائرات بدون طيار، لتبادل البيانات بشكل متزامن ودعم الرصد والتحكم في الوقت الفوري','mobile'],
        ['مراقبة وحماية','مراقبة وحماية الحدود والمواقع العسكرية','eye'],
        ['تواصل تكتيكي آمن','اتصالات آمنة للوحدات والقواعد المتقدمة','comments'],
        ['أداء عالي وزمن استجابة اسرع','تحكم فوري بالطائرات، الروبوتات، وأنظمة الاتصال التكتيكي.','rocket']
      ],
      infraTitle:'البنية التحتية والتحكم والأمان',
      infraSub:'بنية سيادية محلية ترفع مستوى التحكم والأمان وتحافظ على البيانات داخل النطاق الجغرافي المطلوب.',
      infraExact:'توفّر مستوى عالي من التحكم والأمان، وتشمل أليافًا ضوئية مخصصة، وتقنية DWDM  لزيادة كفاءة نقل البيانات، بالإضافة إلى مراكز بيانات محلية تضمن بقاء البيانات داخل النطاق الجغرافي المطلوب، مما يعزز الامتثال والسيادة الرقمية.',
      infra:[
        ['ألياف ضوئية مخصصة','بنية نقل خاصة عالية السعة ومحكومة.','link'],
        ['تقنية DWDM','زيادة كفاءة نقل البيانات عبر البنية الضوئية.','network'],
        ['مراكز بيانات محلية','ضمان بقاء البيانات داخل النطاق الجغرافي المطلوب.','server'],
        ['الامتثال والسيادة الرقمية','تعزيز الامتثال والسيادة الرقمية والتحكم في البيانات.','shield']
      ],
      contTitle:'استمرارية الاتصال في الظروف الحرجة',
      contSub:'مرونة تشغيلية وجاهزية عالية لضمان بقاء الاتصال والخدمة عند التعطل أو الظروف الحرجة.',
      contExact1:'مرونة عالية : مسارات بديلة مثل ألياف ضوئية و ميكروويف و أقمار صناعية لضمان الاتصال عند انقطاع جزء من الشبكة.',
      contExact2:'استمرارية الخدمة و استجابة فورية: جاهزية عالية بفضل طاقة احتياطية وتكرار كامل، مع تشغيل مركز عمليات محلي واعتماد على موردين استراتيجيين لضمان استمرارية الشبكة في الظروف الحرجة.',
      cont:[
        ['مسارات بديلة','ألياف ضوئية و ميكروويف و أقمار صناعية لضمان الاتصال عند انقطاع جزء من الشبكة.','refresh'],
        ['طاقة احتياطية','جاهزية عالية بفضل طاقة احتياطية.','database'],
        ['تكرار كامل','تكرار كامل للمكونات الحرجة لضمان الاستمرارية.','random'],
        ['مركز عمليات محلي','تشغيل مركز عمليات محلي لدعم الاستجابة الفورية.','desktop'],
        ['موردون استراتيجيون','الاعتماد على موردين استراتيجيين لضمان استمرارية الشبكة.','briefcase']
      ]
    }
  };
  function T(){return COPY[state.lang==='ar'?'ar':'en'];}
  function I(n){return icon(n);}
  function tabbar(t){return `<div class="s5cleanTabs" role="tablist" aria-label="${esc(t.title)}">${t.tabs.map((x,i)=>{const k=['caps','infra','cont'][i];const a=S5.tab===k;return `<button type="button" role="tab" aria-selected="${a?'true':'false'}" class="s5cleanTab ${a?'active':''}" data-s5c-tab="${k}"><span>0${i+1}</span><b>${esc(x)}</b></button>`}).join('')}</div>`;}
  function capsPanel(t){const c=t.caps[S5.cap];return `<section class="s5cleanPanel ${S5.tab==='caps'?'active':''}" data-s5-panel="caps" ${S5.tab==='caps'?'':'hidden'}>
    <div class="s5capList">${t.caps.map((x,i)=>`<button type="button" class="s5capListItem ${i===S5.cap?'active':''}" aria-pressed="${i===S5.cap?'true':'false'}" data-s5c-cap="${i}"><span class="n">${String(i+1).padStart(2,'0')}</span><span class="ic">${I(x[2])}</span><b>${esc(x[0])}</b></button>`).join('')}</div>
    <div class="s5photoStage"><img class="s5photoImg" src="${assetUrl(CAP_IMAGES[S5.cap])}" alt="" loading="eager" decoding="async"><div class="s5photoShade"></div><div class="s5photoLabel"><span class="s5photoIcon">${I(c[2])}</span><div><small class="s5photoCount">${String(S5.cap+1).padStart(2,'0')} / 07</small><h3 class="s5photoTitle">${esc(c[0])}</h3></div></div></div>
    <div class="s5detailCard"><div class="s5detailHead"><span class="s5detailIcon">${I(c[2])}</span><div><small class="s5detailCount">${String(S5.cap+1).padStart(2,'0')} / 07</small><h3 class="s5detailTitle">${esc(c[0])}</h3></div></div><p class="s5detailText">${esc(c[1])}</p><div class="s5detailFooter"><button type="button" data-s5c-prev aria-label="Previous capability">‹</button><div>${t.caps.map((_,i)=>`<i data-s5c-dot="${i}" class="${i===S5.cap?'on':''}"></i>`).join('')}</div><button type="button" data-s5c-next aria-label="Next capability">›</button></div></div>
  </section>`;}
  function infraPanel(t){const d=t.infra[S5.infra];return `<section class="s5cleanPanel s5infraPanel ${S5.tab==='infra'?'active':''}" data-s5-panel="infra" ${S5.tab==='infra'?'':'hidden'}>
    <div class="s5infraHero"><img class="s5infraHeroImg" src="${assetUrl(INFRA_IMAGES[S5.infra])}" alt="" loading="lazy" decoding="async"><div class="s5infraOverlay"><small>02</small><h3>${esc(t.infraTitle)}</h3><p>${esc(t.infraSub)}</p></div></div>
    <div class="s5infraContent"><div class="s5exactText"><span>${I('shield')}</span><p>${esc(t.infraExact)}</p></div><div class="s5infraPillars">${t.infra.map((x,i)=>`<button type="button" class="${i===S5.infra?'active':''}" aria-pressed="${i===S5.infra?'true':'false'}" data-s5c-infra="${i}"><span>${I(x[2])}</span><div><b>${esc(x[0])}</b><small>${esc(x[1])}</small></div></button>`).join('')}</div><div class="s5infraFocus"><span class="s5infraFocusIcon">${I(d[2])}</span><div><small>${esc(t.focusLabel)}</small><b class="s5infraFocusTitle">${esc(d[0])}</b><p class="s5infraFocusText">${esc(d[1])}</p></div></div></div>
  </section>`;}
  function contPanel(t){const d=t.cont[S5.cont];return `<section class="s5cleanPanel s5contPanel ${S5.tab==='cont'?'active':''}" data-s5-panel="cont" ${S5.tab==='cont'?'':'hidden'}>
    <div class="s5contHero"><img class="s5contHeroImg" src="${assetUrl(CONT_IMAGES[S5.cont])}" alt="" loading="lazy" decoding="async"><div class="s5contOverlay"><small>03</small><h3>${esc(t.contTitle)}</h3><p>${esc(t.contSub)}</p></div></div>
    <div class="s5contContent"><div class="s5contStatements"><div><span>01</span><p>${esc(t.contExact1)}</p></div><div><span>02</span><p>${esc(t.contExact2)}</p></div></div><div class="s5contReadiness">${t.cont.map((x,i)=>`<button type="button" class="${i===S5.cont?'active':''}" aria-pressed="${i===S5.cont?'true':'false'}" data-s5c-cont="${i}"><span>${I(x[2])}</span><b>${esc(x[0])}</b><small>${esc(x[1])}</small></button>`).join('')}</div><div class="s5contFocus"><span class="s5contFocusIcon">${I(d[2])}</span><div><small>${esc(t.focusLabel)}</small><b class="s5contFocusTitle">${esc(d[0])}</b><p class="s5contFocusText">${esc(d[1])}</p></div></div></div>
  </section>`;}
  window.whyCapabilitiesSlide=function(){const t=T();return `<div class="frame"><div class="body s5cleanBody">${hdr('',t.title,t.subtitle,4)}${tabbar(t)}<div class="s5cleanHost">${capsPanel(t)}${infraPanel(t)}${contPanel(t)}</div></div></div>`;};

  function rerender(){const s=document.querySelector('#slides>.slide.active');if(!s||state.slide!==4)return;s.innerHTML=whyCapabilitiesSlide();requestAnimationFrame(()=>{fit();centerActiveNav(true);syncNavSlider();});}
  function activeSlide(){const s=document.querySelector('#slides>.slide.active');return s&&state.slide===4?s:null;}
  function setImg(img,src){if(!img||!src)return;const url=assetUrl(src);if(img.src===url)return;img.classList.add('is-swapping');const next=new Image();next.onload=()=>{img.src=url;requestAnimationFrame(()=>img.classList.remove('is-swapping'));};next.onerror=()=>img.classList.remove('is-swapping');next.src=url;}
  function setActive(container,selector,idx){const root=typeof container==='string'?document.querySelector(container):container;if(!root)return;root.querySelectorAll(selector).forEach((b,i)=>{const on=i===idx;b.classList.toggle('active',on);b.setAttribute('aria-pressed',on?'true':'false');});}
  function warm(list){(list||[]).forEach(src=>{const img=new Image();img.decoding='async';img.src=assetUrl(src);});}
  if(!window.__s5CleanWarmed){window.__s5CleanWarmed=true;setTimeout(()=>{warm(CAP_IMAGES);warm(INFRA_IMAGES);warm(CONT_IMAGES);},120);}
  function updateCaps(){const s=activeSlide();if(!s)return;const t=T(),c=t.caps[S5.cap];setActive(s,'.s5capListItem',S5.cap);setImg(s.querySelector('.s5photoImg'),CAP_IMAGES[S5.cap]);const count=String(S5.cap+1).padStart(2,'0')+' / 07';const fields=[['.s5photoIcon',I(c[2]),true],['.s5photoCount',count],['.s5photoTitle',esc(c[0]),true],['.s5detailIcon',I(c[2]),true],['.s5detailCount',count],['.s5detailTitle',esc(c[0]),true],['.s5detailText',esc(c[1]),true]];fields.forEach(([sel,val,html])=>{const el=s.querySelector(sel);if(el){if(html)el.innerHTML=val;else el.textContent=val;}});s.querySelectorAll('[data-s5c-dot]').forEach((d,i)=>d.classList.toggle('on',i===S5.cap));pulse(s.querySelector('.s5detailCard'));}
  function updateInfra(){const s=activeSlide();if(!s)return;const t=T(),d=t.infra[S5.infra];setActive(s,'.s5infraPillars button',S5.infra);setImg(s.querySelector('.s5infraHeroImg'),INFRA_IMAGES[S5.infra]);const iconEl=s.querySelector('.s5infraFocusIcon');if(iconEl)iconEl.innerHTML=I(d[2]);const title=s.querySelector('.s5infraFocusTitle');if(title)title.textContent=d[0];const text=s.querySelector('.s5infraFocusText');if(text)text.textContent=d[1];pulse(s.querySelector('.s5infraFocus'));}
  function updateCont(){const s=activeSlide();if(!s)return;const t=T(),d=t.cont[S5.cont];setActive(s,'.s5contReadiness button',S5.cont);setImg(s.querySelector('.s5contHeroImg'),CONT_IMAGES[S5.cont]);const iconEl=s.querySelector('.s5contFocusIcon');if(iconEl)iconEl.innerHTML=I(d[2]);const title=s.querySelector('.s5contFocusTitle');if(title)title.textContent=d[0];const text=s.querySelector('.s5contFocusText');if(text)text.textContent=d[1];pulse(s.querySelector('.s5contFocus'));}
  function pulse(el){if(!el)return;el.classList.remove('s5focusPulse');void el.offsetWidth;el.classList.add('s5focusPulse');}
  if(!window.__s5CleanBound){window.__s5CleanBound=true;document.addEventListener('click',e=>{let q=e.target.closest('[data-s5c-tab]');if(q){S5.tab=q.dataset.s5cTab;rerender();return;}q=e.target.closest('[data-s5c-cap]');if(q){const v=+q.dataset.s5cCap;if(S5.cap!==v){S5.cap=v;updateCaps();}return;}if(e.target.closest('[data-s5c-prev]')){S5.cap=(S5.cap+6)%7;updateCaps();return;}if(e.target.closest('[data-s5c-next]')){S5.cap=(S5.cap+1)%7;updateCaps();return;}q=e.target.closest('[data-s5c-infra]');if(q){const v=+q.dataset.s5cInfra;if(S5.infra!==v){S5.infra=v;updateInfra();}return;}q=e.target.closest('[data-s5c-cont]');if(q){const v=+q.dataset.s5cCont;if(S5.cont!==v){S5.cont=v;updateCont();}return;}});}
})();
