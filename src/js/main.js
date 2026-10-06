"use strict";
/* Démarrage et interactions (clavier, boutons, chrono) */

function press(k){
  if(screen!=='game'||!M)return;
  if(M.phase==='solution'){if(k==='ok')nextQ();return}
  if(M.phase!=='ask')return;
  if(k==='del')M.input=M.input.slice(0,-1);
  else if(k==='ok'){submit();return}
  else if(M.input.length<2)M.input=(M.input==='0'?'':M.input)+k;
  if(M.msgCls==='bad'&&M.input)M.msg='';
  sfx.key();render();
}

app.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.key){press(b.dataset.key);return}
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
  else if(a==='next')nextQ();
  else if(a==='savename'){S.name=(document.getElementById('kidname').value||'').trim().slice(0,20);save();b.textContent='Enregistré ✓'}
  else if(a==='reset'){confirmReset=true;render()}
  else if(a==='reset-no'){confirmReset=false;render()}
  else if(a==='reset-yes'){const keep=S.sound;S=fresh();S.sound=keep;save();confirmReset=false;screen='home';render()}
});
document.addEventListener('keydown',e=>{
  if(screen!=='game'||e.target.tagName==='INPUT')return;
  if(/^[0-9]$/.test(e.key))press(e.key);
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
