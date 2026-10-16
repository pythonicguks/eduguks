"use strict";
/* Pièces et billets en euros : dessins simplifiés (couleurs et tailles proches des vrais, sans copier leurs motifs) */

const COIN_SIZE={10:19.75,20:22.25,50:24.25,100:23.25,200:25.75};   // diamètres réels, en mm
const BILL_COLORS={500:['#b9c2bd','#7d8a84'],1000:['#f2a99c','#c4554a'],2000:['#a9c3ef','#4a72bf'],5000:['#f6c27e','#d2822c']};

function moneySVG(v,scale=1){
  if(v>=500){
    const [light,dark]=BILL_COLORS[v],w=84*scale;
    return `<svg class="bill" width="${w}" height="${w*.53}" viewBox="0 0 120 64" aria-hidden="true"><rect x="2" y="2" width="116" height="60" rx="6" fill="${light}" stroke="${dark}" stroke-width="3"/>
      <rect x="9" y="9" width="102" height="46" rx="3" fill="none" stroke="${dark}" stroke-width="1.5" stroke-dasharray="4 3"/><circle cx="88" cy="32" r="15" fill="#fff" opacity=".5"/>
      <text x="14" y="42" font-family="Baloo 2, Comic Sans MS, sans-serif" font-weight="800" font-size="30" fill="#12163a">${v/100} €</text></svg>`;
  }
  const d=COIN_SIZE[v]*2.2*scale,bi=v>=100,outer=v===200?'#d6dbe4':'#e7c255',inner=v===100?'#d6dbe4':'#e7c255';
  return `<svg class="coin" width="${d}" height="${d}" viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="28" fill="${outer}" stroke="#8a6d1f" stroke-width="2"/>
    ${bi?`<circle cx="30" cy="30" r="19" fill="${inner}" stroke="#8a6d1f" stroke-width="1.2"/>`:`<circle cx="30" cy="30" r="23" fill="none" stroke="#b08a2a" stroke-width="1.2"/>`}
    <text x="30" y="30" dy=".36em" text-anchor="middle" font-family="Baloo 2, Comic Sans MS, sans-serif" font-weight="800" font-size="${bi?17:19}" fill="#12163a">${moneyLabel(v)}</text></svg>`;
}
