"use strict";
/* Logique de la monnaie : écriture des sommes, vérification des réponses, explications, énigmes */

const DENOMS=[...BILLS,...COINS];
// 3700 → « 37 € », 270 → « 2 € 70 », 50 → « 50 c »
const fmtEur=c=>c<100?`${c} c`:c%100?`${Math.floor(c/100)} € ${String(c%100).padStart(2,'0')}`:`${c/100} €`;
const moneyLabel=v=>v<100?`${v} c`:`${v/100} €`;
// rendu de monnaie « glouton » : toujours le plus grand possible. Avec les euros, c'est aussi le moins de pièces possible.
function greedy(amount,denoms=DENOMS){const out=[];for(const d of denoms)while(amount>=d){out.push(d);amount-=d}return out}

// la somme attendue
const moneyValue=q=>q.kind==='count'?total(q.items):q.kind==='change'?q.paid-q.price:q.price;
// réponse tapée : en euros (input) ou en euros et centimes (hh, mm)
const moneyTyped=(q,input,hh,mm)=>q.cents?(+hh)*100+(mm===''?0:+mm):(+input)*100;
const moneyTypedOk=(q,input,hh,mm)=>(q.cents?hh!=='':input!=='')&&moneyTyped(q,input,hh,mm)===moneyValue(q);
// paiement : le bon total ; « le moins possible » : autant de pièces et billets que le rendu glouton
function moneyPayOk(q,counter){
  const vals=counter.map(c=>c.v);
  if(total(vals)!==q.price)return false;
  return !(q.few&&!q.wallet)||vals.length===greedy(q.price).length;
}
// une façon correcte de payer (affichée dans la correction)
const moneySolution=q=>q.wallet?q.solution.map(w=>({v:q.wallet[w],w})):greedy(q.price).map(v=>({v,w:-1}));

// énigme : un porte-monnaie limité ; on choisit d'abord une façon de payer, puis on en déduit le prix
function moneyPuzzle(L){
  for(;;){
    const wallet=someOf(rnd(5,7),L.denoms).sort((a,b)=>b-a);
    const idx=wallet.map((_,i)=>i).sort(()=>Math.random()-.5).slice(0,rnd(2,wallet.length-1)).sort((a,b)=>a-b);
    const price=total(idx.map(i=>wallet[i]));
    if(price<=9900&&price>=200&&!wallet.includes(price))return Mq('pay',{price,wallet,solution:idx,item:pick(SHOP_ITEMS)});
  }
}

// étapes de l'indice (reveal=false) ou de la correction (reveal=true)
function moneySteps(q,reveal){
  const S=[];
  if(q.kind==='count'){
    const sorted=q.items.slice().sort((a,b)=>b-a);
    if(q.cents)S.push('1 € = 100 centimes. Compte d\'abord les euros, puis les centimes.');
    if(!reveal){S.push('Range l\'argent du plus grand au plus petit : les billets d\'abord, puis les pièces.');S.push(`Additionne petit à petit : ${sorted.map(moneyLabel).join(' + ')}.`);return S}
    let run=0;const steps=sorted.map(v=>fmtEur(run+=v));
    S.push(`On range : ${sorted.map(moneyLabel).join(' + ')}.`);
    S.push(`On compte : ${steps.join(' → ')}.`);
    S.push(`Il y a <b>${fmtEur(run)}</b>.`);
    return S;
  }
  if(q.kind==='change'){
    const next=Math.ceil(q.price/1000)*1000,jumps=[];
    if(next>q.price&&next<q.paid)jumps.push([q.price,next]);
    jumps.push([jumps.length?next:q.price,q.paid]);
    if(!reveal){S.push(`Compte à partir du prix jusqu'à ${fmtEur(q.paid)} : ${fmtEur(q.price)} → ${jumps.length>1?fmtEur(next)+' → ':''}${fmtEur(q.paid)}.`);S.push('Ce que tu as ajouté, c\'est la monnaie à rendre.');return S}
    jumps.forEach(([a,b])=>S.push(`De ${fmtEur(a)} à ${fmtEur(b)} : ${fmtEur(b-a)}.`));
    const back=q.paid-q.price;
    S.push(`Je rends ${jumps.length>1?jumps.map(([a,b])=>fmtEur(b-a)).join(' + ')+' = ':''}<b>${fmtEur(back)}</b>.`);
    S.push(`Vérifie : ${fmtEur(q.price)} + ${fmtEur(back)} = ${fmtEur(q.paid)} ✓`);
    return S;
  }
  const sol=moneySolution(q).map(c=>c.v);
  if(!reveal){
    S.push(q.wallet?`Commence par le plus gros billet ou la plus grosse pièce du porte-monnaie qui ne dépasse pas ${fmtEur(q.price)}.`
      :`Prends le plus gros billet ou la plus grosse pièce qui ne dépasse pas ${fmtEur(q.price)}, puis recommence avec ce qui reste.`);
    if(q.few&&!q.wallet)S.push('Pour utiliser le moins possible, prends toujours le plus gros possible.');
    S.push('Le bouton « Compter pour moi » affiche ce qu\'il y a sur le comptoir.');
    return S;
  }
  S.push(`<b>${fmtEur(q.price)}</b> = ${sol.map(moneyLabel).join(' + ')}${q.few&&!q.wallet?` : ${sol.length} pièces et billets, c'est le moins possible`:''}.`);
  return S;
}
