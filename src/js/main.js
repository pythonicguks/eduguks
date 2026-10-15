"use strict";
/* Démarrage et interactions (clavier, boutons, chrono) */

function press(k){
  if(screen!=='game'||!M)return;
  if(M.phase==='solution'){if(k==='ok')nextQ();return}
  if(M.phase!=='ask')return;
  if(k==='ok'){submit();return}
  const q=M.qs[M.i];
  if(q.clock)typeTime(q,k);
  else if(k==='del')M.input=M.input.slice(0,-1);
  else if(M.input.length<2)M.input=(M.input==='0'?'':M.input)+k;
  if(M.msgCls==='bad'&&(M.input||M.hh))M.msg='';
  sfx.key();render();
}

/* saisie d'une heure : les chiffres vont dans les heures, puis passent tout seuls aux minutes
   dès que les heures sont complètes (« 3 » puis « 25 » donne 3 h 25) */
function typeTime(q,k){
  const max=clockMaxHour(q);
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
  if(M.mm.length<2&&+(M.mm+k)<=59)M.mm+=k;
}

app.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.key){press(b.dataset.key);return}
  if(b.dataset.slot){if(M&&M.phase==='ask'){M.slot=b.dataset.slot;render()}return}
  if(b.dataset.adj){if(M&&M.phase==='ask'){M.set=clockAdjust(M.set,+b.dataset.adj);if(M.msgCls==='bad')M.msg='';sfx.key();render()}return}
  if(b.dataset.world){S.world=b.dataset.world;save();render();return}
  if(b.dataset.go){startMission(b.dataset.go);window.scrollTo(0,0);return}
  if(b.dataset.chrono){startMission(b.dataset.chrono,'timed');window.scrollTo(0,0);return}
  if(b.dataset.riddle){startMission(b.dataset.riddle,'riddle');window.scrollTo(0,0);return}
  if(b.dataset.pal){S.pal=b.dataset.pal;save();render();return}
  if(b.dataset.ship){S.ship=b.dataset.ship;save();render();return}
  if(b.dataset.nav){screen=b.dataset.nav;M=screen==='home'?null:M;confirmReset=false;render();window.scrollTo(0,0);return}
  const a=b.dataset.act;
  if(a==='sound'){S.sound=!S.sound;save();render()}
  else if(a==='blocks'){M.aid=M.aid==='blocks'?false:'blocks';render()}
  else if(a==='cols'){M.aid=M.aid==='hint'?false:'hint';render()}
  else if(a==='ring'){M.ring=!M.ring;render()}
  else if(a==='next')nextQ();
  else if(a==='savename'){S.name=(document.getElementById('kidname').value||'').trim().slice(0,20);save();b.textContent='Enregistré ✓'}
  else if(a==='reset'){confirmReset=true;render()}
  else if(a==='reset-no'){confirmReset=false;render()}
  else if(a==='reset-yes'){const keep=S.sound;S=fresh();S.sound=keep;save();confirmReset=false;screen='home';render()}
});
document.addEventListener('keydown',e=>{
  if(screen!=='game'||e.target.tagName==='INPUT')return;
  if(/^[0-9]$/.test(e.key))press(e.key);
  else if((e.key==='h'||e.key===':')&&M&&M.qs[M.i].clock&&M.phase==='ask'){M.slot='m';render()}
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
