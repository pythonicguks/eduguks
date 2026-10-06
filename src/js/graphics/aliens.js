"use strict";
/* Aliens de l'album (gagnés en mode normal) */

function alien(i,gold){
  const L=LEVELS[i],col=L.c2,eyes=[1,2,3][i%3],ant=i%2?2:1;
  let s=`<svg viewBox="0 0 100 100" aria-hidden="true">`;
  if(ant===1)s+=`<line x1="50" y1="34" x2="50" y2="12" stroke="${col}" stroke-width="5"/><circle cx="50" cy="11" r="7" fill="${L.c1}"/>`;
  else s+=`<line x1="38" y1="36" x2="27" y2="12" stroke="${col}" stroke-width="5"/><line x1="62" y1="36" x2="73" y2="12" stroke="${col}" stroke-width="5"/><circle cx="27" cy="11" r="6" fill="${L.c1}"/><circle cx="73" cy="11" r="6" fill="${L.c1}"/>`;
  s+=`<ellipse cx="20" cy="66" rx="8" ry="5" fill="${col}" transform="rotate(-30 20 66)"/><ellipse cx="80" cy="66" rx="8" ry="5" fill="${col}" transform="rotate(30 80 66)"/>`;
  s+=`<ellipse cx="50" cy="62" rx="31" ry="30" fill="${col}"/><ellipse cx="42" cy="48" rx="12" ry="7" fill="#fff" opacity=".18"/>`;
  const xs=eyes===1?[50]:eyes===2?[39,61]:[35,50,65],r=eyes===1?12:eyes===2?9:7;
  xs.forEach(x=>{s+=`<circle cx="${x}" cy="56" r="${r}" fill="#fff"/><circle cx="${x+2}" cy="57" r="${r*.45}" fill="#12163a"/>`});
  s+=`<path d="M38 76 Q50 86 62 76" stroke="#12163a" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  if(gold)s+=`<path d="M34 30 L38 18 L46 26 L50 14 L54 26 L62 18 L66 30 Z" fill="#ffd23f" stroke="#c19a12" stroke-width="2"/>`;
  return s+`</svg>`;
}
