"use strict";
/* Écran de jeu, questions d'argent : compter, payer, rendre la monnaie */

function moneyBody(q,L,N){
  const solved=M.phase==='solution'||M.phase==='timedbad',pay=q.kind==='pay';
  const cls=M.phase==='good'?'good':(solved||(M.msgCls==='bad'&&!M.input&&!M.hh&&!pay))?'bad':'';
  const label={count:'Compte l\'argent',pay:'Paie le prix',change:'Rends la monnaie'}[q.kind];
  const btn=(act,txt,on)=>`<button class="toolbtn" data-act="${act}" aria-pressed="${!!on}">${txt}</button>`;
  let h=`<section class="qcard moneycard ${M.aid?'compact':''}">`;
  h+=M.timed?`<span class="clock" id="clock" aria-hidden="true">${fmt(clockMs())}</span><span class="goals">Question ${M.i+1} sur ${N} · fusée argent : ${L.silver} s · or : ${L.gold} s</span>`
    :`<span class="qcount">${label} · ${M.i+1} sur ${N}</span>`;
  let tools='';
  if(q.kind==='count'){
    const items=M.sorted?q.items.slice().sort((a,b)=>b-a):q.items;
    h+=`<div class="tray">${items.map(v=>`<span class="money">${moneySVG(v)}</span>`).join('')}</div>`;
    h+=`<div class="calc moneyans" aria-live="polite"><span class="ask">Total :</span>${typedAnswer(q,solved,cls)}</div>`;
    tools=btn('sort','Ranger',M.sorted)+btn('cols','Indice',M.aid==='hint');
  }else if(q.kind==='change'){
    h+=`<div class="deal">Prix de ${esc(q.item)} : <b>${fmtEur(q.price)}</b></div>
      <div class="deal">Le client donne :</div><div class="tray">${q.paidItems.map(v=>`<span class="money">${moneySVG(v)}</span>`).join('')}</div>
      <div class="calc moneyans" aria-live="polite"><span class="ask">Je rends :</span>${typedAnswer(q,solved,cls)}</div>`;
    tools=btn('cols','Indice',M.aid==='hint');
  }else{
    const counter=solved?moneySolution(q):M.counter,sum=total(counter.map(c=>c.v));
    h+=`<div class="deal">Pour ${esc(q.item)}, paie <b>${fmtEur(q.price)}</b>${q.few&&!q.wallet?'<br><span class="few">avec le moins de pièces et billets possible</span>':''}</div>
      <div class="counter ${cls}" aria-label="Le comptoir">${counter.length?counter.map((c,i)=>`<button class="money" data-unpay="${i}" ${M.phase==='ask'?'':'disabled'} aria-label="Reprendre ${moneyLabel(c.v)}">${moneySVG(c.v,.7)}</button>`).join('')
        :`<span class="empty-note">Touche l'argent du porte-monnaie pour le poser ici.</span>`}</div>
      ${M.tally||solved?`<span class="tally">Sur le comptoir : ${fmtEur(sum)}</span>`:''}`;
    tools=btn('tally','Compter pour moi',M.tally)+btn('cols','Indice',M.aid==='hint');
  }
  if(M.phase==='ask'&&!M.timed)h+=`<div class="tools">${tools}</div>`;
  h+=`<div class="msg ${M.msgCls}" role="status">${esc(M.msg)}</div></section>`;
  if(M.aid==='hint'||M.aid==='solution'){
    h+=`<div class="aid"><ol class="steps">${moneySteps(q,M.aid==='solution').map(s=>`<li>${s}</li>`).join('')}</ol>
      ${M.aid==='solution'&&M.wrong?`<span class="legend">Tu avais ${pay?'posé':'répondu'} ${esc(M.wrong)}.</span>`:''}</div>`;
  }
  if(M.phase==='solution')return h+nextButton();
  return h+(pay?walletPad(q):keypad());
}

// la réponse tapée : en euros (une case) ou en euros et centimes (deux cases)
function typedAnswer(q,solved,cls){
  const v=moneyValue(q);
  if(!q.cents){const shown=solved?String(v/100):M.input;return `<span class="answer ${shown===''?'empty':''} ${cls}">${shown||'?'}</span><span class="op">€</span>`}
  const e=solved?String(Math.floor(v/100)):M.hh,c=solved?String(v%100).padStart(2,'0'):M.mm;
  return slotBox('h',e,'?',cls,'Les euros')+`<span class="op">€</span>`+slotBox('m',c,'??',cls,'Les centimes');
}

// le porte-monnaie : toutes les pièces et billets de la planète, ou (énigme) un porte-monnaie limité
function walletPad(q){
  const L=LEVELS.find(l=>l.id===q.lv),dis=M.phase==='ask'?'':'disabled';
  const used=new Set(M.counter.map(c=>c.w));
  const keys=q.wallet?q.wallet.map((v,i)=>`<button class="key" data-pick="${i}" ${used.has(i)||dis?'disabled':''} aria-label="${moneyLabel(v)}">${moneySVG(v,.75)}</button>`)
    :L.denoms.map(v=>`<button class="key" data-pay="${v}" ${dis} aria-label="${moneyLabel(v)}">${moneySVG(v,.75)}</button>`);
  return `<div class="dock">${q.wallet?'<div class="wallet-title">Ton porte-monnaie</div>':''}<div class="wallet ${q.wallet?'limited':''}">${keys.join('')}</div>
    <div class="wallet-actions"><button class="key" data-act="clear" ${dis} aria-label="Tout reprendre">Reprendre</button><button class="key ok" data-key="ok" ${M.counter.length&&!dis?'':'disabled'}>✓ Valider</button></div></div>`;
}
