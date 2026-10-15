"use strict";
/* Série « Horloges » : lire l'heure sur une horloge à aiguilles (programme de CE1).
   Une question d'horloge : {clock:true, h:1–12, m:0–55, pm:null|false|true}
   pm=null : l'heure du matin ou de l'après-midi est acceptée (3 h ou 15 h) ;
   pm=false : le matin (3 h) ; pm=true : l'après-midi (15 h). */

const T=(h,m,pm=null)=>({clock:true,h,m,pm});

Object.assign(GEN,{
  // 3 h
  clockHours(){ return T(rnd(1,12),0) },
  // 3 h 30, avec quelques heures pile
  clockHalf(){ return T(rnd(1,12),Math.random()<.75?30:0) },
  // 3 h 15, 3 h 45, avec quelques demies
  clockQuarter(){ return T(rnd(1,12),pick([15,45,15,45,30])) },
  // 3 h 25
  clockFive(){ return T(rnd(1,12),rnd(0,11)*5) },
  // 9 h 10 le matin, 15 h 20 l'après-midi
  clockDay(){ return Math.random()<.4?T(rnd(6,11),rnd(0,11)*5,false):T(rnd(1,7),rnd(0,11)*5,true) },
});

// step : pas des boutons de minutes en mode énigme (60 = pas de bouton de minutes)
LEVELS.push(
  {id:'clockHours',  world:'clock',name:'Tic',      skill:'Les heures pile',     ex:'3 h',            c1:'#ffe3b8',c2:'#d9822b',silver:60, gold:35,step:60},
  {id:'clockHalf',   world:'clock',name:'Tac',      skill:'Les heures et demie', ex:'3 h 30',         c1:'#cdf3e4',c2:'#1f9e74',silver:70, gold:40,step:30,ring:true},
  {id:'clockQuarter',world:'clock',name:'Quartzia', skill:'Les quarts d\'heure', ex:'3 h 15 · 3 h 45',c1:'#d6e4ff',c2:'#3b6fd8',silver:80, gold:50,step:15},
  {id:'clockFive',   world:'clock',name:'Pendula',  skill:'De 5 en 5 minutes',   ex:'3 h 25',         c1:'#ffd6e7',c2:'#c2417a',silver:100,gold:65,step:5},
  {id:'clockDay',    world:'clock',name:'Solaria',  skill:'Matin ou après-midi', ex:'15 h 20',        c1:'#fff1a8',c2:'#e0a100',silver:120,gold:80,step:5,ring:true},
);
