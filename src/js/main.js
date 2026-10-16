"use strict";
/* Démarrage et interactions (clavier, boutons, chrono) */

function press(k){
  if(screen!=='game'||!M)return;
  if(M.phase==='solution'){if(k==='ok')nextQ();return}
  if(M.phase!=='ask')return;
  if(k==='ok'){submit();return}
  const q=M.qs[M.i];
  if(q.clock||(q.money&&q.cents))typeTime(q,k);
  else if(q.money&&q.kind==='pay')return;
  else if(k==='del')M.input=M.input.slice(0,-1);
  else if(M.input.length<2)M.input=(M.input==='0'?'':M.input)+k;
  if(M.msgCls==='bad'&&(M.input||M.hh))M.msg='';
  sfx.key();render();
}

/* saisie en deux parties (heures et minutes, ou euros et centimes) : les chiffres vont dans la première case,
   puis passent tout seuls à la seconde dès que la première est complète (« 3 » puis « 25 » donne 3 h 25) */
function typeTime(q,k){
  const max=q.clock?clockMaxHour(q):9;
  if(k==='del'){
    if(M.slot==='m'&&M.mm)M.mm=M.mm.slice(0,-1);
    else{M.slot='h';M.hh=M.hh.slice(0,-1)}
    return;
  }
  if(M.slot==='h'){
    if(M.hh===''&&k==='0')return;
    if(M.hh.length<2&&+(M.hh+k)<=max){M.hh+=k;if(M.hh.length===2||+M.hh*10>max)M.slot='m';return}
    M.slot='m';
  }
  if(M.mm.length<2&&+(M.mm+k)<=(q.clock?59:99))M.mm+=k;
}

// on vient de poser ou reprendre de l'argent sur le comptoir
function moneyTouched(){if(M.msgCls==='bad')M.msg='';sfx.key();render()}

app.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.key){press(b.dataset.key);return}
  if(b.dataset.slot){if(M&&M.phase==='ask'){M.slot=b.dataset.slot;render()}return}
  if(b.dataset.adj){if(M&&M.phase==='ask'){M.set=clockAdjust(M.set,+b.dataset.adj);if(M.msgCls==='bad')M.msg='';sfx.key();render()}return}
  if(b.dataset.pay){if(M&&M.phase==='ask'&&M.counter.length<20){M.counter.push({v:+b.dataset.pay,w:-1});moneyTouched()}return}
  if(b.dataset.pick){const w=+b.dataset.pick;if(M&&M.phase==='ask'&&!M.counter.some(c=>c.w===w)){M.counter.push({v:M.qs[M.i].wallet[w],w});moneyTouched()}return}
  if(b.dataset.unpay){if(M&&M.phase==='ask'){M.counter.splice(+b.dataset.unpay,1);moneyTouched()}return}
  if(b.dataset.player){switchPlayer(b.dataset.player);M=null;confirmDelete='';screen='home';render();window.scrollTo(0,0);return}
  if(b.dataset.delplayer){confirmDelete=b.dataset.delplayer;render();return}
  if(b.dataset.world){S.world=b.dataset.world;save();render();return}
  if(b.dataset.go){startMission(b.dataset.go);window.scrollTo(0,0);return}
  if(b.dataset.chrono){startMission(b.dataset.chrono,'timed');window.scrollTo(0,0);return}
  if(b.dataset.riddle){startMission(b.dataset.riddle,'riddle');window.scrollTo(0,0);return}
  if(b.dataset.pal){S.pal=b.dataset.pal;save();render();return}
  if(b.dataset.ship){S.ship=b.dataset.ship;save();render();return}
  if(b.dataset.nav){screen=b.dataset.nav;M=screen==='home'?null:M;confirmReset=false;confirmDelete='';render();window.scrollTo(0,0);return}
  const a=b.dataset.act;
  if(a==='sound'){S.sound=!S.sound;save();render()}
  else if(a==='blocks'){M.aid=M.aid==='blocks'?false:'blocks';render()}
  else if(a==='cols'){M.aid=M.aid==='hint'?false:'hint';render()}
  else if(a==='ring'){M.ring=!M.ring;render()}
  else if(a==='tally'){M.tally=!M.tally;render()}
  else if(a==='sort'){M.sorted=!M.sorted;render()}
  else if(a==='clear'){if(M.phase==='ask'){M.counter=[];moneyTouched()}}
  else if(a==='next')nextQ();
  else if(a==='savename'){setPlayerName(document.getElementById('kidname').value);render();document.querySelector('[data-act="savename"]').textContent='Enregistré ✓'}
  else if(a==='addplayer'){addPlayer(document.getElementById('newplayer').value);M=null;screen='home';render();window.scrollTo(0,0)}
  else if(a==='del-yes'){deletePlayer(confirmDelete);confirmDelete='';render()}
  else if(a==='del-no'){confirmDelete='';render()}
  else if(a==='reset'){confirmReset=true;render()}
  else if(a==='reset-no'){confirmReset=false;render()}
  else if(a==='reset-yes'){const keep={sound:S.sound,name:S.name};S=Object.assign(fresh(),keep);applyMagic();save();confirmReset=false;screen='home';render()}
});
// appui long sur un bouton ou un dessin : pas de menu du navigateur (copier, enregistrer l'image…)
document.addEventListener('contextmenu',e=>{if(e.target.closest('button,svg'))e.preventDefault()});
document.addEventListener('keydown',e=>{
  if(e.target.tagName==='INPUT'){if(e.key==='Enter'&&e.target.id==='newplayer'){e.preventDefault();app.querySelector('[data-act="addplayer"]').click()}return}
  if(screen!=='game')return;
  if(/^[0-9]$/.test(e.key))press(e.key);
  else if(['h',':',',','.'].includes(e.key)&&M&&(M.qs[M.i].clock||M.qs[M.i].cents)&&M.phase==='ask'){M.slot='m';render()}
  else if(e.key==='Backspace'){e.preventDefault();press('del')}
  else if(e.key==='Enter'){e.preventDefault();press('ok')}
});

/* chrono : affichage en direct, pause quand l'appli passe en arrière-plan */
setInterval(()=>{if(screen!=='game'||!M||!M.timed)return;const el=document.getElementById('clock');if(el)el.textContent=fmt(clockMs())},100);
document.addEventListener('visibilitychange',()=>{
  if(!M||!M.timed||screen!=='game'||M.phase!=='ask')return;
  if(document.hidden){M.elapsed+=performance.now()-M.tick;M.paused=true}
  else{M.tick=performance.now();M.paused=false}
});
/* reprise d'une mission en cours après une mise à jour de la page */
function start(data){
  if(data&&data.M&&data.screen==='game'){M=data.M;screen='game';if(M.timed){M.tick=performance.now();M.paused=false}}
  render();
}
if(window.claude&&window.claude.hot&&window.claude.hot.snapshot){try{window.claude.hot.snapshot(()=>({M,screen}))}catch(e){}}
window.claude?.hot?.ready?window.claude.hot.ready(start):start(window.claude?.hot?.data??{});
