"use strict";
/* Écrans de fin de mission (normale, chrono, énigme, réparation) */

function viewTimedResult(){
  const r=M.result,L=LEVELS.find(l=>l.id===r.lv);
  let h=`<div class="result"><div class="bigtime">${fmt(r.total)}</div>
    <h2>${r.won?'Nouvelle fusée !':r.record&&r.prev?'Nouveau record !':'Course terminée !'}</h2>
    <div class="facts"><div class="fact"><b>${r.first} / ${QUESTIONS}</b><span>calculs justes</span></div><div class="fact"><b>${r.errs?'+'+r.errs*5+' s':'0 s'}</b><span>de pénalités</span></div><div class="fact"><b>${fmt(S.times[r.lv])}</b><span>record</span></div></div>
    <div class="targets"><div class="target ${r.total<=L.silver*1000?'hit':''}"><span>Fusée argent</span><span>moins de ${L.silver} s ${r.total<=L.silver*1000?'✓':''}</span></div><div class="target ${r.total<=L.gold*1000?'hit':''}"><span>Fusée or</span><span>moins de ${L.gold} s ${r.total<=L.gold*1000?'✓':''}</span></div></div>`;
  if(r.won)h+=`<div class="gift"><span class="ship-art">${rocketSVG(r.lv,r.won==='gold')}</span><div><b>${r.won==='gold'?'Fusée dorée':'Fusée'} de ${esc(L.name)} gagnée !</b><br>Elle est déjà sur ta piste. Change de fusée dans le hangar.</div></div>`;
  else if(!r.tier)h+=`<p class="note">Encore ${fmt(r.total-L.silver*1000)} à gagner pour la fusée argent. Chaque erreur coûte 5 secondes : mieux vaut juste que trop vite !</p>`;
  else if(r.tier==='silver'&&S.rockets[r.lv]!=='gold')h+=`<p class="note">Encore ${fmt(r.total-L.gold*1000)} à gagner pour la fusée or.</p>`;
  h+=`<div class="actions"><button class="cta" data-chrono="${r.lv}" style="justify-content:center"><b>Rejouer le chrono</b></button><button class="iconbtn" data-nav="hangar" style="justify-content:center">Hangar des fusées</button><button class="iconbtn" data-nav="home" style="justify-content:center">Retour à la carte</button></div></div>`;
  return h;
}

function viewRiddleResult(){
  const r=M.result,L=LEVELS.find(l=>l.id===r.lv),P=PALS[r.lv],ok=r.pts>=RIDDLE_GOAL;
  let h=`<div class="result">${r.won?`<div class="palbig">${palSVG(r.lv)}</div>`:''}
    <div class="bigtime">${fmtPts(r.pts)} / ${r.n}</div>
    <h2>${r.won?`${esc(P.name)} te rejoint !`:ok?'Énigmes résolues !':'Encore un petit effort !'}</h2>
    <div class="facts"><div class="fact"><b>${r.first} / ${r.n}</b><span>du premier coup</span></div><div class="fact"><b>${fmtPts(S.riddles[r.lv].best)}</b><span>meilleur score</span></div></div>`;
  if(r.won)h+=`<p class="note">${esc(P.name)} t'attend sur la carte. Retrouve tous tes compagnons dans « Mes compagnons ».</p>`;
  else if(!S.pals[r.lv])h+=`<div class="gift">${palSVG(r.lv,'sil')}<div><b>Qui est-ce ?</b><br>Fais ${RIDDLE_GOAL} points sur ${r.n} pour que le compagnon de ${esc(L.name)} te rejoigne. Utilise l'astuce : le calcul inverse !</div></div>`;
  h+=`<div class="actions"><button class="cta" data-riddle="${r.lv}" style="justify-content:center;text-align:center"><b>Rejouer l'énigme</b></button><button class="iconbtn" data-nav="pals" style="justify-content:center">Mes compagnons</button><button class="iconbtn" data-nav="home" style="justify-content:center">Retour à la carte</button></div></div>`;
  return h;
}

function viewResult(){
  if(M.result.riddle)return viewRiddleResult();
  if(M.result.timed)return viewTimedResult();
  const r=M.result,L=LEVELS.find(l=>l.id===r.lv);
  const titles=['Encore un petit effort !','Mission réussie !','Très belle mission !','Mission parfaite !'];
  if(r.lv==='review'){
    const left=S.errors.length;
    return `<div class="result"><div class="gift" style="border-color:var(--mint)">${myShip().replace('<svg','<svg style="width:96px;height:48px"')}<div><b>Réparations terminées !</b><br>${r.first} calcul${r.first>1?'s':''} réparé${r.first>1?'s':''} sur ${r.n}.</div></div>
      <h2>${r.first===r.n?'La fusée est comme neuve !':'Bon travail de mécanicien !'}</h2>
      <p class="note">${left?`Encore ${left} calcul${left>1?'s':''} à réparer. ${left>1?'Ils reviendront':'Il reviendra'} dans les prochaines missions.`:'Plus aucun calcul à réparer. Bravo !'}</p>
      <div class="actions">${left?`<button class="cta" data-go="review" style="justify-content:center;text-align:center"><b>Continuer les réparations</b></button>`:''}<button class="iconbtn" data-nav="home" style="justify-content:center">Retour à la carte</button></div></div>`;
  }
  let h=`<div class="result"><div class="bigstars">${[0,1,2].map(i=>STAR(i<r.stars)).join('')}</div>
    <h2>${titles[r.stars]}</h2>
    <div class="facts"><div class="fact"><b>${r.first} / ${r.n}</b><span>du premier coup</span></div><div class="fact"><b>${r.best}</b><span>meilleure série</span></div></div>`;
  if(r.stars===0&&r.lv!=='review')h+=`<p class="note">Il faut au moins 5 points pour gagner une étoile. Utilise les cubes et le calcul posé, tu vas y arriver !</p>`;
  if(r.newSticker)h+=`<div class="gift">${alien(r.newSticker.idx,r.newSticker.gold)}<div><b>Nouvel alien ${r.newSticker.gold?'doré ':''}!</b><br>Les habitants de ${esc(LEVELS[r.newSticker.idx].name)} rejoignent ton album.</div></div>`;
  if(r.unlockedNext){const n=LEVELS[LEVELS.indexOf(L)+1];h+=`<p class="note">Nouvelle planète débloquée : <b style="color:var(--star)">${esc(n.name)}</b></p>`}
  h+=`<div class="actions">`;
  const idx=L?LEVELS.indexOf(L):-1;
  if(idx>=0&&idx<LEVELS.length-1&&unlocked(idx+1)&&r.stars>=1)h+=`<button class="next" data-go="${LEVELS[idx+1].id}">Planète suivante : ${esc(LEVELS[idx+1].name)} →</button>`;
  h+=`<button class="cta" data-go="${r.lv}" style="justify-content:center"><b>Rejouer</b></button><button class="iconbtn" data-nav="home" style="justify-content:center">Retour à la carte</button></div></div>`;
  return h;
}
