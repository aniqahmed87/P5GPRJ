/** Hosted/browser enhancements. Usually no manual editing is needed. */

(() => {
  'use strict';
  const root=document.documentElement, body=document.body;
  const stage=document.querySelector('.stage');
  const badge=document.getElementById('hostedStatus');

  requestAnimationFrame(()=>requestAnimationFrame(()=>body.classList.add('boot-ready')));

  let badgeTimer;
  function showNetworkState(){
    if(!badge)return;
    const online=navigator.onLine;
    badge.classList.toggle('offline',!online);
    badge.innerHTML=`<i></i><span>${online?'Hosted · online maps enabled':'Offline · embedded map fallback active'}</span>`;
    badge.classList.add('show');
    clearTimeout(badgeTimer);
    badgeTimer=setTimeout(()=>badge.classList.remove('show'),2200);
  }
  addEventListener('online',showNetworkState);
  addEventListener('offline',showNetworkState);

  const fullBtn=document.getElementById('fullBtn');
  if(fullBtn&&!document.documentElement.requestFullscreen)fullBtn.hidden=true;

  let gesture=null;
  const interactive='button,a,input,select,textarea,.pocMapShell,.osmMap,.introNativeMap,.introNativeShell,.dashboardShell,.archx-click,.archx-detail,.pocSiteList,.navrail';
  if(stage){
    stage.addEventListener('pointerdown',e=>{
      if(e.target.closest(interactive))return;
      gesture={x:e.clientX,y:e.clientY,t:performance.now(),id:e.pointerId};
    },{passive:true});
    stage.addEventListener('pointerup',e=>{
      if(!gesture||gesture.id!==e.pointerId)return;
      const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y,dt=performance.now()-gesture.t;
      gesture=null;
      if(dt<900&&Math.abs(dx)>68&&Math.abs(dx)>Math.abs(dy)*1.35&&typeof window.go==='function'){
        window.go(state.slide+(dx<0?1:-1));
      }
    },{passive:true});
    stage.addEventListener('pointercancel',()=>gesture=null,{passive:true});
  }

  const nav=document.getElementById('navRail');
  let hashSync=false;
  function applyHash(){
    const m=location.hash.match(/^#slide-(\d+)$/);
    if(!m||typeof window.go!=='function')return;
    const idx=Math.max(0,Math.min(TOTAL_SLIDES-1,Number(m[1])-1));
    if(idx!==state.slide)window.go(idx);
  }
  function syncHash(){
    if(hashSync)return;
    const desired='#slide-'+(state.slide+1);
    if(location.hash!==desired){
      hashSync=true;
      try{history.replaceState(null,'',desired)}
      catch(_){try{location.hash=desired}catch(__){}}
      hashSync=false;
    }
  }
  if(nav){
    new MutationObserver(syncHash).observe(nav,{subtree:true,attributes:true,attributeFilter:['class','aria-current']});
  }
  addEventListener('hashchange',()=>{if(!hashSync)applyHash()});
  if(location.hash)setTimeout(applyHash,80);else syncHash();

  const setViewportUnit=()=>root.style.setProperty('--app-vh',(innerHeight*.01)+'px');
  setViewportUnit(); addEventListener('resize',setViewportUnit,{passive:true});
})();
