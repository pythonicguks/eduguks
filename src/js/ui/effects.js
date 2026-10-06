"use strict";
/* Effets visuels : confettis et ciel étoilé */

function confetti(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const c=document.createElement('div');c.className='confetti';
  const cols=['var(--star)','var(--rocket)','var(--mint)','var(--sky)'];
  for(let i=0;i<60;i++){const p=document.createElement('i');p.style.left=Math.random()*100+'%';p.style.background=cols[i%4];p.style.animationDelay=Math.random()*.8+'s';c.appendChild(p)}
  document.body.appendChild(c);setTimeout(()=>c.remove(),3500);
}
/* ciel étoilé */
(function(){const sky=document.getElementById('sky');let h='';for(let i=0;i<70;i++){const s=Math.random()<.15?3:2;h+=`<i style="left:${Math.random()*100}%;top:${Math.random()*100}%;width:${s}px;height:${s}px;animation-delay:${(Math.random()*3).toFixed(2)}s"></i>`}sky.innerHTML=h})();
