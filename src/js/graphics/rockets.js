"use strict";
/* Fusées : celle de départ et les 9 fusées gagnées en mode chrono */

const ROCKET=`<svg viewBox="0 0 64 32" aria-hidden="true"><path class="flame" d="M10 12 Q-4 16 10 20 Z" fill="var(--star)"/><path d="M10 16 L18 9 H44 Q58 11 63 16 Q58 21 44 23 H18 Z" fill="var(--ink)"/><circle cx="44" cy="16" r="4.5" fill="var(--sky)"/><path d="M18 9 L12 1 H24 L31 9Z" fill="var(--rocket)"/><path d="M18 23 L12 31 H24 L31 23Z" fill="var(--rocket)"/></svg>`;
function rocketSVG(id,gold){
  const i=LEVELS.findIndex(l=>l.id===id);
  if(i<0)return ROCKET;
  const L=LEVELS[i],body=gold?'#ffd23f':L.c1,fin=L.c2,v=i%3;
  let s=`<svg viewBox="0 0 64 32" aria-hidden="true"><path class="flame" d="M10 12 Q-4 16 10 20 Z" fill="var(--star)"/><path d="M18 9 L12 1 H24 L31 9Z" fill="${fin}"/><path d="M18 23 L12 31 H24 L31 23Z" fill="${fin}"/>`;
  if(v===0)s+=`<path d="M10 16 L18 9 H44 Q58 11 63 16 Q58 21 44 23 H18 Z" fill="${body}"/><path d="M50 10.5 Q58 12 63 16 Q58 20 50 21.5 Z" fill="${fin}"/><circle cx="40" cy="16" r="4.5" fill="var(--sky)"/>`;
  else if(v===1)s+=`<path d="M10 16 L16 10 H40 L63 16 L40 22 H16 Z" fill="${body}"/><rect x="16" y="14.5" width="24" height="3" fill="${fin}"/><circle cx="46" cy="16" r="3.5" fill="var(--sky)"/>`;
  else s+=`<rect x="10" y="8" width="44" height="16" rx="8" fill="${body}"/><path d="M52 9 Q64 16 52 23Z" fill="${fin}"/><circle cx="30" cy="16" r="3.5" fill="var(--sky)"/><circle cx="42" cy="16" r="3.5" fill="var(--sky)"/>`;
  if(gold)s+=`<path d="M26 1 l1.6 3.4 3.4 1.6 -3.4 1.6 -1.6 3.4 -1.6 -3.4 -3.4 -1.6 3.4 -1.6z" fill="#fff"/>`;
  return s+`</svg>`;
}
const myShip=()=>S.rockets[S.ship]?rocketSVG(S.ship,S.rockets[S.ship]==='gold'):ROCKET;
