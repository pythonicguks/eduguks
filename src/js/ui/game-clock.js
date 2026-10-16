"use strict";
/* Écran de jeu, questions d'horloge : lire l'heure (mode normal et chrono) ou régler les aiguilles (énigme) */

const SUN=`<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5" fill="currentColor"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4M4.2 4.2l2.8 2.8M17 17l2.8 2.8M4.2 19.8 7 17M17 7l2.8-2.8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;

function clockBody(q,L,N){
  const setting=M.riddle,solved=M.phase==='solution'||M.phase==='timedbad';
  const cls=M.phase==='good'?'good':(solved||(M.msgCls==='bad'&&!M.hh&&!setting))?'bad':'';
  const tools=`<div class="tools"><button class="toolbtn" data-act="ring" aria-pressed="${M.ring}" aria-label="Voir les minutes autour de l'horloge">Minutes</button><button class="toolbtn" data-act="cols" aria-pressed="${M.aid==='hint'}">Indice</button></div>`;
  let h=`<section class="qcard clockcard ${M.aid?'compact':''}">`;
  h+=M.timed?`<span class="clock" id="clock" aria-hidden="true">${fmt(clockMs())}</span><span class="goals">Horloge ${M.i+1} sur ${N} · fusée argent : ${L.silver} s · or : ${L.gold} s</span>`
    :`<span class="qcount">Horloge ${M.i+1} sur ${N} · ${setting?'règle les aiguilles':'quelle heure est-il ?'}</span>`;
  if(setting){
    h+=`<div class="clockwrap">${clockSVG(M.set.h,M.set.m,{ring:M.ring})}</div>
      <div class="side"><span class="ask">Mets l'horloge à</span><span class="settarget ${cls}">${clockAnswer(q)}</span>${M.phase==='ask'?tools:''}</div>`;
  }else{
    const hh=solved?String(clockHour(q)):M.hh,mm=solved?String(q.m).padStart(2,'0'):M.mm;
    const when=q.pm===null?'':`<span class="when ${q.pm?'pm':'am'}">${SUN} ${q.pm?'Après-midi':'Matin'}</span>`;
    h+=`<div class="clockwrap">${clockSVG(q.h,q.m,{ring:M.ring})}</div>
      <div class="side">${when}<span class="ask">Il est :</span><div class="calc timeans" aria-live="polite">${slotBox('h',hh,'?',cls,'Les heures')}<span class="op">h</span>${slotBox('m',mm,'??',cls,'Les minutes')}</div>${M.phase==='ask'&&!M.timed?tools:''}</div>`;
  }
  h+=`<div class="msg ${M.msgCls}" role="status">${esc(M.msg)}</div></section>`;
  if(M.aid==='hint'||M.aid==='solution'){
    h+=`<div class="aid"><ol class="steps">${clockSteps(q,M.aid==='solution',setting).map(s=>`<li>${s}</li>`).join('')}</ol>
      ${M.aid==='solution'&&M.wrong?`<span class="legend">Tu avais ${setting?'réglé':'répondu'} ${esc(M.wrong)}.</span>`:''}</div>`;
  }
  if(M.phase==='solution')return h+nextButton();
  return h+(setting?setPad(L):keypad());
}

// boutons pour régler les aiguilles ; le pas des minutes dépend de la planète
function setPad(L){
  const st=L.step,dis=M.phase==='ask'?'':'disabled';
  return `<div class="dock"><div class="setpad">
    <button class="key adj" data-adj="-60" ${dis}>− 1 h</button><button class="key adj" data-adj="60" ${dis}>+ 1 h</button>
    ${st<60?`<button class="key adj" data-adj="-${st}" ${dis}>− ${st} min</button><button class="key adj" data-adj="${st}" ${dis}>+ ${st} min</button>`:''}
    <button class="key ok wide" data-key="ok" ${dis}>✓ Valider</button></div></div>`;
}
