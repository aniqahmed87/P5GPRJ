
(function(){
"use strict";
const root=document.documentElement;
let flight=null,flightStrength=0,flightBank=0,baseF=820,disposed=false,intersectionObserver;
const notify=(type,detail={})=>{if(parent!==window)parent.postMessage({channel:'pulse-cover',type,...detail},'*');};
function startJourney(){
 if(flight||disposed)return;
 flight={started:performance.now(),originTravel:travel,pausedAt:0,elapsed:0,arrived:false};hero=null;flash=0;resetButton();
 begin.disabled=true;begin.setAttribute('aria-label','Entering project overview');themeButton.disabled=true;
 document.body.classList.add('departing');document.body.dataset.phase='flight';
 notify('depart');
}
function applyTheme(theme){
 if(theme!=='light'&&theme!=='dark')return;
 root.setAttribute('data-theme',theme);updateThemeLabel();readColors();
}
function dispose(){disposed=true;running=false;cancelAnimationFrame(frameId);clearTimeout(rt);intersectionObserver?.disconnect();}
addEventListener('message',ev=>{
 if(ev.source!==parent||ev.data?.channel!=='pulse-cover')return;
 if(ev.data.type==='theme')applyTheme(ev.data.theme);
 if(ev.data.type==='begin')startJourney();
 if(ev.data.type==='dispose')dispose();
});
document.addEventListener('keydown',ev=>{
 if(flight){
  if(['Escape','Enter',' ','ArrowLeft','ArrowRight','PageUp','PageDown','Tab'].includes(ev.key)){
   ev.preventDefault();if(ev.key==='Escape')notify('skip');
  }
 }else if(['ArrowRight','PageDown'].includes(ev.key)){ev.preventDefault();startJourney();}
});
// Presentation motion is deliberately enabled, regardless of the operating-system
// accessibility preference. Off-screen and hidden-tab pausing is still preserved.
const reduce=false;
const initialTheme=new URLSearchParams(location.search).get('theme');
if(initialTheme==='light'||initialTheme==='dark')root.setAttribute('data-theme',initialTheme);
else if(matchMedia('(prefers-color-scheme: light)').matches)root.setAttribute('data-theme','light');
requestAnimationFrame(()=>document.body.classList.add('go'));

const themeButton=document.getElementById('tog');
function updateThemeLabel(){
  const next=root.getAttribute('data-theme')==='light'?'dark':'light';
  themeButton.setAttribute('aria-label','Switch to '+next+' mode');
  themeButton.title='Switch to '+next+' mode';
}
updateThemeLabel();
themeButton.addEventListener('click',()=>{
  root.setAttribute('data-theme',root.getAttribute('data-theme')==='light'?'dark':'light');
  updateThemeLabel(); readColors(); notify('theme',{theme:root.getAttribute('data-theme')});
});
const begin=document.getElementById('begin');
const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
let buttonBox=null;
function resetButton(){
  buttonBox=null;
  begin.style.removeProperty('--button-rx');
  begin.style.removeProperty('--button-ry');
  begin.style.removeProperty('--shine-x');
}
begin.addEventListener('pointerenter',()=>{
  if(finePointer.matches&&!reduce) buttonBox=begin.getBoundingClientRect();
});
begin.addEventListener('pointermove',e=>{
  if(reduce||!finePointer.matches||!buttonBox) return;
  const x=Math.max(-.5,Math.min(.5,(e.clientX-buttonBox.left)/buttonBox.width-.5));
  const y=Math.max(-.5,Math.min(.5,(e.clientY-buttonBox.top)/buttonBox.height-.5));
  begin.style.setProperty('--button-rx',(-y*7).toFixed(2)+'deg');
  begin.style.setProperty('--button-ry',(x*9).toFixed(2)+'deg');
  begin.style.setProperty('--shine-x',(50+x*55).toFixed(1)+'%');
});
begin.addEventListener('pointerleave',resetButton);
begin.addEventListener('pointercancel',resetButton);
begin.addEventListener('blur',resetButton);
begin.addEventListener('click',e=>{
  if(!reduce){
    const r=begin.getBoundingClientRect(), d=document.createElement('span');
    d.className='rip'; d.setAttribute('aria-hidden','true');
    d.style.left=(e.detail===0?r.width/2:e.clientX-r.left)+'px';
    d.style.top=(e.detail===0?r.height/2:e.clientY-r.top)+'px';
    d.style.width=d.style.height=Math.max(r.width,r.height)+'px';
    begin.appendChild(d); setTimeout(()=>d.remove(),800);
  }
  startJourney();
  // Retain the supplied cover's public integration event.
  begin.dispatchEvent(new CustomEvent('pulse:begin',{bubbles:true}));
});

/* =========================================================
   Renderer
   ========================================================= */
const cvs=document.getElementById('net'), ctx=cvs.getContext('2d');
const gcv=document.createElement('canvas'), gtx=gcv.getContext('2d');
let W=0,H=0,DPR=1,C={},VPx=0,VPy=0,F=820,SC=1,narrow=false;

let blurOK=false;
(function(){ const t=document.createElement('canvas').getContext('2d');
  t.filter='blur(2px)'; blurOK=t.filter==='blur(2px)'; })();

/* world units */
const ZN=60, ZF=2700;
const R_CLAD=150, R_HELIX=64, R_CORE=11, R_GATE=196;
const SPEED=150;                 // slower than a tunnel screensaver
const HELIX_K=0.0058;
const RING_GAP=200;
const NL=8, NW=6;

/* The network, laid out along the fibre. Passing through these is what
   breaks the trance: an event every few seconds instead of endless tube. */
const GATE_GAP=800;
const GATES=[
  {t:'gnb', m:'gNodeB',          s:'5G radio access'},
  {t:'upf', m:'UPF',             s:'Edge core'},
  {t:'sec', m:'MACsec',          s:'Layer-1 encryption'},
  {t:'mux', m:'ROADM',           s:'DWDM multiplexer'},
  {t:'amp', m:'EDFA',            s:'Optical amplifier'},
  {t:'dmx', m:'ROADM',           s:'DWDM demultiplexer'},
  {t:'ent', m:'Enterprise site', s:'Private network edge'}
];
const NG=GATES.length;

function readColors(){
  const cs=getComputedStyle(root), g=n=>cs.getPropertyValue(n).trim();
  C={ bg:g('--bg'), core:g('--core'), clad:g('--clad'), struct:g('--struct'), label:g('--label'),
      spec:[g('--s1'),g('--s2'),g('--s3'),g('--s4'),g('--s5'),g('--s6')],
      bloom:parseFloat(g('--bloom'))||0, grain:parseFloat(g('--grain'))||0,
      mono:g('--mono'), dark:root.getAttribute('data-theme')!=='light' };
}
readColors();

const grain=document.createElement('canvas'); grain.width=grain.height=128;
(function(){ const gc=grain.getContext('2d'), id=gc.createImageData(128,128);
  for(let i=0;i<id.data.length;i+=4){ const v=112+Math.random()*32;
    id.data[i]=id.data[i+1]=id.data[i+2]=v; id.data[i+3]=255; }
  gc.putImageData(id,0,0); })();
let grainPat=null;

function resize(){
  const r=cvs.getBoundingClientRect();
  DPR=Math.min(devicePixelRatio||1,2);
  W=Math.max(320,r.width); H=Math.max(240,r.height);
  cvs.width=Math.round(W*DPR); cvs.height=Math.round(H*DPR);
  ctx.setTransform(DPR,0,0,DPR,0,0);
  gcv.width=Math.max(1,Math.round(W/3)); gcv.height=Math.max(1,Math.round(H/3));
  narrow=W<860;
  VPx=W*0.44; VPy=H*0.67;          // off-centre: a shot, not a screensaver
  baseF=Math.max(520,Math.min(1150,H*0.98)); F=baseF;
  SC=F/820;
  grainPat=ctx.createPattern(grain,'repeat');
}

/* --- bend, with the camera looking along the tangent --- */
const A1=170,W1=.00085,A2=60,W2=.0021;
const B1=110,V1=.0007, B2=45,V2=.0017;
const bx=s=>A1*Math.sin(s*W1)+A2*Math.sin(s*W2);
const by=s=>B1*Math.cos(s*V1)+B2*Math.sin(s*V2);
const dbx=s=>A1*W1*Math.cos(s*W1)+A2*W2*Math.cos(s*W2);
const dby=s=>-B1*V1*Math.sin(s*V1)+B2*V2*Math.cos(s*V2);

let travel=0, cam={x:0,y:0,dx:0,dy:0}, cox=0, coy=0;
function syncCam(){
  cam={x:bx(travel),y:by(travel),dx:dbx(travel),dy:dby(travel)};
  /* the camera rides off the fibre axis, so the vanishing point never
     sits at the centre of the rings — kills the tunnel-hypnosis */
  cox=(34+Math.sin(travel*.00042)*17)*(1-flightStrength);
  coy=(-27+Math.cos(travel*.00035)*13)*(1-flightStrength);
}
function offX(d){ return (bx(travel+d)-cam.x-cam.dx*d)*(1-flightStrength*.96)-cox; }
function offY(d){ return (by(travel+d)-cam.y-cam.dy*d)*(1-flightStrength*.96)-coy; }

const NS=76, DEPTHS=[];
for(let i=0;i<=NS;i++) DEPTHS.push(ZN*Math.pow(ZF/ZN,i/NS));
function fog(d){
  const far=1-Math.pow(d/ZF,.62), near=Math.min(1,(d-ZN)/150);
  return Math.max(0,far*near);
}
function sx(d,lx){ return VPx+(offX(d)+lx)*(F/d); }
function sy(d,ly){ return VPy+(offY(d)+ly)*(F/d); }

/* Depth-banded stroking. Per-segment stroking costs ~900 draw calls a frame;
   alpha and width vary smoothly enough that a dozen bands look identical. */
const BANDS=11, PER=Math.ceil(NS/BANDS), _p={x:0,y:0};
function bandCurve(at,color,aMul,wOf){
  ctx.save(); ctx.strokeStyle=color; ctx.lineCap='round'; ctx.lineJoin='round';
  for(let c=BANDS-1;c>=0;c--){
    const lo=c*PER, hi=Math.min(NS,(c+1)*PER);
    if(hi<=lo) continue;
    const dm=DEPTHS[(lo+hi)>>1], a=fog(dm)*aMul;
    if(a<=.005) continue;
    ctx.globalAlpha=a; ctx.lineWidth=wOf(F/dm);
    ctx.beginPath();
    for(let i=hi;i>=lo;i--){ at(DEPTHS[i]); i===hi?ctx.moveTo(_p.x,_p.y):ctx.lineTo(_p.x,_p.y); }
    ctx.stroke();
  }
  ctx.restore();
}

/* --- network elements --------------------------------------------------- */
function ringPath(cx,cy,r){ ctx.beginPath(); ctx.arc(cx,cy,r,0,6.2832); }

function drawGate(g,d,a,hot){
  const k=F/d, cx=sx(d,0), cy=sy(d,0);
  const R=R_GATE*k, Ri=R_CLAD*k;
  if(R>Math.max(W,H)*2.4) return;
  const lw=Math.max(.6,Math.min(2.6,1.1*k*SC));
  const glow=hot*22;
  ctx.save();
  ctx.lineCap='round'; ctx.lineJoin='round';
  ctx.strokeStyle=C.struct; ctx.globalAlpha=a*(.55+hot*.45); ctx.lineWidth=lw;
  if(C.dark&&hot>.02){ ctx.shadowColor=C.spec[3]; ctx.shadowBlur=glow; }

  ringPath(cx,cy,R); ctx.stroke();
  ringPath(cx,cy,Ri); ctx.globalAlpha=a*.4; ctx.stroke();
  ctx.globalAlpha=a*(.55+hot*.45);

  /* fine graduation ticks — reads as engineered rather than decorative */
  if(R>34){
    const n=36; ctx.beginPath();
    for(let i=0;i<n;i++){
      const th=i*6.2832/n, c1=Math.cos(th), s1=Math.sin(th);
      const t=(i%9===0)?R*.10:R*.045;
      ctx.moveTo(cx+c1*R, cy+s1*R); ctx.lineTo(cx+c1*(R-t), cy+s1*(R-t));
    }
    ctx.globalAlpha=a*.4; ctx.lineWidth=Math.max(.4,lw*.6); ctx.stroke();
    ctx.globalAlpha=a*(.55+hot*.45); ctx.lineWidth=lw;
  }

  const mid=(R+Ri)/2;
  if(g.t==='gnb'){
    /* three sector antennas plus the panel array between them */
    for(let i=0;i<12;i++){
      const th=i*6.2832/12, c1=Math.cos(th), s1=Math.sin(th);
      const sec=(i%4===0);
      ctx.globalAlpha=a*(sec?.95:.45); ctx.lineWidth=lw*(sec?2.6:1.2);
      ctx.beginPath();
      ctx.moveTo(cx+c1*(Ri+R*.03), cy+s1*(Ri+R*.03));
      ctx.lineTo(cx+c1*(R-R*.03),  cy+s1*(R-R*.03));
      ctx.stroke();
    }
    ctx.strokeStyle=C.spec[4]; ctx.globalAlpha=a*.5; ctx.lineWidth=lw;
    for(let q=1;q<=3;q++){ ringPath(cx,cy,R*(1+q*.16)); ctx.stroke(); }
  }
  else if(g.t==='upf'){
    ctx.beginPath();
    for(let i=0;i<6;i++){ const th=i*1.0472+Math.PI/6;
      const x=cx+Math.cos(th)*mid, y=cy+Math.sin(th)*mid; i?ctx.lineTo(x,y):ctx.moveTo(x,y); }
    ctx.closePath(); ctx.stroke();
    ctx.globalAlpha=a*.5; ctx.beginPath();
    for(let i=0;i<6;i++){ const th=i*1.0472+Math.PI/6;
      ctx.moveTo(cx+Math.cos(th)*Ri*.45, cy+Math.sin(th)*Ri*.45);
      ctx.lineTo(cx+Math.cos(th)*mid,    cy+Math.sin(th)*mid); }
    ctx.stroke();
  }
  else if(g.t==='sec'){
    /* interlocking lattice — a sealed gate */
    ctx.globalAlpha=a*.75; ctx.beginPath();
    for(let i=0;i<18;i++){
      const t1=i*6.2832/18, t2=t1+6.2832*5/18;
      ctx.moveTo(cx+Math.cos(t1)*mid, cy+Math.sin(t1)*mid);
      ctx.lineTo(cx+Math.cos(t2)*mid, cy+Math.sin(t2)*mid);
    }
    ctx.lineWidth=Math.max(.4,lw*.55); ctx.stroke();
  }
  else if(g.t==='mux'||g.t==='dmx'){
    /* iris: six wavelength wedges, converging in or fanning out */
    const out=g.t==='dmx';
    for(let i=0;i<6;i++){
      const th=i*1.0472+(out?.26:-.26), c1=Math.cos(th), s1=Math.sin(th);
      ctx.strokeStyle=C.spec[i]; ctx.globalAlpha=a*.9; ctx.lineWidth=lw*2.2;
      ctx.beginPath();
      ctx.moveTo(cx+c1*Ri*.34, cy+s1*Ri*.34);
      ctx.lineTo(cx+c1*R,      cy+s1*R);
      ctx.stroke();
      ctx.globalAlpha=a*.45; ctx.lineWidth=lw;
      ctx.beginPath(); ctx.arc(cx,cy,mid, th-.18, th+.18); ctx.stroke();
    }
    ctx.strokeStyle=C.struct;
  }
  else if(g.t==='amp'){
    /* chevrons pointing down-fibre: gain */
    ctx.strokeStyle=C.spec[2]; ctx.globalAlpha=a*.85; ctx.lineWidth=lw*1.6;
    for(let i=0;i<10;i++){
      const th=i*6.2832/10, c1=Math.cos(th), s1=Math.sin(th);
      const px=cx+c1*mid, py=cy+s1*mid, w=R*.10;
      ctx.beginPath();
      ctx.moveTo(px-s1*w-c1*w, py+c1*w-s1*w);
      ctx.lineTo(px+c1*w*1.3,  py+s1*w*1.3);
      ctx.lineTo(px+s1*w-c1*w, py-c1*w-s1*w);
      ctx.stroke();
    }
    ctx.strokeStyle=C.struct; ctx.globalAlpha=a*.4;
    ringPath(cx,cy,R*.78); ctx.stroke();
  }
  else if(g.t==='ent'){
    ctx.globalAlpha=a*.8; ctx.lineWidth=lw*1.4;
    ctx.beginPath();
    for(let i=0;i<4;i++){ const th=i*1.5708+.7854;
      const x=cx+Math.cos(th)*mid, y=cy+Math.sin(th)*mid; i?ctx.lineTo(x,y):ctx.moveTo(x,y); }
    ctx.closePath(); ctx.stroke();
    ctx.globalAlpha=a*.5; ctx.lineWidth=lw;
    ctx.beginPath();
    for(let i=0;i<8;i++){ const th=i*.7854;
      ctx.moveTo(cx+Math.cos(th)*R,      cy+Math.sin(th)*R);
      ctx.lineTo(cx+Math.cos(th)*R*1.24, cy+Math.sin(th)*R*1.24); }
    ctx.stroke();
  }
  ctx.restore();
}

function drawGateLabel(g,d,a){
  const k=F/d, cx=sx(d,0), cy=sy(d,0), R=R_GATE*k;
  const size=Math.max(10,Math.min(26,15*k*SC));
  const lx=cx+R*.80, ly=cy+R*.62;
  ctx.save();
  ctx.globalAlpha=a;
  ctx.strokeStyle=C.struct; ctx.lineWidth=1;
  ctx.beginPath();
  ctx.moveTo(cx+R*.62, cy+R*.48); ctx.lineTo(lx, ly);
  ctx.lineTo(lx+size*4.6, ly); ctx.stroke();
  ctx.textAlign='left'; ctx.textBaseline='bottom';
  ctx.fillStyle=C.core; ctx.font='500 '+size.toFixed(1)+'px '+C.mono;
  ctx.fillText(g.m, lx+size*.28, ly-size*.34);
  ctx.globalAlpha=a*.72; ctx.fillStyle=C.label;
  ctx.font=(size*.72).toFixed(1)+'px '+C.mono;
  ctx.textBaseline='top';
  ctx.fillText(g.s, lx+size*.28, ly+size*.22);
  ctx.restore();
}

/* --- traffic --- */
const motes=[];
for(let i=0;i<30;i++) motes.push({ d:ZN+Math.random()*(ZF-ZN), w:i%NW, sp:.8+Math.random()*.55 });
let hero=null, flash=0, cycT=0, held=0;
const CYCLE=10;
function launch(){ hero={d:ZF}; cycT=0; }

const hState=document.getElementById('hState'), hMs=document.getElementById('hMs'), hDot=document.getElementById('hDot');
let lastState='', ms=4.2;
function setState(s,c){ if(s===lastState) return; lastState=s; hState.textContent=s;
  hDot.style.background=c; hDot.style.boxShadow='0 0 8px '+c; }

/* =========================================================
   Frame
   ========================================================= */
let t0=performance.now(), prev=t0, inView=true, visible=!document.hidden;
let running=visible&&!reduce, frameId=0;

function frame(now){
  frameId=0;
  if(disposed||(!running&&!reduce)) return;
  const time=reduce?0:(now-t0)/1000;
  const dt=reduce?0:Math.max(0,Math.min(.05,(now-prev)/1000)); prev=now;
  if(flight){
    flight.elapsed=Math.max(0,(now-flight.started)/1000);
    const p=Math.min(1,flight.elapsed/2.35),steer=1-Math.pow(1-p,3);
    flightStrength=p*p*(3-2*p);flightBank=flightStrength*1.05;
    VPx=W*(.44+.06*steer);VPy=H*(.67-.17*steer);F=baseF*(1+flightStrength*.65);
    if(p===1&&!flight.arrived){flight.arrived=true;document.body.dataset.phase='arrival';notify('arrive');}
  }
  const velocity=SPEED*(1+23*flightStrength*flightStrength);
  if(flight){
    // Integrate the acceleration curve analytically: distance and duration do not
    // depend on frame count, even with software rendering on a managed laptop.
    const p=Math.min(1,flight.elapsed/2.35);
    const ramp=1.8*Math.pow(p,5)-2*Math.pow(p,6)+(4/7)*Math.pow(p,7);
    travel=flight.originTravel+SPEED*2.35*(p+23*ramp)+Math.max(0,flight.elapsed-2.35)*SPEED*24;
  }else travel+=velocity*dt;
  syncCam();
  cycT+=dt; if(!flight&&!hero&&cycT>=CYCLE) launch();

  ctx.setTransform(DPR,0,0,DPR,0,0);
  ctx.fillStyle=C.bg; ctx.fillRect(0,0,W,H);

  ctx.save();
  ctx.translate(VPx,VPy); ctx.rotate(Math.sin(time*.1)*.014-flightBank); ctx.translate(-VPx,-VPy);

  /* light at the far end */
  const vx=sx(ZF,0), vy=sy(ZF,0);
  const rg=ctx.createRadialGradient(vx,vy,0,vx,vy,F*.55);
  rg.addColorStop(0,C.dark?'rgba(120,175,225,.20)':'rgba(45,100,150,.13)');
  rg.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=rg; ctx.fillRect(0,0,W,H);

  /* cladding rings */
  ctx.save(); ctx.strokeStyle=C.clad;
  for(let d=RING_GAP-(travel%RING_GAP); d<ZF; d+=RING_GAP){
    const k=F/d, rad=R_CLAD*k;
    if(rad>Math.max(W,H)*1.7) continue;
    const a=fog(d)*(C.dark?.28:.24);
    if(a<=.004) continue;
    ctx.globalAlpha=a; ctx.lineWidth=Math.max(.5,Math.min(2.2,.85*k));
    ringPath(sx(d,0),sy(d,0),rad); ctx.stroke();
  }
  ctx.restore();

  /* longitudinal cladding strands */
  for(let j=0;j<NL;j++){
    const th=j*6.2832/NL, cs=Math.cos(th)*R_CLAD, sn=Math.sin(th)*R_CLAD;
    bandCurve(d=>{ const k=F/d; _p.x=VPx+(offX(d)+cs)*k; _p.y=VPy+(offY(d)+sn)*k; },
              C.clad, C.dark?.15:.14, ()=>1);
  }

  /* six wavelengths spiralling in true perspective: soft halo, then core */
  for(let w=0;w<NW;w++){
    const col=C.spec[w], ph=w*6.2832/NW;
    const at=d=>{ const k=F/d, th=(d+travel)*HELIX_K+ph;
      _p.x=VPx+(offX(d)+Math.cos(th)*R_HELIX)*k;
      _p.y=VPy+(offY(d)+Math.sin(th)*R_HELIX)*k; };
    bandCurve(at,col,C.dark?.15:.11, k=>Math.max(2,Math.min(13,5*k*SC)));
    bandCurve(at,col,C.dark?.85:.80, k=>Math.max(.7,Math.min(3.4,1.15*k*SC)));
  }

  /* the core */
  const atCore=d=>{ const k=F/d; _p.x=VPx+offX(d)*k; _p.y=VPy+offY(d)*k; };
  bandCurve(atCore,C.spec[3],C.dark?.13:.10, k=>Math.max(3,Math.min(26,R_CORE*k)));
  ctx.save();
  if(C.dark){ ctx.shadowColor=C.core; ctx.shadowBlur=14; }
  bandCurve(atCore,C.core,C.dark?.70:.55, k=>Math.max(.8,Math.min(4,R_CORE*k*.16)));
  ctx.restore();

  /* --- network elements, far to near --- */
  const n0=Math.ceil((travel+ZN)/GATE_GAP), n1=Math.floor((travel+ZF)/GATE_GAP);
  let nearest=null, nearestD=1e9;
  for(let n=n1;n>=n0;n--){
    const d=n*GATE_GAP-travel;
    if(d<ZN||d>ZF) continue;
    const g=GATES[((n%NG)+NG)%NG];
    const a=fog(d);
    if(a<=.02) continue;
    /* lights up as the call passes through it */
    const hot=hero?Math.max(0,1-Math.abs(hero.d-d)/220):0;
    drawGate(g,d,a,hot);
    if(d<nearestD){ nearestD=d; nearest=g; }
  }
  /* label only the two most legible, or the frame turns into a diagram */
  const labelled=[];
  for(let n=n0;n<=n1&&labelled.length<2;n++){
    const d=n*GATE_GAP-travel;
    if(d<300||d>1700) continue;
    labelled.push({g:GATES[((n%NG)+NG)%NG],d});
  }
  labelled.forEach(o=>drawGateLabel(o.g,o.d,fog(o.d)*.95*Math.pow(1-flightStrength,3)));

  /* traffic riding the wavelengths, drawn as short capsules not dots */
  ctx.save(); ctx.lineCap='round';
  for(const m of motes){
    m.d-=velocity*1.7*m.sp*dt;
    if(m.d<ZN){ m.d=ZF; m.w=(m.w+1)%NW; }
    const a=fog(m.d); if(a<=.01) continue;
    const k=F/m.d;
    const t1=(m.d+travel)*HELIX_K+m.w*6.2832/NW;
    const d2=m.d+22+flightStrength*190, k2=F/d2, t2=(d2+travel)*HELIX_K+m.w*6.2832/NW;
    ctx.globalAlpha=a*.9; ctx.strokeStyle=C.spec[m.w];
    ctx.lineWidth=Math.max(1,Math.min(6,2.1*k*SC));
    if(C.dark){ ctx.shadowColor=C.spec[m.w]; ctx.shadowBlur=10; }
    ctx.beginPath();
    ctx.moveTo(VPx+(offX(m.d)+Math.cos(t1)*R_HELIX)*k, VPy+(offY(m.d)+Math.sin(t1)*R_HELIX)*k);
    ctx.lineTo(VPx+(offX(d2)+Math.cos(t2)*R_HELIX)*k2, VPy+(offY(d2)+Math.sin(t2)*R_HELIX)*k2);
    ctx.stroke();
  }
  ctx.restore();

  /* the call */
  if(hero){
    hero.d-=((ZF-ZN)/6.6)*dt;
    if(hero.d<=ZN){ hero=null; flash=1; held=1.6; cycT=0; }
    else{
      for(let i=13;i>=0;i--){
        const d=hero.d+i*26; if(d>ZF) continue;
        const k=F/d, a=(1-i/13)*fog(d); if(a<=.004) continue;
        ctx.save(); ctx.globalAlpha=a*.9; ctx.fillStyle=i?C.spec[3]:C.core;
        if(C.dark){ ctx.shadowColor=C.core; ctx.shadowBlur=i?12:34; }
        ctx.beginPath();
        ctx.arc(sx(d,0),sy(d,0),Math.max(1,Math.min(46,(3.4-i*.16)*k*SC)),0,6.2832);
        ctx.fill(); ctx.restore();
      }
    }
  }
  ctx.restore();

  if(flash>0){
    flash=Math.max(0,flash-dt*1.7);
    const al=flash*flash*(C.dark?.46:.2);
    const fg=ctx.createRadialGradient(VPx,VPy,0,VPx,VPy,Math.max(W,H)*.8);
    fg.addColorStop(0,(C.dark?'rgba(200,225,255,':'rgba(11,39,64,')+al+')');
    fg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.save(); ctx.fillStyle=fg; ctx.fillRect(0,0,W,H); ctx.restore();
  }

  if(C.bloom>0&&blurOK){
    gtx.clearRect(0,0,gcv.width,gcv.height);
    // Blur at one-third resolution rather than filtering the full viewport.
    gtx.filter='blur(2px)';gtx.drawImage(cvs,0,0,gcv.width,gcv.height);gtx.filter='none';
    ctx.save(); ctx.globalCompositeOperation='lighter';
    ctx.globalAlpha=C.bloom;
    ctx.drawImage(gcv,0,0,W,H); ctx.restore();
  }

  if(!flight&&C.grain>0&&grainPat){
    ctx.save();
    ctx.globalCompositeOperation=C.dark?'overlay':'multiply';
    ctx.globalAlpha=C.grain;
    ctx.translate((Math.random()*128)|0,(Math.random()*128)|0);
    ctx.fillStyle=grainPat; ctx.fillRect(-128,-128,W+256,H+256);
    ctx.restore();
  }

  // A single, gradual optical bloom bridges the aperture reveal; no strobing.
  if(flightStrength>0){
    ctx.save();
    const beam=ctx.createRadialGradient(VPx,VPy,0,VPx,VPy,Math.max(W,H)*.72);
    beam.addColorStop(0,C.dark?'rgba(183,215,255,.45)':'rgba(255,255,255,.64)');
    beam.addColorStop(.22,C.dark?'rgba(109,158,224,.14)':'rgba(178,205,244,.20)');
    beam.addColorStop(1,'rgba(103,147,219,0)');
    ctx.globalAlpha=flightStrength*flightStrength;ctx.fillStyle=beam;ctx.fillRect(0,0,W,H);ctx.restore();
  }
  /* HUD follows the element the camera is at */
  held=Math.max(0,held-dt);
  if(held>0) setState('Call connected',C.spec[3]);
  else if(nearest) setState(nearest.m+' \u2014 '+nearest.s, C.spec[2]);
  else setState('In transit',C.spec[2]);
  const tgt=hero?3.4+(1-(hero.d-ZN)/(ZF-ZN))*1.3:4.2+Math.sin(time*4.6)*.1;
  ms+=(tgt-ms)*.07;
  hMs.textContent=ms.toFixed(1)+' ms';

  if(!reduce&&running) frameId=requestAnimationFrame(frame);
}

function sync(){ if(disposed)return;const on=inView&&visible;
  if(flight){
    if(!on&&!flight.pausedAt)flight.pausedAt=performance.now();
    else if(on&&flight.pausedAt){flight.started+=performance.now()-flight.pausedAt;flight.pausedAt=0;}
  }
  document.body.classList.toggle('scene-paused',!on);
  if(reduce||on===running) return;
  running=on;
  if(frameId){ cancelAnimationFrame(frameId); frameId=0; }
  if(on){ prev=performance.now(); frameId=requestAnimationFrame(frame); } }
if('IntersectionObserver' in window){
  intersectionObserver=new IntersectionObserver(es=>es.forEach(e=>{inView=e.isIntersecting;sync();}),{threshold:0});intersectionObserver.observe(cvs);
}
document.addEventListener('visibilitychange',()=>{visible=!document.hidden;sync();});
let rt; addEventListener('resize',()=>{ clearTimeout(rt);
  rt=setTimeout(()=>{ resize(); if(reduce) frame(performance.now()); },140); });

resize(); syncCam(); launch();
document.body.classList.toggle('scene-paused',!visible);
if(reduce) frame(performance.now()); else if(running) frameId=requestAnimationFrame(frame);
document.body.dataset.phase='cover';notify('ready');
})();
