/* V19 — real Three.js communication models. Decorative concept, not an as-built topology.
 * One renderer at a time. Geometry/materials are shared and disposed on slide changes.
 * Lower-complexity SVG rendering supports browsers where WebGL is unavailable. */
(function(){
'use strict';
let activeTheme=null;
function setTheme(theme){activeTheme?.(theme);}
function mount(host,T){
 let renderer,environment,gpu=false,disposed=false,raf=0,last=0,elapsed=0,resizeObserver,intersectionObserver,visible=true;
 const resources=new Set(),geometries=new Map(),materials=[],flow=[],waves=[],rotors=[],floating=[],leds=[];
 const cover=host.dataset.modelKind==='cover'; // Presentation motion stays enabled.
 const scene=new T.Scene(),model=new T.Group();scene.add(model);
 const keep=x=>(resources.add(x),x),vec=(x,y,z)=>new T.Vector3(x,y,z);
 const group=(x=0,y=0,z=0,parent=model)=>{const g=new T.Group();g.position.set(x,y,z);parent.add(g);return g;};
 function geo(key,create){if(!geometries.has(key))geometries.set(key,keep(create()));return geometries.get(key);}
 function mesh(geometry,mat,x=0,y=0,z=0,parent=model){const o=new T.Mesh(geometry,mat);o.position.set(x,y,z);parent.add(o);return o;}
 function box(w,h,d,mat,x=0,y=0,z=0,parent=model){return mesh(geo(`b${w},${h},${d}`,()=>new T.BoxGeometry(w,h,d)),mat,x,y,z,parent);}
 function cyl(r1,r2,h,mat,x=0,y=0,z=0,parent=model,n=gpu?24:8){return mesh(geo(`c${r1},${r2},${h},${n}`,()=>new T.CylinderGeometry(r1,r2,h,n)),mat,x,y,z,parent);}
 function ball(r,mat,x=0,y=0,z=0,parent=model){return mesh(geo('s'+r,()=>new T.SphereGeometry(r,gpu?20:8,gpu?12:6)),mat,x,y,z,parent);}
 function torus(r,tube,mat,x=0,y=0,z=0,parent=model,arc=Math.PI*2){return mesh(geo(`t${r},${tube},${arc}`,()=>new T.TorusGeometry(r,tube,gpu?8:4,gpu?64:24,arc)),mat,x,y,z,parent);}
 function rod(a,b,r,mat,parent=model){const av=vec(...a),bv=vec(...b),d=bv.clone().sub(av),m=cyl(r,r,d.length(),mat,0,0,0,parent,gpu?10:5);m.position.copy(av.add(bv).multiplyScalar(.5));m.quaternion.setFromUnitVectors(vec(0,1,0),d.normalize());return m;}
 function curve(points,mat,r=.022,parent=model){const path=new T.CatmullRomCurve3(points.map(p=>vec(...p)));mesh(keep(new T.TubeGeometry(path,gpu?40:18,r,gpu?8:4,false)),mat,0,0,0,parent);return path;}
 function rounded(w,h,d,r,mat,x,y,z,parent=model){const g=group(x,y,z,parent);box(w-2*r,h,d,mat,0,0,0,g);box(w,h-2*r,d,mat,0,0,0,g);for(const sx of [-1,1])for(const sy of [-1,1]){const c=cyl(r,r,d,mat,sx*(w/2-r),sy*(h/2-r),0,g,gpu?16:8);c.rotation.x=Math.PI/2;}return g;}
 function mat(light,dark,options={}){const m=keep(new T.MeshPhysicalMaterial({color:dark,metalness:.45,roughness:.26,clearcoat:1,clearcoatRoughness:.13,...options}));materials.push({m,light,dark});return m;}
 function basic(color,options={}){return keep(new T.MeshBasicMaterial({color,...options}));}
 function clean(){if(disposed)return;disposed=true;cancelAnimationFrame(raf);renderer?.setAnimationLoop?.(null);resizeObserver?.disconnect();intersectionObserver?.disconnect();document.removeEventListener('visibilitychange',visibility);if(activeTheme===applyTheme)activeTheme=null;resources.forEach(x=>x.dispose?.());environment?.dispose();renderer?.dispose?.();renderer?.forceContextLoss?.();renderer?.domElement.remove();}
 let camera,key,rim,ambient,themeTargets=null;
 function render(){if(!disposed)renderer?.render(scene,camera);}
 function applyTheme(theme){const light=theme==='light';themeTargets=materials.map(({m,light:l,dark:d})=>({m,target:m.color.clone().setHex(light?l:d)}));if(!last||document.hidden){themeTargets.forEach(({m,target})=>m.color.copy(target));themeTargets=null;}if(renderer){renderer.toneMappingExposure=light?1.12:1.32;ambient.intensity=gpu?(light?2.4:1.6):.64;key.intensity=gpu?(light?3.5:4.3):.85;render();}}
 function visibility(){if(disposed)return;last=0;cancelAnimationFrame(raf);if(gpu)renderer.setAnimationLoop(null);if(document.hidden||!visible){render();return;}if(gpu)renderer.setAnimationLoop(frame);else raf=requestAnimationFrame(frame);}
 function frame(now){
  if(disposed)return;if(!host.isConnected){clean();return;}
  const fps=gpu?30:12,dt=last?(now-last)/1000:0;
  if(dt&&dt<1/fps){if(!gpu)raf=requestAnimationFrame(frame);return;}
  elapsed+=Math.min(dt,.1);last=now;
  if(themeTargets){let pending=false;const factor=1-Math.exp(-Math.min(dt,.1)*4);themeTargets.forEach(({m,target})=>{m.color.lerp(target,factor);if(Math.abs(m.color.r-target.r)+Math.abs(m.color.g-target.g)+Math.abs(m.color.b-target.b)>.001)pending=true;});if(!pending)themeTargets=null;}
  if(gpu)key.position.x=-2+Math.sin(elapsed*.35)*1.2;
  flow.forEach(({path,object,offset,speed})=>object.position.copy(path.getPointAt((elapsed*speed+offset)%1)));
  waves.forEach(({object,offset})=>{const p=(elapsed*.34+offset)%1;object.scale.setScalar(1+p*.68);object.material.opacity=(1-p)*.30;});
  rotors.forEach(({object,axis,speed})=>object.rotation[axis]=elapsed*speed);
  floating.forEach(({object,y,offset})=>object.position.y=y+Math.sin(elapsed*.9+offset)*.045);
  leds.forEach(({object,offset})=>{object.material.emissiveIntensity=.65+(Math.sin(elapsed*2+offset)+1)*.3;});
  model.rotation.y=cover?Math.sin(elapsed*.16)*.022:elapsed*Math.PI*2/52;
  const labels=host.parentElement.querySelectorAll('[data-concept-stage]');const step=Math.floor(elapsed/2.3)%5;labels.forEach((label,i)=>label.classList.toggle('is-flowing',i===step));
  render();if(!gpu)raf=requestAnimationFrame(frame);
 }
 try{
  const probe=document.createElement('canvas');let gl;try{gl=probe.getContext('webgl2',{alpha:true,antialias:true,powerPreference:'low-power'});}catch(_){}
  if(gl){try{renderer=new T.WebGLRenderer({canvas:probe,context:gl,alpha:true,antialias:true,powerPreference:'low-power'});gpu=true;}catch(_){gl.getExtension('WEBGL_lose_context')?.loseContext();}}
  if(!gpu){renderer=new T.SVGRenderer();renderer.setQuality('high');renderer.setPrecision(2);}
  renderer.outputColorSpace=T.SRGBColorSpace;
  if(gpu){renderer.setPixelRatio(Math.min(devicePixelRatio||1,cover?1.6:1.4));renderer.setClearColor(0x000000,0);renderer.toneMapping=T.ACESFilmicToneMapping;
   const studio=new T.Scene(),pmrem=new T.PMREMGenerator(renderer),studioResources=[];
   const wallG=new T.BoxGeometry(25,20,25),wallM=new T.MeshBasicMaterial({color:0x26364b,side:T.BackSide}),wall=new T.Mesh(wallG,wallM);studio.add(wall);studioResources.push(wallG,wallM);
   [[-5,4,3,0xdaf6ff,4,8],[5,2,1,0xffffff,3,7],[1,7,-4,0xffd4b0,6,4],[-4,0,-2,0xe33f67,1,5]].forEach(([x,y,z,c,w,h])=>{const g=new T.PlaneGeometry(w,h),m=new T.MeshBasicMaterial({color:c}),p=new T.Mesh(g,m);p.position.set(x,y,z);p.lookAt(0,0,0);studio.add(p);studioResources.push(g,m);});
   environment=pmrem.fromScene(studio,.03,.1,40);scene.environment=environment.texture;pmrem.dispose();studioResources.forEach(r=>r.dispose());studio.clear();
  }
  renderer.domElement.setAttribute('aria-hidden','true');renderer.domElement.tabIndex=-1;host.append(renderer.domElement);
  renderer.domElement.addEventListener('webglcontextlost',()=>{clean();host.dataset.model='fallback';},{once:true});
  const metal=mat(0x738c9e,0x9fbbd0,{metalness:.91,roughness:.19});
  const ceramic=mat(0xebf5fe,0xcbdfea,{metalness:.28,roughness:.2});
  const base=mat(0x506b84,0x0e2239,{metalness:.79,roughness:.24});
  const panel=mat(0x143d58,0x19394f,{metalness:.51,roughness:.2});
  const glass=mat(0x327da2,0x286188,{metalness:.45,roughness:.12,transparent:gpu,opacity:gpu?.83:1});
  const gold=mat(0xc59551,0xe1b978,{metalness:.9,roughness:.22});
  const red=mat(0xe4395f,0xff4d73,{emissive:0xa81738,emissiveIntensity:.55,metalness:.25,roughness:.21});
  const cyan=mat(0x217faa,0x75ddff,{emissive:0x075a94,emissiveIntensity:.75,metalness:.3});
  const mint=mat(0x268b76,0x7ce7c4,{emissive:0x126955,emissiveIntensity:.6});
  const ink=basic(0x09182b),white=basic(0xd7f8ff),pinkLight=basic(0xff91b0),blueLight=basic(0x92eaff);
  // Small raised metal feet, clearcoat platforms and perimeter trim anchor each device.
  function plinth(g,size=1.65){const p=cyl(size*.50,size*.57,.16,base,0,.03,0,g,6);p.rotation.y=Math.PI/6;const trim=torus(size*.49,.018,gold,0,.12,0,g);trim.rotation.x=Math.PI/2;for(const x of [-.43,.43])for(const z of [-.38,.38])cyl(.055,.055,.09,metal,x,-.08,z,g,8);}
  function phone(g){
   plinth(g,1.7);const device=group(0,1.10,0,g);device.rotation.y=-.16;device.rotation.x=-.04;
   rounded(.91,1.86,.17,.12,metal,0,0,0,device);rounded(.82,1.76,.038,.10,ink,0,.0,.097,device);rounded(.73,1.57,.018,.07,glass,0,.02,.125,device);
   rounded(.24,.035,.018,.013,metal,0,.80,.125,device);ball(.022,ink,.23,.80,.14,device);box(.10,.30,.038,metal,.463,.32,0,device);box(.018,.25,.02,metal,-.469,.32,0,device);
   for(let i=0;i<4;i++)box(.033,.055+i*.021,.012,white,-.26+i*.055,.66,.145,device);rounded(.13,.06,.008,.012,white,.24,.68,.145,device);
   const net=torus(.19,.016,cyan,0,.16,.154,device,Math.PI);net.rotation.z=0;const net2=torus(.28,.014,cyan,0,.16,.154,device,Math.PI);ball(.035,pinkLight,0,.16,.16,device);
   for(let i=0;i<3;i++)rounded(.50-i*.045,.045,.009,.015,i===0?ceramic:cyan,0,-.27-i*.14,.15,device);rounded(.25,.026,.008,.01,white,0,-.70,.15,device);
   for(let i=0;i<5;i++)ball(.012,ink,-.22+i*.045,-.938,0,device);
   floating.push({object:device,y:device.position.y,offset:0});
  }
  function radio(g,scale=1){
   const structure=group(0,.13,0,g);structure.scale.setScalar(scale);plinth(g,1.7);
   const h=2.5,r=.28,legs=[];
   for(let i=0;i<3;i++){const a=i*Math.PI*2/3;legs.push([Math.sin(a)*r,Math.cos(a)*r]);rod([Math.sin(a)*r,0,Math.cos(a)*r],[Math.sin(a)*.10,h,Math.cos(a)*.10],.025,metal,structure);}
   for(let level=0;level<5;level++)for(let i=0;i<3;i++){const j=(i+1)%3,[x,z]=legs[i],[x2,z2]=legs[j],f0=1-level*.11,f1=1-(level+1)*.11,y0=level*.45,y1=(level+1)*.45;rod([x*f0,y0,z*f0],[x2*f1,y1,z2*f1],.012,metal,structure);if(gpu)rod([x2*f0,y0,z2*f0],[x*f1,y1,z*f1],.008,metal,structure);}
   for(let i=0;i<3;i++){const a=i*Math.PI*2/3,sector=group(0,1.94,0,structure);sector.rotation.y=a;box(.065,.07,.43,gold,0,.16,.20,sector);rounded(.27,.88,.15,.055,ceramic,0,.18,.42,sector);box(.18,.045,.02,red,0,.46,.507,sector);box(.16,.018,.02,metal,0,-.15,.507,sector);box(.18,.34,.12,metal,0,-.45,.22,sector);curve([[0,-.46,.26],[.13,-.62,.28],[.13,-1.4,.14],[.04,-1.77,0]],panel,.013,sector);}
   cyl(.017,.017,.62,metal,0,2.57,0,structure,8);ball(.042,red,0,2.90,0,structure);
   for(let i=0;i<3;i++){const m=basic(0x8adaff,{transparent:true,opacity:.2,depthWrite:false});const wave=torus(.50,.010,m,0,2.53,0,structure);wave.rotation.x=Math.PI/2;waves.push({object:wave,offset:i/3});}
   box(.33,.30,.31,base,.47,.13,.30,structure);box(.28,.24,.016,ceramic,.47,.14,.47,structure);
  }
  function rack(g,optical=false){
   plinth(g,1.75);const rack=group(0,.15,0,g);box(1.01,1.79,.71,base,0,.895,0,rack);box(.90,1.65,.025,ink,0,.895,.368,rack);
   for(const side of [-1,1]){box(.045,1.75,.055,metal,side*.47,.895,.404,rack);for(let i=0;i<(gpu?10:5);i++)ball(.012,ink,side*.47,.19+i*(gpu?.145:.29),.435,rack);}
   box(.78,.06,.015,glass,0,1.68,.417,rack);const rows=gpu?6:4;for(let row=0;row<rows;row++){const y=1.49-row*(1.23/(rows-1));box(.78,.17,.065,ceramic,0,y,.417,rack);box(.05,.10,.028,metal,-.34,y,.46,rack);box(.05,.10,.028,metal,.34,y,.46,rack);const ports=gpu?7:4;for(let port=0;port<ports;port++){const x=-.24+port*.48/(ports-1);box(.043,.041,.013,panel,x,y,.457,rack);ball(.011,(row+port)%4===0?mint:cyan,x,y-.045,.472,rack);}box(.31,.018,.01,metal,0,y+.06,.456,rack);}
   for(let i=0;i<(gpu?9:4);i++)box(.60,.015,.012,metal,0,.12-i*.023,.373,rack);
   if(optical){
    const colors=[red,cyan,gold,mint];colors.forEach((m,i)=>{curve([[-.24+i*.16,.35,.50],[-.33+i*.20,.15,.69],[-.40+i*.23,-.02,.74],[.61+i*.04,-.03,.40]],m,.012,rack);});
    const coil=group(.73,.37,.1,rack);for(let i=0;i<3;i++){const loop=torus(.27,.023,i===0?gold:cyan,0,0,i*.05,coil);loop.rotation.y=.3;}rod([.72,.05,.06],[.72,.62,.06],.028,metal,rack);
   }else{box(.19,.08,.022,red,.16,1.70,.42,rack);}
  }
  function protection(g){
   plinth(g,1.72);box(1.12,.12,.98,panel,0,.24,0,g);for(let i=0;i<6;i++)for(const side of [-1,1])box(.12,.035,.025,gold,side*.62,.245,-.38+i*.15,g);
   const device=group(0,1.02,0,g);const shield=cyl(.77,.77,.12,metal,0,0,-.07,device,5);shield.rotation.x=Math.PI/2;shield.rotation.z=Math.PI;shield.scale.y=1.18;
   const face=cyl(.69,.69,.04,panel,0,0,.02,device,5);face.rotation.x=Math.PI/2;face.rotation.z=Math.PI;face.scale.y=1.18;
   rounded(.72,.62,.19,.10,red,0,-.03,.19,device);
   const shackle=[];for(let i=0;i<=10;i++){const a=Math.PI-i*Math.PI/10;shackle.push([Math.cos(a)*.23,.29+Math.sin(a)*.29,.20]);}curve(shackle,metal,.047,device);ball(.058,ink,0,.02,.303,device);box(.045,.12,.015,ink,0,-.06,.31,device);
   const seal=torus(.91,.012,gold,0,0,-.11,device);rotors.push({object:seal,axis:'z',speed:.14});
   floating.push({object:device,y:device.position.y,offset:1.4});
  }
  function cloud(g){
   plinth(g,1.78);const left=group(-.27,0,.03,g),right=group(.34,0,-.11,g);left.scale.set(.48,.65,.55);right.scale.set(.48,.65,.55);rack(left);rack(right);
   const cloud=group(0,1.85,0,g);[[0,.1,0,.37],[-.36,-.07,0,.27],[.36,-.08,0,.27],[-.12,.25,-.04,.28],[.13,-.14,.08,.28]].forEach(([x,y,z,r])=>ball(r,ceramic,x,y,z,cloud));box(.76,.26,.28,ceramic,0,-.12,0,cloud);
   const orbit=torus(.77,.013,cyan,0,-.2,0,cloud);orbit.rotation.x=1.23;rotors.push({object:orbit,axis:'z',speed:.13});floating.push({object:cloud,y:cloud.position.y,offset:2.4});
  }
  function packets(path,count=4){for(let i=0;i<count;i++){const object=ball(.038,i%2?pinkLight:blueLight);flow.push({path,object,offset:i/count,speed:.12});}}
  if(cover){
   // The left-to-right chain is a conceptual service path, with fibre cores visible in the foreground.
   if(gpu){box(12.2,.11,2.42,base,0,-.18,0);box(12.1,.025,2.36,metal,0,-.115,0);}else{for(const x of [-4.8,-2.4,0,2.4,4.8])box(1.65,.11,1.52,base,x,-.18,0);}
   const xs=[-4.8,-2.4,0,2.4,4.8],builds=[phone,radio,rack,protection,cloud];
   xs.forEach((x,i)=>{const node=group(x,0,i===0?.04:0);if(i===2)rack(node,true);else builds[i](node);});
   for(let i=0;i<4;i++){
    const x0=xs[i]+.50,x1=xs[i+1]-.45;
    const path=curve([[x0,.15,.75],[x0+.25,.26,1.0],[x1-.25,.26,1.0],[x1,.15,.72]],i>1?cyan:gold,.022);packets(path,gpu?5:3);
    if(i===1)for(let core=0;core<3;core++)curve([[x0,.08,.77+core*.07],[x0+.24,.1,1.15+core*.07],[x1-.25,.1,1.15+core*.07],[x1,.08,.77+core*.07]],[red,cyan,mint][core],.012);
   }
   // Optical patch cable cross-section: sheath, four small illuminated cores and a chrome connector.
   const fibre=group(.0,-.04,1.22);const sheath=cyl(.075,.075,1.58,panel,0,0,0,fibre);sheath.rotation.z=Math.PI/2;
   for(let i=0;i<4;i++){const a=i*Math.PI/2;const strand=cyl(.013,.013,.36,[red,cyan,gold,mint][i],.95,Math.cos(a)*.043,Math.sin(a)*.043,fibre,6);strand.rotation.z=Math.PI/2;}
   const connector=cyl(.096,.096,.22,metal,.75,0,0,fibre,16);connector.rotation.z=Math.PI/2;
  }else{
   cyl(1.83,2.01,.18,base,0,-.15,0,model,48);cyl(1.78,1.78,.04,metal,0,-.04,0,model,48);
   const ring=torus(1.79,.02,gold,0,0,0);ring.rotation.x=Math.PI/2;
   radio(group(0,0,-.3),.83);
   const left=group(-1.05,0,.37);left.scale.setScalar(.57);left.rotation.y=.3;rack(left,true);
   const right=group(1.02,0,.28);right.scale.setScalar(.55);right.rotation.y=-.32;rack(right);
   const safe=group(.05,0,1.03);safe.scale.setScalar(.44);protection(safe);
   const small=group(-.83,0,-.86);small.scale.setScalar(.38);phone(small);
   for(let i=0;i<4;i++){const a=i*Math.PI/2,points=[];for(let j=0;j<=12;j++){const p=a+j*Math.PI/2/12;points.push([Math.sin(p)*1.53,.095,Math.cos(p)*1.53]);}packets(curve(points,i%2?cyan:red,.014),gpu?3:2);}
  }
  ambient=new T.AmbientLight(0xd9edff,1.6);scene.add(ambient);key=new T.DirectionalLight(0xffffff,4.3);key.position.set(-2,6,7);scene.add(key);rim=new T.DirectionalLight(0x84cfff,gpu?2.6:.40);rim.position.set(4,3,-4);scene.add(rim);
  const warm=new T.DirectionalLight(0xff8b9f,gpu?1.0:.1);warm.position.set(-6,1,-3);scene.add(warm);
  camera=new T.OrthographicCamera(-7,7,4,-4,.1,60);camera.position.set(cover?2.0:3.6,cover?5.0:3.1,cover?13:5.2);camera.lookAt(0,cover?.92:1.04,0);
  function size(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;const aspect=w/h,half=cover?Math.max(2.0,6.40/aspect):Math.max(1.92,2.45/aspect);camera.left=-half*aspect;camera.right=half*aspect;camera.top=half;camera.bottom=-half;camera.updateProjectionMatrix();renderer.setSize(w,h,false);render();}
  activeTheme=applyTheme;applyTheme(document.body.classList.contains('light')?'light':'dark');
  resizeObserver=new ResizeObserver(size);resizeObserver.observe(host);size();
  intersectionObserver=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting!==false;visibility();},{threshold:.01});intersectionObserver.observe(host);
  document.addEventListener('visibilitychange',visibility);host.dataset.model='ready';host.dataset.renderer=gpu?'webgl':'svg';visibility();
 }catch(error){console.warn('[Pulse communication model]',error);clean();host.dataset.model='fallback';}
 return clean;
}
window.PulseConcept={mount,setTheme};
})();
