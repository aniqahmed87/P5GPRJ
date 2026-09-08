/* Parent navigation bridge. No changes to map, architecture or dashboard modules. */
(function(){
 'use strict';
 fit=function(){
  const stage=document.querySelector('.stage'),vp=document.getElementById('viewport');if(!stage||!vp)return;
  const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;
  const scale=Math.min(w/1440,h/900),designWidth=w/scale,designHeight=h/scale;
  vp.style.zoom='1';vp.style.width=designWidth+'px';vp.style.height=designHeight+'px';vp.style.transform=`scale(${scale})`;
  requestAnimationFrame(()=>{const arch=document.querySelector('.slide.active .archStage');if(arch)archWire(arch);});
 };
 const originalGo=go;
 go=function(i){const next=(i+TOTAL_SLIDES)%TOTAL_SLIDES;if(next===0){if(parent!==window)parent.postMessage({type:'pulse-about-agenda'},'*');return;}originalGo(next);if(parent!==window)parent.postMessage({type:'pulse-about-slide',slide:next},'*');};window.go=go;
 window.addEventListener('message',ev=>{
  if(ev.source!==parent||ev.data?.type!=='pulse-shell')return;
  const d=ev.data;if(!Number.isInteger(d.slide)||d.slide<1||d.slide>6)return;
  const changed=state.theme!==d.theme||state.lang!==d.lang;
  if(d.theme==='light'||d.theme==='dark')state.theme=d.theme;
  if(d.lang==='en'||d.lang==='ar')state.lang=d.lang;
  closeOpsOverlay();clearInterval(window.__tw);state.slide=d.slide;
  if(changed)render();else setActiveSlide(d.slide,1,true);
  document.querySelector('.stage').scrollTop=0;requestAnimationFrame(fit);
 });
 state.slide=1;state.lang='en';render();requestAnimationFrame(fit);
})();
