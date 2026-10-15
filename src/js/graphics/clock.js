"use strict";
/* Horloge à aiguilles. opt.ring : nombres des minutes (0, 5, 10…) autour du cadran ;
   opt.labels : légende des aiguilles (petite = heures, grande = minutes). */

const HOUR_HAND='#e0573a', MINUTE_HAND='#2a6fd6';

function clockSVG(h,m,opt={}){
  const W=opt.ring?250:206,c=W/2,R=88;
  const pt=(deg,r)=>[c+r*Math.sin(deg*Math.PI/180),c-r*Math.cos(deg*Math.PI/180)].map(v=>v.toFixed(1));
  let s=`<svg class="clockface" viewBox="0 0 ${W} ${W}" aria-hidden="true">`;
  s+=`<circle cx="${c}" cy="${c}" r="${R+9}" fill="#ffb86b"/><circle cx="${c}" cy="${c}" r="${R}" fill="#fffaf0"/>`;
  for(let i=0;i<60;i++){
    const big=i%5===0,[x1,y1]=pt(i*6,R-(big?11:6)),[x2,y2]=pt(i*6,R-2);
    s+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#2b2b2b" stroke-width="${big?3.2:1.3}" stroke-linecap="round"/>`;
  }
  for(let n=1;n<=12;n++){const [x,y]=pt(n*30,R-25);s+=`<text x="${x}" y="${y}" dy=".36em" text-anchor="middle" font-family="Baloo 2, Comic Sans MS, sans-serif" font-weight="800" font-size="21" fill="#12163a">${n}</text>`}
  if(opt.ring)for(let i=0;i<12;i++){const [x,y]=pt(i*30,R+22);s+=`<text x="${x}" y="${y}" dy=".36em" text-anchor="middle" font-family="Baloo 2, Comic Sans MS, sans-serif" font-weight="700" font-size="15" fill="var(--sky)">${i*5}</text>`}
  const hand=(deg,len,w,col)=>{const [x,y]=pt(deg,len);return `<line x1="${c}" y1="${c}" x2="${x}" y2="${y}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`};
  s+=hand((h%12+m/60)*30,R*.5,9,HOUR_HAND)+hand(m*6,R*.8,5.5,MINUTE_HAND);
  s+=`<circle cx="${c}" cy="${c}" r="6" fill="#2b2b2b"/></svg>`;
  return s;
}
