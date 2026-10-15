"use strict";
/* Collections : album des aliens, hangar des fusées, compagnons */

// une grille par monde, avec son titre ; first : éléments placés en tête de la première grille
const byWorld=(grid,item,first='')=>WORLDS.map((w,k)=>`<h3 class="worldhead">${w.name}</h3><div class="${grid}">${k?'':first}${LEVELS.filter(l=>worldOf(l)===w.id).map(item).join('')}</div>`).join('');

function viewAlbum(){
  const n=Object.keys(S.stickers).length;
  let h=`<div class="bar"><button class="iconbtn" data-nav="home">← Carte</button></div><h2 style="font-size:36px">Album des aliens</h2>
  <p class="note">${n} alien${n>1?'s':''} sur ${LEVELS.length}. Gagne au moins 1 étoile sur une planète pour rencontrer ses habitants. Avec 3 étoiles, ils portent une couronne dorée !</p>`;
  return h+byWorld('album',l=>{const st=S.stickers[l.id];return `<div class="slot ${st?'':'empty'} ${st==='gold'?'gold':''}">${alien(LEVELS.indexOf(l),st==='gold')}<span class="n">${st?esc(l.name):'???'}</span>${starsTxt(starsOf(l.id))}</div>`});
}

function viewHangar(){
  const n=Object.keys(S.rockets).length,base=S.ship==='base'||!S.rockets[S.ship];
  let h=`<div class="bar"><button class="iconbtn" data-nav="home">← Carte</button></div><h2 style="font-size:36px">Hangar des fusées</h2>
  <p class="note">${n} fusée${n>1?'s':''} gagnée${n>1?'s':''} sur ${LEVELS.length}. Bats le temps argent d'une planète en mode chrono pour gagner sa fusée, puis le temps or pour la version dorée. Touche une fusée pour monter à bord.</p>`;
  const first=`<button class="bay ${base?'on':''}" data-ship="base">${ROCKET}<span class="n">Fusée de départ</span><span class="st">${base?'À bord ✓':'Disponible'}</span></button>`;
  return h+byWorld('hangar',l=>{const rk=S.rockets[l.id],on=S.ship===l.id&&rk;
    return rk?`<button class="bay ${on?'on':''}" data-ship="${l.id}">${rocketSVG(l.id,rk==='gold')}<span class="n">${esc(l.name)}${rk==='gold'?' (or)':''}</span><span class="st">${on?'À bord ✓':rk==='gold'?'Record '+fmt(S.times[l.id]):`Or : moins de ${l.gold} s`}</span></button>`
      :`<div class="bay locked">${rocketSVG(l.id,false)}<span class="n">${esc(l.name)}</span><span class="st">${chronoOpen(l.id)?`Chrono en moins de ${l.silver} s`:'Gagne 1 ★ sur la planète'}</span></div>`},first);
}

function viewPals(){
  const n=Object.keys(S.pals).length;
  let h=`<div class="bar"><button class="iconbtn" data-nav="home">← Carte</button></div><h2 style="font-size:36px">Mes compagnons</h2>
  <p class="note">${n} compagnon${n>1?'s':''} sur ${LEVELS.length}. Chaque planète cache un compagnon : fais ${RIDDLE_GOAL} points sur 10 en mode énigme pour qu'il te rejoigne. Touche un compagnon pour qu'il t'accompagne sur la carte.</p>`;
  return h+byWorld('album',l=>{const has=S.pals[l.id],on=has&&S.pal===l.id,rb=S.riddles[l.id];
    return has?`<button class="slot ${on?'on':''}" data-pal="${l.id}">${palSVG(l.id)}<span class="n">${esc(PALS[l.id].name)}</span><span class="st">${on?'Avec toi ✓':esc(l.name)}</span></button>`
      :`<div class="slot sil">${palSVG(l.id)}<span class="n">???</span><span class="st">${chronoOpen(l.id)?`Énigme de ${esc(l.name)} : ${RIDDLE_GOAL}/10${rb?` (record ${fmtPts(rb.best)})`:''}`:`Gagne 1 ★ sur ${esc(l.name)}`}</span></div>`});
}
