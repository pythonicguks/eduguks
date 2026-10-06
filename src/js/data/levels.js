"use strict";
/* Niveaux : une planète = une compétence du programme de CE1. Générateurs de calculs, objectifs du chrono et de l'énigme. */

const GEN={
  // 30 + 40, 80 − 50
  tens(){ if(Math.random()<.6){const ta=rnd(1,8);return Q(ta*10,'+',rnd(1,9-ta)*10)} const ta=rnd(2,9);return Q(ta*10,'-',rnd(1,ta-1)*10) },
  // 34 + 5 (sans retenue)
  addSmall(){ const u=rnd(0,8);return Q(rnd(1,8)*10+u,'+',rnd(1,9-u)) },
  // 23 + 45 (sans retenue)
  add2(){ const ua=rnd(0,8),ub=rnd(1,9-ua),ta=rnd(1,8),tb=rnd(1,9-ta);return Q(ta*10+ua,'+',tb*10+ub) },
  // 58 − 23 ou 47 − 5 (sans échange)
  subSimple(){ if(Math.random()<.3){const ua=rnd(1,9);return Q(rnd(1,9)*10+ua,'-',rnd(1,ua))} const ta=rnd(2,9),ua=rnd(0,9);return Q(ta*10+ua,'-',rnd(1,ta-1)*10+rnd(0,ua)) },
  // 27 + 5 (on passe la dizaine)
  addCross(){ const ua=rnd(2,9);return Q(rnd(1,8)*10+ua,'+',rnd(10-ua,9)) },
  // 38 + 47 (avec retenue)
  addCarry(){ const ua=rnd(1,9),ub=rnd(Math.max(1,10-ua),9),ta=rnd(1,7),tb=rnd(1,8-ta);return Q(ta*10+ua,'+',tb*10+ub) },
  // 42 − 7 (on recule sous la dizaine)
  subCross(){ const ua=rnd(0,8);return Q(rnd(2,9)*10+ua,'-',rnd(ua+1,9)) },
  // 63 − 28 (avec échange)
  subBorrow(){ const ta=rnd(2,9),ua=rnd(0,8);return Q(ta*10+ua,'-',rnd(1,ta-1)*10+rnd(ua+1,9)) },
};
GEN.mix=()=>pick([GEN.add2,GEN.addCarry,GEN.addCarry,GEN.addCross,GEN.subSimple,GEN.subCross,GEN.subBorrow,GEN.subBorrow])();

const LEVELS=[
  {id:'tens',     name:'Lunette',      skill:'Les dizaines rondes',        ex:'30 + 40',  c1:'#c3cfff',c2:'#4b5bd6',silver:60,gold:35},
  {id:'addSmall', name:'Pétilla',      skill:'Ajouter des unités',         ex:'34 + 5',   c1:'#ffe6a8',c2:'#e89a2c',ring:true,silver:60,gold:35},
  {id:'add2',     name:'Bulle-Bleue',  skill:'Dizaines et unités',         ex:'23 + 45',  c1:'#b5efff',c2:'#2a8fc7',silver:75,gold:45},
  {id:'subSimple',name:'Cratéra',      skill:'Soustraire sans échange',    ex:'58 − 23',  c1:'#e6d9ff',c2:'#7d55d9',silver:80,gold:50},
  {id:'addCross', name:'Rocha',        skill:'Passer la dizaine',          ex:'27 + 5',   c1:'#ffc9b8',c2:'#e0573a',ring:true,silver:80,gold:50},
  {id:'addCarry', name:'Volcania',     skill:'Additions avec retenue',     ex:'38 + 47',  c1:'#ffc2d2',c2:'#c23a6b',silver:100,gold:65},
  {id:'subCross', name:'Glaçon',       skill:'Reculer sous la dizaine',    ex:'42 − 7',   c1:'#d6fff3',c2:'#2fb58e',silver:90,gold:60},
  {id:'subBorrow',name:'Nébula',       skill:'Soustractions avec échange', ex:'63 − 28',  c1:'#f7ccff',c2:'#9a3fc2',ring:true,silver:120,gold:80},
  {id:'mix',      name:'Étoile Royale',skill:'Le grand défi',              ex:'tout mélangé',c1:'#fff4b8',c2:'#e0a800',silver:120,gold:80},
];
const QUESTIONS=10;
const REVIEW_MAX=8;
const lvOrder=lv=>{const i=LEVELS.findIndex(l=>l.id===lv);return i<0?LEVELS.length:i};
const RIDDLE_GOAL=8;
