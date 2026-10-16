"use strict";
/* Écran « Qui joue ? » : choisir, ajouter ou supprimer un joueur ; chacun garde sa propre progression */

const PERSON=`<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4.5" fill="currentColor"/><path d="M3.5 21a8.5 8.5 0 0 1 17 0Z" fill="currentColor"/></svg>`;
const playerName=p=>p.name||'Astronaute';
let confirmDelete='';

function viewPlayers(){
  let h=`<div class="bar"><button class="iconbtn" data-nav="home">← Carte</button></div><h2 style="font-size:36px">Qui joue ?</h2>
  <p class="note">Chaque joueur garde ses étoiles, ses aliens, ses fusées et ses compagnons. Touche un joueur pour jouer avec sa progression.</p><div class="players">`;
  P.list.forEach(p=>{
    const s=playerSummary(p.id),on=p.id===P.current;
    h+=`<div class="player ${on?'on':''}"><button class="pick" data-player="${p.id}" aria-label="Jouer avec ${esc(playerName(p))}">
      ${s.pal?palSVG(s.pal):myShipFor(p.id)}<span class="n">${esc(playerName(p))}</span><span class="st">${on?'En train de jouer ✓':`★ ${s.stars}`}</span></button>
      ${confirmDelete===p.id?`<div class="confirm"><span>Effacer toute sa progression ?</span><button class="danger solid" data-act="del-yes">Oui</button><button class="iconbtn" data-act="del-no">Non</button></div>`
        :`<button class="del" data-delplayer="${p.id}" aria-label="Supprimer ${esc(playerName(p))}">Supprimer</button>`}</div>`;
  });
  h+=`</div>`;
  if(P.list.length<MAX_PLAYERS)h+=`<div class="box"><h3>Nouveau joueur</h3><div class="field"><input id="newplayer" maxlength="20" placeholder="Prénom" aria-label="Prénom du nouveau joueur"><button class="iconbtn" data-act="addplayer">Ajouter</button></div></div>`;
  else h+=`<p class="note">${MAX_PLAYERS} joueurs au maximum : supprime un joueur pour en ajouter un autre.</p>`;
  return h;
}
// la fusée d'un joueur (pour ceux qui n'ont pas encore de compagnon)
function myShipFor(id){const s=id===P.current?S:loadState(id);return s.rockets[s.ship]?rocketSVG(s.ship,s.rockets[s.ship]==='gold'):ROCKET}
