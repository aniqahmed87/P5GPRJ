(function(){
'use strict';
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(pointer:fine)');
let actionRefreshContext=null;
let context=null,activePopup=null,selectCount=0,lastNav='';
if(window.gsap&&window.Flip)gsap.registerPlugin(Flip);
function cleanup(){actionRefreshContext?.revert();actionRefreshContext=null;context?.revert();context=null;closeSelect();}
function enter(root,dir=1){
 enhance(root);
 if(!window.gsap||reduced.matches)return;
 context=gsap.context(()=>{
  const heading=root.querySelector('.page-heading,.dashboard-heading,.agenda-hero');
  if(heading)gsap.from(heading,{opacity:0,y:8,x:dir*12,duration:.58,ease:'power2.out',clearProps:'opacity,transform'});
  const cards=root.querySelectorAll('.agenda-card,.kpi,.analytics-panel,.record,.milestone-category,.team-board,.team-column,.assets-layout>div,.raci-legend');
  if(cards.length)gsap.from(cards,{opacity:0,y:16,x:dir*12,rotationX:3,transformPerspective:1200,stagger:{amount:.25},duration:.72,ease:'power3.out',clearProps:'opacity,transform'});
  const bars=root.querySelectorAll('.segment-bar,.category-bars .metric-track i,.delivery-full-bar i');if(bars.length)gsap.from(bars,{scaleX:0,transformOrigin:'left center',duration:.85,stagger:.035,ease:'power3.out',clearProps:'transform'});
  root.querySelectorAll('.ring-value').forEach(ring=>{const target=ring.getAttribute('stroke-dasharray');gsap.fromTo(ring,{attr:{'stroke-dasharray':'0 100'}},{attr:{'stroke-dasharray':target},duration:root.dataset.page==='agenda'?.65:1.05,ease:'power3.out'});});
  root.querySelectorAll('.kpi strong').forEach(el=>{if(/^\d+$/.test(el.textContent))gsap.from(el,{innerText:0,snap:{innerText:1},duration:.9,ease:'power2.out'});});
  
  root.querySelectorAll('[data-count]').forEach(el=>{const target=Number(el.dataset.count);if(!Number.isFinite(target))return;const counter={value:0};el.textContent='0';gsap.to(counter,{value:target,duration:1.05,delay:.12,ease:'power2.out',onUpdate:()=>{el.textContent=String(Math.round(counter.value));},onComplete:()=>{el.textContent=String(target);}});});
  const entries=root.querySelectorAll('.feed-entry');if(entries.length)gsap.from([...entries].slice(0,8),{opacity:0,x:18,duration:.55,stagger:.07,delay:.18,clearProps:'opacity,transform'});
  const images=root.querySelectorAll('.shortcut-art');if(images.length)gsap.from(images,{opacity:0,x:20,scale:1.12,duration:1.1,stagger:.07,clearProps:'opacity,transform'});
  if(root.dataset.page==='actions'){const art=root.querySelector('.action-hero-art img');if(art)gsap.from(art,{scale:1.07,x:-12,duration:1.2,ease:'power2.out',clearProps:'transform'});const rows=[...root.querySelectorAll('.action-row')].slice(0,14);if(rows.length)gsap.from(rows,{opacity:0,y:10,duration:.42,stagger:.055,delay:.12,ease:'power3.out',clearProps:'opacity,transform'});}
  const table=root.querySelector('.table-wrap');if(table)gsap.from(table,{opacity:0,x:dir*15,duration:.5,ease:'power3.out',clearProps:'opacity,transform'});
 },root);
}
function actionsRefresh(root){
 actionRefreshContext?.revert();actionRefreshContext=null;
 if(!window.gsap||reduced.matches)return;
 actionRefreshContext=gsap.context(()=>{
  const rows=[...root.querySelectorAll('.action-row,.action-card,.empty-table')].slice(0,14);
  if(rows.length)gsap.fromTo(rows,{opacity:.4,y:5},{opacity:1,y:0,duration:.22,stagger:.014,ease:'power2.out',clearProps:'opacity,transform'});
  const rings=root.querySelectorAll('.ring-value');rings.forEach(ring=>{const target=ring.getAttribute('stroke-dasharray');gsap.fromTo(ring,{attr:{'stroke-dasharray':'0 100'}},{attr:{'stroke-dasharray':target},duration:.35,ease:'power2.out'});});
 },root);
}
function modal(el){enhance(el);if(window.gsap&&!reduced.matches)gsap.fromTo(el,{opacity:.4,y:16,scale:.985},{opacity:1,y:0,scale:1,duration:.36,ease:'power3.out',clearProps:'opacity,transform'});}
function closeSelect(){if(!activePopup)return;const {popup,trigger}=activePopup;trigger.setAttribute('aria-expanded','false');try{if(popup.matches(':popover-open'))popup.hidePopover();}catch(_){}popup.remove();activePopup=null;}
function enhance(root){root.querySelectorAll('select:not([data-glass-select])').forEach(select=>{
 select.dataset.glassSelect='1';select.tabIndex=-1;select.hidden=true;select.setAttribute('aria-hidden','true');
 const wrapper=document.createElement('span');wrapper.className='glass-select';select.before(wrapper);wrapper.append(select);
 const trigger=document.createElement('button');trigger.type='button';trigger.className='glass-select-trigger';trigger.setAttribute('role','combobox');trigger.setAttribute('aria-haspopup','listbox');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-autocomplete','none');
 const label=select.getAttribute('aria-label')||select.closest('label')?.childNodes[0]?.textContent?.trim()||select.name||'Choose option';trigger.setAttribute('aria-label',label);
 wrapper.append(trigger);const sync=()=>{trigger.textContent=select.selectedOptions[0]?.textContent||'Select…';trigger.disabled=select.disabled;};sync();select.addEventListener('change',sync);
 const open=()=>{
  if(activePopup?.trigger===trigger){closeSelect();return;}closeSelect();
  const popup=document.createElement('div');popup.className='glass-options';popup.id='glass-options-'+(++selectCount);popup.setAttribute('role','listbox');popup.setAttribute('aria-label',label);popup.setAttribute('popover','manual');trigger.setAttribute('aria-controls',popup.id);trigger.setAttribute('aria-expanded','true');
  const options=Array.from(select.options).filter(o=>!o.hidden);options.forEach(option=>{
   const item=document.createElement('button');item.className='glass-option';item.type='button';item.setAttribute('role','option');item.setAttribute('aria-selected',String(option.selected));item.textContent=option.textContent;item.disabled=option.disabled;
   item.onclick=()=>{select.value=option.value;select.dispatchEvent(new Event('change',{bubbles:true}));sync();closeSelect();if(trigger.isConnected)trigger.focus();};popup.append(item);
  });
  (select.closest('dialog')||document.body).append(popup);if(popup.showPopover)popup.showPopover();
  const r=trigger.getBoundingClientRect(),width=Math.max(r.width,160),height=Math.min(250,popup.scrollHeight+14);popup.style.width=Math.min(width,innerWidth-20)+'px';popup.style.left=Math.max(10,Math.min(innerWidth-width-10,r.left))+'px';popup.style.top=(r.bottom+height+10<=innerHeight?r.bottom+7:Math.max(10,r.top-height-7))+'px';
  activePopup={popup,trigger};const selected=popup.querySelector('[aria-selected=true]')||popup.querySelector('button');selected?.focus();
  if(window.gsap&&!reduced.matches)gsap.from(popup,{opacity:0,y:5,duration:.18,ease:'power2.out',clearProps:'opacity,transform'});
  popup.onkeydown=ev=>{const items=[...popup.querySelectorAll('button:not(:disabled)')],idx=items.indexOf(document.activeElement);if(['ArrowDown','ArrowUp','Home','End'].includes(ev.key)){ev.preventDefault();const n=ev.key==='Home'?0:ev.key==='End'?items.length-1:(idx+(ev.key==='ArrowDown'?1:-1)+items.length)%items.length;items[n]?.focus();}else if(ev.key==='Escape'||ev.key==='Tab'){if(ev.key==='Escape'){ev.preventDefault();ev.stopPropagation();}closeSelect();trigger.focus();}else if(ev.key.length===1&&!ev.ctrlKey&&!ev.metaKey){const hit=items.find((b,i)=>i>idx&&b.textContent.toLowerCase().startsWith(ev.key.toLowerCase()))||items.find(b=>b.textContent.toLowerCase().startsWith(ev.key.toLowerCase()));hit?.focus();}};
 };
 trigger.onclick=open;trigger.onkeydown=ev=>{if(['ArrowDown','ArrowUp','Home','End'].includes(ev.key)){ev.preventDefault();open();}};
 });}
document.addEventListener('pointerdown',ev=>{if(activePopup&&!activePopup.popup.contains(ev.target)&&!activePopup.trigger.contains(ev.target))closeSelect();},true);
window.addEventListener('resize',closeSelect);document.addEventListener('close',closeSelect,true);
document.addEventListener('pointermove',ev=>{const card=ev.target.closest('.record,.member,.asset-card,.kpi');if(!card||!fine.matches||reduced.matches||card.classList.contains('dragging'))return;const r=card.getBoundingClientRect(),x=(ev.clientX-r.left)/r.width,y=(ev.clientY-r.top)/r.height;card.style.setProperty('--pointer-x',x*100+'%');card.style.setProperty('--pointer-y',y*100+'%');});

function navEnter(rail){if(window.gsap&&!reduced.matches)gsap.from(rail.children,{opacity:0,y:-9,duration:.5,stagger:.035,clearProps:'opacity,transform'});}
function navFocus(rail,item){if(!item||lastNav===item.dataset.page)return;lastNav=item.dataset.page;const left=Math.max(0,Math.min(rail.scrollWidth-rail.clientWidth,item.offsetLeft+item.offsetWidth/2-rail.clientWidth/2));if(window.gsap&&!reduced.matches){gsap.to(rail,{scrollLeft:left,duration:.6,ease:'power3.out',overwrite:true});gsap.fromTo(item,{scale:.94},{scale:1,duration:.5,ease:'back.out(1.6)',clearProps:'transform'});}else rail.scrollLeft=left;}
window.PulseFX={actionsRefresh,navEnter,navFocus,enter,cleanup,modal,enhance,closeSelect,capture:root=>window.Flip&&!reduced.matches?Flip.getState(root.querySelectorAll('[data-record],.member[data-team-id]')):null,flip:state=>{if(state&&window.Flip)Flip.from(state,{duration:.5,ease:'power3.out',absolute:false,prune:true});}};
})();
