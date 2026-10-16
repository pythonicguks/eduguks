"use strict";
/* Monde « Marché » : la monnaie (programme de CE1, plus une planète bonus pour les centimes).
   Toutes les sommes sont en centimes : 100 = 1 €, 5000 = 50 €.
   Une question d'argent : {money:true, kind, …}
   - kind 'count'  : items (pièces et billets affichés), on tape le total ;
   - kind 'pay'    : price, on pose l'argent sur le comptoir ; few : avec le moins possible ;
                     wallet (énigme) : un porte-monnaie limité, solution = indices d'une façon de payer ;
   - kind 'change' : price et paid (paidItems donnés par le client), on tape la monnaie à rendre.
   cents : la réponse s'écrit en euros et centimes. */

const BILLS=[5000,2000,1000,500],COINS=[200,100,50,20,10];
const SHOP_ITEMS=['un ballon','une trottinette','un livre','un jeu de cartes','une peluche','un puzzle','des feutres','un cerf-volant','des billes','une corde à sauter','un robot','une petite voiture','une boîte de construction','une lampe de poche','un jeu de société'];
const Mq=(kind,o)=>({money:true,kind,...o});
const someOf=(n,vals)=>Array.from({length:n},()=>pick(vals));
const total=a=>a.reduce((s,x)=>s+x,0);

Object.assign(GEN,{
  // 2 € + 2 € + 1 €
  moneyCoins(){ return Mq('count',{items:someOf(rnd(3,7),[100,200])}) },
  // 20 € + 10 € + 2 €
  moneyBills(){ let items;do{items=[...someOf(rnd(1,3),BILLS),...someOf(rnd(0,3),[100,200])]}while(total(items)>9900);return Mq('count',{items}) },
  // payer 37 €
  moneyPay(){ return Mq('pay',{price:rnd(11,99)*100,item:pick(SHOP_ITEMS)}) },
  // payer 38 € avec le moins de pièces et billets possible
  moneyFew(){ return Mq('pay',{price:rnd(11,99)*100,item:pick(SHOP_ITEMS),few:true}) },
  // 37 € payés avec 50 € : rendre 13 €
  moneyChange(){
    const price=rnd(11,95)*100,ok=[1000,2000,5000,10000].filter(p=>p>price),paid=Math.random()<.7?ok[0]:pick(ok);
    return Mq('change',{price,paid,paidItems:paid===10000?[5000,5000]:[paid],item:pick(SHOP_ITEMS)});
  },
  // 2 € + 50 c + 20 c = 2 € 70 (au moins 1 €, moins de 10 €)
  moneyCents(){ let items;do{items=[...someOf(rnd(1,3),[100,200]),...someOf(rnd(2,5),[50,20,10])]}while(total(items)>=1000||total(items)%100===0);return Mq('count',{items,cents:true}) },
});

// denoms : l'argent disponible dans le porte-monnaie de la planète (paiement et énigmes)
LEVELS.push(
  {id:'moneyCoins', world:'money',name:'Pièçopolis',skill:'Compter les pièces',  ex:'2 € + 2 € + 1 €', c1:'#fff0b3',c2:'#c99a1d',silver:60, gold:35,denoms:[200,100]},
  {id:'moneyBills', world:'money',name:'Billetia',  skill:'Avec les billets',    ex:'20 € + 10 € + 2 €',c1:'#d4e6ff',c2:'#3f73c4',silver:80, gold:50,denoms:[5000,2000,1000,500,200,100],ring:true},
  {id:'moneyPay',   world:'money',name:'Caissa',    skill:'Payer le prix exact', ex:'payer 37 €',      c1:'#ffd9cf',c2:'#d9573b',silver:120,gold:80,denoms:[5000,2000,1000,500,200,100]},
  {id:'moneyFew',   world:'money',name:'Économia',  skill:'Le moins possible',   ex:'38 € = 20+10+5+2+1',c1:'#d8f5d0',c2:'#3f9a35',silver:130,gold:90,denoms:[5000,2000,1000,500,200,100]},
  {id:'moneyChange',world:'money',name:'Rendus',    skill:'Rendre la monnaie',   ex:'50 € − 37 €',     c1:'#ecd9ff',c2:'#8a4fd0',silver:100,gold:65,denoms:[5000,2000,1000,500,200,100],ring:true},
  {id:'moneyCents', world:'money',name:'Centimia',  skill:'Bonus : les centimes',ex:'2 € 70',          c1:'#ffe0c2',c2:'#c76a1c',silver:100,gold:65,denoms:[200,100,50,20,10]},
);
