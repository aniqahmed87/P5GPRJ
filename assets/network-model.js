/* Pulse 5G / Three.js 0.185.1. Decorative radio site with optical backhaul.
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
 let renderer,environment,observer,disposed=false,isGPU=false,raf=0;
 const resources=new Set(),motion=matchMedia('(prefers-reduced-motion:reduce)');
 const keep=x=>(resources.add(x),x);
 const scene=new T.Scene(),model=new T.Group();scene.add(model);
 function material(type,options){return keep(new T[type](options));}
 function mesh(geometry,mat,x=0,y=0,z=0,parent=model){const obj=new T.Mesh(keep(geometry),mat);obj.position.set(x,y,z);parent.add(obj);return obj;}
 function setLoop(callback){if(isGPU){renderer?.setAnimationLoop(callback);return;}cancelAnimationFrame(raf);if(callback){const tick=t=>{if(disposed)return;callback(t);if(!disposed)raf=requestAnimationFrame(tick);};raf=requestAnimationFrame(tick);}}
 const clean=()=>{
  if(disposed)return;disposed=true;observer?.disconnect();document.removeEventListener('visibilitychange',visibility);motion.removeEventListener('change',visibility);
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
   if(!motion.matches)model.rotation.y+=delta*Math.PI*2/42;
   renderer.render(scene,camera);
  }
  function size(){
   const width=host.clientWidth,height=host.clientHeight;if(!width||!height)return;
   const aspect=width/height,half=1.30;camera.left=-half*aspect;camera.right=half*aspect;camera.top=half;camera.bottom=-half;camera.updateProjectionMatrix();
   renderer.setSize(width,height,false);renderer.render(scene,camera);
  }
  visibility=()=>{
   if(disposed)return;previous=0;lastDraw=0;
   setLoop(document.hidden||motion.matches?null:frame);
   if(!document.hidden)renderer.render(scene,camera);
  };
  observer=new ResizeObserver(size);observer.observe(host);size();visibility();
  document.addEventListener('visibilitychange',visibility);motion.addEventListener('change',visibility);
  host.dataset.model='ready';host.dataset.renderer=isGPU?'webgl':'svg';
 }catch(error){console.warn('[Pulse 3D] Decorative model fallback:',error);clean();host.dataset.model='fallback';}
 function visibility(){}
}
window.PulseNetwork={mount,destroy};
})();
