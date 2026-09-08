/* V20 — preserve the supplied fibre scene in its own document.
 * The bridge works from file://: trust the specific child window, not its origin.
 * No project data is sent to the decorative scene. */
(function(){
'use strict';
let stage=null,frame=null,phase='idle',watchdog=0,readyTimer=0,raf=0,arrivalTimer=0;
const $=s=>document.querySelector(s);
function send(type,detail={}){frame?.contentWindow?.postMessage({channel:'pulse-cover',type,...detail},'*');}
function render(){return '<section class="pulse-cover-host" aria-label="Pulse 5G introduction"></section>';}
function mount(){
 if(stage)return;
 phase='cover';stage=document.createElement('div');stage.id='cover-stage';stage.dataset.phase='cover';
 const theme=document.body.classList.contains('light')?'light':'dark';
 stage.innerHTML=`<iframe id="pulse-cover-frame" src="cover/index.html?theme=${theme}" title="Pulse 5G introduction" allow="fullscreen"></iframe><a class="cover-recovery" href="#agenda" hidden>Open Overview <span aria-hidden="true">→</span></a>`;
 document.body.appendChild(stage);frame=stage.querySelector('iframe');
 frame.addEventListener('load',()=>setTheme(document.body.classList.contains('light')?'light':'dark'));
 readyTimer=setTimeout(()=>{const fallback=stage?.querySelector('.cover-recovery');if(fallback)fallback.hidden=false;},5000);
}
function setTheme(theme){send('theme',{theme});}
function start(){if(phase==='cover')send('begin');}
function depart(){
 if(phase!=='cover')return;
 phase='flight';stage.dataset.phase='flight';document.body.classList.add('cover-in-flight');
 // Build Overview behind the opaque scene while the camera accelerates.
 location.hash='agenda';watchdog=setTimeout(()=>arrive(true),8000);
}
function finish(){
 cancelAnimationFrame(raf);clearTimeout(watchdog);clearTimeout(readyTimer);clearTimeout(arrivalTimer);
 send('dispose');stage?.remove();stage=null;frame=null;phase='idle';
 document.body.classList.remove('cover-in-flight','cover-landing');$('#main')?.classList.remove('cinematic-arrival');
 if($('#main')?.dataset.page==='agenda')$('#main').focus({preventScroll:true});
}
function arrive(immediate=false){
 if(phase!=='flight')return;
 phase='landing';stage.dataset.phase='landing';clearTimeout(watchdog);
 document.body.classList.add('cover-landing');
 const main=$('#main');if(main?.dataset.page!=='agenda'){finish();return;}
 main.classList.add('cinematic-arrival');window.PulseFX?.enter(main,1,true);
 if(immediate){finish();return;}
 const began=performance.now();
 const tick=now=>{
  if(!stage||phase!=='landing')return;
  const p=Math.min(1,(now-began)/900),ease=1-Math.pow(1-p,3);
  const radius=Math.hypot(innerWidth,innerHeight)*.52*ease;
  // An aperture opens at the spiral's vanishing point onto the real page.
  const mask=`radial-gradient(circle at 50% 50%, transparent ${Math.max(0,radius-54)}px, #000 ${radius+54}px)`;
  stage.style.maskImage=mask;stage.style.webkitMaskImage=mask;stage.style.opacity=String(1-Math.pow(p,3));
  if(p<1)raf=requestAnimationFrame(tick);else finish();
 };
 raf=requestAnimationFrame(tick);arrivalTimer=setTimeout(finish,1800);
}
function onRoute(route){
 if(!stage)return;
 if(route==='cover'&&phase==='cover')return;
 if(route==='agenda'&&(phase==='flight'||phase==='landing'))return;
 finish();
}
addEventListener('message',ev=>{
 if(!frame||ev.source!==frame.contentWindow||ev.data?.channel!=='pulse-cover')return;
 switch(ev.data.type){
  case 'ready':clearTimeout(readyTimer);stage.querySelector('.cover-recovery').hidden=true;setTheme(document.body.classList.contains('light')?'light':'dark');break;
  case 'theme':if(['light','dark'].includes(ev.data.theme))document.dispatchEvent(new CustomEvent('pulse:cover-theme',{detail:ev.data.theme}));break;
  case 'depart':depart();break;
  case 'arrive':arrive();break;
  case 'skip':if(phase==='flight')arrive(true);else if(phase==='landing')finish();break;
 }
});
document.addEventListener('keydown',ev=>{
 if(phase!=='flight'&&phase!=='landing')return;
 if(['Escape','Enter',' ','ArrowLeft','ArrowRight','PageUp','PageDown','Tab'].includes(ev.key)){
  ev.preventDefault();ev.stopImmediatePropagation();
  if(ev.key==='Escape'){if(phase==='flight')arrive(true);else finish();}
 }
},true);
window.PulseCover={render,mount,start,onRoute,setTheme,isEntering:()=>phase==='flight'};
})();
