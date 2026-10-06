"use strict";
/* Écran de jeu */

function viewGame(){
  const L=M.lv==='review'?{name:'Réparation',c1:'#cdeeff',c2:'#3b7fd1'}:LEVELS.find(l=>l.id===M.lv);
  const q=M.qs[M.i];
  const N=M.qs.length;
  let dots='';for(let i=0;i<N;i++)dots+=`<span class="dot ${M.marks[i]||''}"></span>`;
  const pos=N>1?(M.i/(N-1))*100:0;
  const ansCls=M.phase==='good'?'good':(M.phase==='solution'||M.phase==='timedbad'||(M.msgCls==='bad'&&!M.input))?'bad':'';
  const shown=(M.phase==='solution'||M.phase==='timedbad')?ans(q):(M.input||'?');
  const box=`<span class="answer ${shown==='?'?'empty':''} ${ansCls}">${shown}</span>`;
  let h=`<div class="bar gamebar"><button class="iconbtn" data-nav="home" aria-label="Retour à la carte">← Carte</button><div class="grow"></div>
    <span class="chip" style="--c1:${L.c1}">${M.timed?'Chrono · ':M.riddle?'Énigme · ':''}${esc(L.name)}</span>
    <button class="iconbtn" data-act="sound" aria-label="${S.sound?'Couper le son':'Activer le son'}" aria-pressed="${S.sound}">${S.sound?'<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>':'<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 9l6 6M22 9l-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'}</button></div>
  <div class="track" style="--c1:${L.c1};--c2:${L.c2}" aria-label="Question ${M.i+1} sur ${N}"><span class="rail"></span><span class="dots">${dots}</span><span class="ship" style="left:${pos}%">${myShip()}</span><span class="goal"></span></div>
  <section class="qcard ${M.aid?'compact':''}">
    ${M.timed?`<span class="clock" id="clock" aria-hidden="true">${fmt(clockMs())}</span><span class="goals">Calcul ${M.i+1} sur ${N} · fusée argent : ${L.silver} s · or : ${L.gold} s</span>`
      :M.riddle?`<span class="qcount">Énigme ${M.i+1} sur ${N} · trouve le nombre caché</span>`
      :`<span class="qcount">Calcul ${M.i+1} sur ${N}${q.review?' · à réparer':''}</span>`}
    <div class="calc" aria-live="polite">${q.hide==='a'?box:`<span>${q.a}</span>`}<span class="op">${sign(q.op)}</span>${q.hide==='b'?box:`<span>${q.b}</span>`}<span class="op">=</span>${q.hide?`<span>${res(q)}</span>`:box}</div>
    <div class="msg ${M.msgCls}" role="status">${esc(M.msg)}</div>
  </section>`;
  if(M.phase==='ask'&&M.riddle)h+=`<div class="tools"><button class="toolbtn" data-act="cols" aria-pressed="${M.aid==='hint'}">Une astuce</button></div>`;
  else if(M.phase==='ask'&&!M.timed)h+=`<div class="tools"><button class="toolbtn" data-act="blocks" aria-pressed="${M.aid==='blocks'}">Voir les cubes</button><button class="toolbtn" data-act="cols" aria-pressed="${M.aid==='hint'}">Poser le calcul</button></div>`;
  if(M.aid==='blocks'){
    h+=`<div class="aid"><div class="blocks">${blocks(q.a)}<span class="bigop">${sign(q.op)}</span>${blocks(q.b,q.op==='-'?'à enlever':'')}</div>
      <span class="legend">Une barre bleue = 1 dizaine (10). Un cube jaune = 1 unité.</span></div>`;
  }else if(M.riddle&&(M.aid==='hint'||M.aid==='solution')){
    const inv=inverse(q),c=column(inv,M.aid==='solution'),x=ans(q);
    const tip=`<li><b>Astuce :</b> le nombre caché se trouve avec le calcul inverse : <b>${inv.a} ${sign(inv.op)} ${inv.b}</b>.</li>`;
    const check=M.aid==='solution'?`<li>Vérifie : ${q.hide==='a'?`<b>${x}</b>`:q.a} ${sign(q.op)} ${q.hide==='b'?`<b>${x}</b>`:q.b} = ${res(q)} ✓</li>`:'';
    h+=`<div class="aid cols"><div class="col" aria-hidden="true">${c.grid}</div><div class="explain"><ol class="steps">${tip}${c.steps.map(s=>`<li>${s}</li>`).join('')}${check}</ol>
      ${M.aid==='solution'&&M.wrong?`<span class="legend">Tu avais répondu ${esc(M.wrong)}.</span>`:''}</div></div>`;
  }else if(M.aid==='hint'||M.aid==='solution'){
    const c=column(q,M.aid==='solution');
    h+=`<div class="aid cols"><div class="col" aria-hidden="true">${c.grid}</div><div class="explain"><ol class="steps">${c.steps.map(s=>`<li>${s}</li>`).join('')}</ol>
      ${M.aid==='solution'&&M.wrong?`<span class="legend">Tu avais répondu ${esc(M.wrong)}. Ce calcul reviendra dans une prochaine mission.</span>`:''}</div></div>`;
  }
  if(M.phase==='solution')h+=`<div class="dock"><button class="next" data-act="next">J'ai compris, calcul suivant →</button></div>`;
  else{
    h+=`<div class="dock"><div class="pad">`;
    [1,2,3,4,5,6,7,8,9].forEach(n=>h+=`<button class="key" data-key="${n}">${n}</button>`);
    h+=`<button class="key del" data-key="del" aria-label="Effacer">⌫</button><button class="key" data-key="0">0</button><button class="key ok" data-key="ok" aria-label="Valider" ${M.input&&M.phase==='ask'?'':'disabled'}>✓</button></div></div>`;
  }
  return h;
}
