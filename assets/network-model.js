/* Pulse 5G / Three.js 0.185.1. Decorative radio site, protective network shield and DWDM procurement models.
 * Classic local scripts preserve file:// use. No runtime network requests.
 * Each mount owns and disposes its renderer, materials, geometry and listeners. */
(function(){
'use strict';
let release=null,loadPromise=null,generation=0;
const scriptBase=new URL('.',document.currentScript.src);
function load(){
 if(window.PulseThree)return Promise.resolve(window.PulseThree);
 if(!loadPromise)loadPromise=new Promise((resolve,reject)=>{
  const script=document.createElement('script');script.src=new URL('vendor/three.pulse.min.js',scriptBase).href;
  script.onload=()=>resolve(window.PulseThree);script.onerror=()=>{loadPromise=null;script.remove();reject(new Error('3D asset unavailable'));};document.head.appendChild(script);
 });
 return loadPromise;
}
function destroy(){generation++;release?.();release=null;}
async function mount(host){
 destroy();if(!host)return;const ticket=generation;
 let T;try{T=await load();}catch(_){host.dataset.model='fallback';return;}
 if(ticket!==generation||!host.isConnected)return;
 if(window.PulseConcept&&['cover','overview'].includes(host.dataset.modelKind)){release=PulseConcept.mount(host,T);return;}
 let renderer,environment,observer,disposed=false,isGPU=false,raf=0;
 const resources=new Set(); // Motion is always enabled for the presentation.
 const keep=x=>(resources.add(x),x);
 const scene=new T.Scene(),model=new T.Group();scene.add(model);
 function material(type,options){return keep(new T[type](options));}
 function mesh(geometry,mat,x=0,y=0,z=0,parent=model){const obj=new T.Mesh(keep(geometry),mat);obj.position.set(x,y,z);parent.add(obj);return obj;}
 function setLoop(callback){if(isGPU){renderer?.setAnimationLoop(callback);return;}cancelAnimationFrame(raf);if(callback){const tick=t=>{if(disposed)return;callback(t);if(!disposed)raf=requestAnimationFrame(tick);};raf=requestAnimationFrame(tick);}}
 const clean=()=>{
  if(disposed)return;disposed=true;observer?.disconnect();document.removeEventListener('visibilitychange',visibility);
  setLoop(null);resources.forEach(x=>x.dispose());environment?.dispose();renderer?.dispose?.();renderer?.forceContextLoss?.();renderer?.domElement.remove();
 };
 release=clean;
 try{
  const probe=document.createElement('canvas');let gl=null;try{gl=probe.getContext('webgl2',{alpha:true,antialias:true,powerPreference:'low-power'});}catch(_){}
  if(gl){try{renderer=new T.WebGLRenderer({canvas:probe,context:gl,alpha:true,antialias:true,powerPreference:'low-power'});isGPU=true;}catch(_){gl.getExtension('WEBGL_lose_context')?.loseContext();}}
  if(!isGPU){renderer=new T.SVGRenderer();renderer.setQuality('high');renderer.setPrecision(2);}
  if(isGPU){renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.setClearColor(0x000000,0);renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;}
  renderer.outputColorSpace=T.SRGBColorSpace;
  const canvas=renderer.domElement;canvas.setAttribute('aria-hidden','true');canvas.tabIndex=-1;host.append(canvas);
  canvas.addEventListener('webglcontextlost',()=>{clean();host.dataset.model='fallback';},{once:true});
  // A tiny studio environment gives the metal and clearcoat real moving reflections.
  if(isGPU){
  const studio=new T.Scene();
  const walls=mesh(new T.BoxGeometry(12,12,12),material('MeshBasicMaterial',{color:0x14263d,side:T.BackSide}),0,0,0,studio);
  const panels=[[-4,3,2,0xffffff],[4,1,1,0x85d9ff],[1,4,-3,0xffc56d]];
  panels.forEach(([x,y,z,color])=>{const panel=mesh(new T.PlaneGeometry(3,6),material('MeshBasicMaterial',{color}),x,y,z,studio);panel.lookAt(0,0,0);});
  const pmrem=new T.PMREMGenerator(renderer);environment=pmrem.fromScene(studio,.03,.1,30);scene.environment=environment.texture;pmrem.dispose();
  studio.traverse(obj=>{if(obj.isMesh){resources.delete(obj.geometry);obj.geometry.dispose();resources.delete(obj.material);obj.material.dispose();}});studio.clear();
  }
  const metal=material('MeshPhysicalMaterial',{color:0x9eacbb,metalness:.88,roughness:.22,clearcoat:1,clearcoatRoughness:.12});
  const dark=material('MeshStandardMaterial',{color:0x142336,metalness:.78,roughness:.27});
  const ceramic=material('MeshPhysicalMaterial',{color:0xdbefff,metalness:.3,roughness:.17,clearcoat:1});
  const gold=material('MeshStandardMaterial',{color:0xe4b575,metalness:.8,roughness:.2});
  const cyan=material('MeshStandardMaterial',{color:0x86ddff,emissive:0x2583b7,emissiveIntensity:1.2,metalness:.3,roughness:.22});
  const red=material('MeshStandardMaterial',{color:0xff4767,emissive:0xee244d,emissiveIntensity:1.4,roughness:.2});
  const kind=host.dataset.modelKind||'action';
  if(kind==='team'){
   mesh(new T.CylinderGeometry(.85,.95,.13,6),dark,0,-.67);
   mesh(new T.CylinderGeometry(.06,.06,.46,12),gold,0,.32);
   mesh(new T.SphereGeometry(.24,20,12),ceramic,0,.72);
   for(let i=0;i<3;i++){const x=(i-1)*.58;mesh(new T.CylinderGeometry(.13,.20,.32,16),metal,x,-.32,.10);mesh(new T.SphereGeometry(.15,16,10),i===1?gold:cyan,x,-.06,.10);const arm=mesh(new T.BoxGeometry(.025,.48,.025),gold,x/2,.13,0);arm.rotation.z=x?Math.sign(x)*-.85:0;}
   const ring=mesh(new T.TorusGeometry(.7,.015,8,40),gold,0,-.56);ring.rotation.x=Math.PI/2;
  }else if(kind==='raci'){
   mesh(new T.CylinderGeometry(.9,1,.13,6),dark,0,-.65);
   for(let row=0;row<3;row++)for(let col=0;col<3;col++){const mat=[ceramic,cyan,gold][(row+col)%3];mesh(new T.BoxGeometry(.34,.34,.14),mat,(col-1)*.41,.64-row*.41,0);}
   mesh(new T.BoxGeometry(1.3,1.3,.10),metal,0,.22,-.13);
  }else if(kind==='decision'){
   mesh(new T.CylinderGeometry(.76,.88,.13,6),dark,0,-.67);
   mesh(new T.BoxGeometry(1.02,1.27,.13),metal,0,.07);
   mesh(new T.BoxGeometry(.88,1.11,.05),ceramic,0,.06,.09);
   mesh(new T.BoxGeometry(.40,.14,.13),gold,0,.70,.10);
   const short=mesh(new T.BoxGeometry(.08,.29,.06),cyan,-.14,.21,.16);short.rotation.z=.65;
   const long=mesh(new T.BoxGeometry(.08,.48,.06),cyan,.08,.29,.16);long.rotation.z=-.68;
   [0,-.16,-.32].forEach((y,i)=>mesh(new T.BoxGeometry(i===2?.39:.61,.04,.025),metal,0,y-.06,.14));
   const ring=mesh(new T.TorusGeometry(.64,.017,8,48),gold,0,-.56);ring.rotation.x=Math.PI/2;
  }else if(kind==='risk'){
   // A dimensional metal shield, inset face and raised check protect three network nodes.
   mesh(new T.CylinderGeometry(.76,.87,.12,32),dark,0,-.63);
   const plate=mesh(new T.CylinderGeometry(.72,.72,.14,5),metal,0,.30);
   plate.rotation.x=Math.PI/2;plate.rotation.z=Math.PI;plate.scale.y=1.12;
   const face=mesh(new T.CylinderGeometry(.65,.65,.035,5),dark,0,.30,.09);
   face.rotation.x=Math.PI/2;face.rotation.z=Math.PI;face.scale.y=1.12;
   const mark=new T.Group();mark.position.set(0,.31,.18);model.add(mark);
   const short=mesh(new T.BoxGeometry(.10,.28,.065),cyan,-.13,-.05,0,mark);short.rotation.z=.72;
   const long=mesh(new T.BoxGeometry(.10,.49,.065),cyan,.10,.03,0,mark);long.rotation.z=-.65;
   for(let i=0;i<3;i++){const x=(i-1)*.48;mesh(new T.BoxGeometry(.23,.15,.22),ceramic,x,-.48,.22);mesh(new T.SphereGeometry(.035,10,6),cyan,x,-.40,.35);}
   const ring=mesh(new T.TorusGeometry(.70,.018,8,48),gold,0,-.52);ring.rotation.x=Math.PI/2;
   }else if(kind==='milestone'){
   // Three dimensional delivery checkpoints and a final destination flag.
   mesh(new T.CylinderGeometry(.88,.97,.13,6),dark,0,-.64);
   for(let i=0;i<3;i++){
    const x=(i-1)*.48,y=-.42+i*.18;
    mesh(new T.BoxGeometry(.38,.18+i*.18,.42),metal,x,-.47+i*.09);
    mesh(new T.CylinderGeometry(.10,.10,.05,20),gold,x,y+.08);
    mesh(new T.SphereGeometry(.055,12,8),cyan,x,y+.13);
    if(i<2)mesh(new T.BoxGeometry(.18,.025,.05),cyan,x+.24,y+.02);
   }
   mesh(new T.CylinderGeometry(.022,.022,.93,10),gold,.48,.54);
   mesh(new T.BoxGeometry(.40,.25,.045),red,.66,.85);
   mesh(new T.BoxGeometry(.30,.025,.01),ceramic,.66,.86,.03);
  }else if(kind==='rfp'){
   // Procurement of optical network equipment: a populated DWDM rack and document folio.
   mesh(new T.CylinderGeometry(.88,.97,.13,6),dark,0,-.64);
   mesh(new T.BoxGeometry(.78,1.20,.55),metal,-.15,.04);
   mesh(new T.BoxGeometry(.67,1.08,.025),dark,-.15,.04,.29);
   for(let row=0;row<5;row++){
    const y=.46-row*.21;mesh(new T.BoxGeometry(.60,.15,.06),ceramic,-.15,y,.33);
    for(let port=0;port<4;port++)mesh(new T.BoxGeometry(.065,.035,.024),port===0?red:cyan,-.36+port*.14,y,.38);
   }
   const folio=new T.Group();folio.position.set(.54,-.04,.40);folio.rotation.y=-.22;folio.rotation.z=-.12;model.add(folio);
   mesh(new T.BoxGeometry(.44,.67,.05),gold,0,0,0,folio);
   mesh(new T.BoxGeometry(.38,.59,.04),ceramic,0,0,.04,folio);
   for(let line=0;line<4;line++)mesh(new T.BoxGeometry(line===3?.15:.27,.019,.018),line===0?red:metal,-.015,.17-line*.10,.069,folio);
  }else{
  mesh(new T.CylinderGeometry(.76,.9,.16,6),dark,0,-.63);
  mesh(new T.CylinderGeometry(.75,.75,.035,6),metal,0,-.53);
  mesh(new T.CylinderGeometry(.10,.18,1.22,12),metal,0,.1);
  mesh(new T.CylinderGeometry(.18,.18,.09,24),gold,0,.53);
  mesh(new T.CylinderGeometry(.02,.02,.48,8),metal,0,1.03);
  mesh(new T.SphereGeometry(.043,12,8),red,0,1.29);
  for(let i=0;i<3;i++){
   const a=i*Math.PI*2/3,sector=new T.Group();sector.rotation.y=a;model.add(sector);
   mesh(new T.BoxGeometry(.08,.07,.40),gold,0,.52,.16,sector);
   mesh(new T.BoxGeometry(.25,.68,.12),ceramic,0,.60,.37,sector);
   mesh(new T.BoxGeometry(.16,.045,.015),red,0,.84,.438,sector);
   mesh(new T.BoxGeometry(.16,.025,.015),metal,0,.36,.438,sector);
   const x=Math.sin(a)*.60,z=Math.cos(a)*.60;
   mesh(new T.CylinderGeometry(.10,.10,.07,16),gold,x,-.50,z);
   mesh(new T.SphereGeometry(.065,12,8),cyan,x,-.43,z);
   const cable=new T.CatmullRomCurve3([new T.Vector3(x,-.45,z),new T.Vector3(x*1.15,-.05,z*1.15),new T.Vector3(x*.4,.1,z*.4),new T.Vector3(0,.1,0)]);
   mesh(new T.TubeGeometry(cable,20,.014,6,false),cyan);
  }
  const ring=mesh(new T.TorusGeometry(.68,.018,8,64),gold,0,-.47);ring.rotation.x=Math.PI/2;
  }
  scene.add(new T.AmbientLight(0xd1e7ff,isGPU?2:.55));
  const key=new T.DirectionalLight(0xffffff,isGPU?3.4:.9);key.position.set(2,4,5);scene.add(key);
  const rim=new T.DirectionalLight(0x71ccff,isGPU?2:.5);rim.position.set(-4,2,-3);scene.add(rim);
  const camera=new T.OrthographicCamera(-1.6,1.6,1.5,-1.5,.1,30);camera.position.set(3,2.1,4);camera.lookAt(0,.23,0);
  model.rotation.y=.3;
  let previous=0,lastDraw=0;
  function frame(time){
   if(disposed)return;if(!host.isConnected){clean();return;}
   if(time-lastDraw<1000/(isGPU?30:20))return;
   const delta=previous?Math.min((time-previous)/1000,.1):0;previous=time;lastDraw=time;
   model.rotation.y+=delta*Math.PI*2/42;
   renderer.render(scene,camera);
  }
  function size(){
   const width=host.clientWidth,height=host.clientHeight;if(!width||!height)return;
   const aspect=width/height,half=1.30;camera.left=-half*aspect;camera.right=half*aspect;camera.top=half;camera.bottom=-half;camera.updateProjectionMatrix();
   renderer.setSize(width,height,false);renderer.render(scene,camera);
  }
  visibility=()=>{
   if(disposed)return;previous=0;lastDraw=0;
   setLoop(document.hidden?null:frame);
   if(!document.hidden)renderer.render(scene,camera);
  };
  observer=new ResizeObserver(size);observer.observe(host);size();visibility();
  document.addEventListener('visibilitychange',visibility);
  host.dataset.model='ready';host.dataset.renderer=isGPU?'webgl':'svg';
 }catch(error){console.warn('[Pulse 3D] Decorative model fallback:',error);clean();host.dataset.model='fallback';}
 function visibility(){}
}
window.PulseNetwork={mount,destroy,setTheme:theme=>window.PulseConcept?.setTheme(theme)};
})();
