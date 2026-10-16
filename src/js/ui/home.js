"use strict";
/* Écran d'accueil : carte des planètes et compagnon */

// la mission du jour : la première planète ouverte du monde affiché qui n'a pas ses 3 étoiles
function suggested(){
  const idx=LEVELS.map((l,i)=>i).filter(i=>worldOf(LEVELS[i])===S.world);
  return idx.find(i=>unlocked(i)&&starsOf(LEVELS[i].id)<3)??idx[idx.length-1];
}
const WORLD_ICONS={
  calc:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3v8M3 7h8M14 7h7M14 16h7M14 20h7" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M4 15l6 6M10 15l-6 6" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>`,
  money:`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M15.5 8.5a4.5 4.5 0 1 0 0 7M6.5 11h6M6.5 13.5h6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/></svg>`,
  clock:`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M12 6.5V12l3.5 2.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" fill="none"/></svg>`,
};
const worldTabs=()=>`<div class="worlds" role="tablist" aria-label="Mondes">${WORLDS.map(w=>`<button role="tab" aria-selected="${S.world===w.id}" data-world="${w.id}">${WORLD_ICONS[w.id]}${w.name}</button>`).join('')}</div>`;
function viewBuddy(){
  if(S.pal&&S.pals[S.pal]){const P=PALS[S.pal];return `<button class="buddy" data-nav="pals" aria-label="${esc(P.name)}, ton compagnon. Voir mes compagnons">${palSVG(S.pal)}<span class="bubble">${esc(P.cry)} ${esc(pick(BUDDY_LINES))}</span></button>`}
  if(LEVELS.some(l=>chronoOpen(l.id)))return `<button class="buddy" data-nav="pals">${palSVG('tens','sil')}<span class="bubble">Qui est-ce ? Réussis une énigme pour gagner ton premier compagnon !</span></button>`;
  return '';
}

function viewHome(){
  const s=suggested(),L=LEVELS[s],streak=currentStreak();
  let h=`<div class="bar"><div class="grow"></div>
    <span class="chip" title="Étoiles gagnées"><span class="s">★</span>${totalStars()} / ${LEVELS.length*3}</span>
    <span class="chip" title="Jours d'entraînement d'affilée"><span class="f">▲</span>${streak} jour${streak>1?'s':''}</span></div>
  <div class="hero">${myShip()}<div><h1>Fusée des <span>Nombres</span></h1>
    <p class="hello">${S.name?`Prêt pour le décollage, ${esc(S.name)} ?`:'Prêt pour le décollage, astronaute ?'} Relève les défis pour voler de planète en planète.</p></div></div>
  ${viewBuddy()}
  ${worldTabs()}
  <button class="cta" data-go="${L.id}"><span><small>Mission du jour · ${esc(L.name)}</small><b>${esc(L.skill)}</b><small>${L.ex}</small></span><span class="go">Go !</span></button>`;
  if(S.world==='calc'&&S.errors.length)h+=`<button class="review" data-go="review">↻ Mission réparation : ${Math.min(S.errors.length,REVIEW_MAX)} calcul${Math.min(S.errors.length,REVIEW_MAX)>1?'s':''} à retenter</button>`;
  h+=`<ol class="map" aria-label="Carte des planètes">`;
  LEVELS.forEach((l,i)=>{
    if(worldOf(l)!==S.world)return;
    const open=unlocked(i);
    const co=chronoOpen(l.id),best=S.times[l.id],rk=S.rockets[l.id],rb=S.riddles[l.id],pal=S.pals[l.id];
    h+=`<li><button class="stop" ${open?`data-go="${l.id}"`:'disabled'} style="--c1:${l.c1};--c2:${l.c2}" aria-label="${esc(l.name)}, ${esc(l.skill)}${open?'':', verrouillée'}">
      <span class="planet ${l.ring?'ring':''}">${open?'':`<span class="lock">${LOCK}</span>`}</span>
      <span class="t"><span class="n">${esc(l.name)}</span><br><span class="k">${esc(l.skill)}</span><br><span class="ex">${l.ex}</span><br>${starsTxt(starsOf(l.id))}</span>
    </button>${co?`<span class="modes"><button class="chrono" data-chrono="${l.id}" aria-label="Chrono ${esc(l.name)}${best?', record '+fmt(best):''}"><span class="lbl">Chrono</span><span class="mini"><span class="best">${best?fmt(best):'Go !'}</span><span class="medals" aria-hidden="true"><i class="${rk?'silver':''}"></i><i class="${rk==='gold'?'gold':''}"></i></span></span></button>
      <button class="chrono riddle" data-riddle="${l.id}" aria-label="Énigme ${esc(l.name)}${rb?', meilleur score '+fmtPts(rb.best)+' sur 10':''}${pal?', compagnon gagné':''}"><span class="lbl">Énigme</span><span class="mini"><span class="best">${rb?fmtPts(rb.best)+'/10':'Go !'}</span>${palSVG(l.id,pal?'':'sil')}</span></button></span>`
      :`<button class="chrono" disabled aria-label="Chrono et énigme verrouillés">${LOCK.replace('width="28" height="32"','width="18" height="20"')}<span>Défis : 1 ★ pour les ouvrir</span></button>`}</li>`;
  });
  h+=`</ol><div class="foot"><button class="iconbtn" data-nav="album">Album des aliens</button><button class="iconbtn" data-nav="hangar">Hangar des fusées</button><button class="iconbtn" data-nav="pals">Mes compagnons</button><button class="iconbtn" data-nav="parents">Espace parents</button></div>`;
  return h;
}
