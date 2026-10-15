"use strict";
/* Espace parents */

let confirmReset=false;
function viewParents(){
  let h=`<div class="bar"><button class="iconbtn" data-nav="home">← Carte</button></div><div class="parents"><h2>Espace parents</h2>
  <div class="box"><h3>Prénom de l'astronaute</h3><div class="field"><input id="kidname" maxlength="20" placeholder="ex. Léo" value="${esc(S.name)}" aria-label="Prénom"><button class="iconbtn" data-act="savename">Enregistrer</button></div></div>
  <div class="box"><h3>Progression</h3><div class="tbl"><table><thead><tr><th>Planète</th><th>Compétence</th><th class="num">Missions</th><th class="num">1er essai</th><th>Étoiles</th><th class="num">Chrono</th><th class="num">Énigme</th></tr></thead><tbody>`;
  LEVELS.forEach(l=>{const st=S.stats[l.id]||{q:0,first:0,missions:0},p=st.q?Math.round(st.first/st.q*100):null;
    h+=`<tr><td>${esc(l.name)}</td><td>${esc(l.skill)}<br><span class="legend">${l.ex}</span></td><td class="num">${st.missions}</td><td class="num">${p===null?'–':`<span class="meter"><i style="width:${p}%"></i></span>${p} %`}</td><td>${starsTxt(starsOf(l.id))}</td><td class="num">${S.times[l.id]?fmt(S.times[l.id]):'–'}<br><span class="legend">${l.silver} / ${l.gold} s</span></td><td class="num">${S.riddles[l.id]?fmtPts(S.riddles[l.id].best)+'/10':'–'}${S.pals[l.id]?'<br><span class="legend">compagnon ✓</span>':''}</td></tr>`});
  h+=`</tbody></table></div><p class="note" style="margin-top:10px">« 1er essai » = part des calculs justes sans aide de correction. Au-delà de 80 %, la compétence est bien installée. « Chrono » = meilleur temps, puis les objectifs argent / or. « Énigme » = meilleur score (8/10 fait gagner le compagnon).</p></div>`;
  h+=`<div class="box"><h3>Calculs à retravailler</h3>${S.errors.length?`<div class="errs">${S.errors.slice().reverse().map(e=>`<span class="err">${e.a} ${sign(e.op)} ${e.b} = ${res(e)}</span>`).join('')}</div><p class="note" style="margin-top:10px">Ces calculs reviennent automatiquement dans les missions. Ils disparaissent de la liste quand votre enfant les réussit du premier coup.</p>`:`<p class="note">Aucun pour l'instant.</p>`}</div>
  <div class="box"><h3>Conseils</h3><ul class="tips">
    <li>Une mission (10 calculs) dure 5 à 10 minutes. Une par jour suffit : la régularité compte plus que la durée.</li>
    <li>Une étoile débloque la planète suivante. Encouragez à revenir chercher les 3 étoiles : c'est là que l'automatisme se crée.</li>
    <li>Les boutons « Voir les cubes » et « Poser le calcul » sont libres d'accès. Laissez votre enfant les utiliser ; ils disparaissent d'eux-mêmes quand il n'en a plus besoin.</li>
    <li>Pour les soustractions avec retenue, le jeu montre la méthode par <b>échange</b> (« je casse une dizaine en 10 unités »). Si l'école utilise une autre méthode (compensation), privilégiez celle de l'enseignant.</li>
    <li>Le mode chrono s'ouvre dès 1 étoile. Il travaille la rapidité une fois la méthode comprise ; chaque erreur ajoute 5 secondes, donc la justesse reste la priorité. Si vous sentez de la pression, revenez au mode normal.</li>
    <li>Le mode énigme (« 34 + ? = 52 ») s'ouvre lui aussi dès 1 étoile. Il fait travailler le lien entre addition et soustraction : l'astuce montre le calcul inverse à poser. Les erreurs de ce mode ne vont pas dans les calculs à retravailler.</li>
    <li>La progression est enregistrée dans ce navigateur, sur cet appareil.</li></ul></div>
  <div class="box"><h3>Recommencer à zéro</h3>${confirmReset?`<p class="note">Toute la progression, les étoiles, les aliens, les temps, les fusées et les compagnons seront effacés.</p><div class="field" style="margin-top:10px"><button class="danger solid" data-act="reset-yes">Oui, tout effacer</button><button class="iconbtn" data-act="reset-no">Annuler</button></div>`:`<button class="danger" data-act="reset">Effacer la progression</button>`}</div></div>`;
  return h;
}
