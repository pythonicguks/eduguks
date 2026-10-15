"use strict";
/* Logique des horloges : écriture de l'heure, vérification des réponses, explications */

const clockText=(h,m)=>m?`${h} h ${String(m).padStart(2,'0')}`:`${h} h`;
// l'heure attendue, telle qu'on l'écrit (15 h 20 l'après-midi)
const clockHour=q=>q.pm?q.h+12:q.h;
const clockAnswer=q=>clockText(clockHour(q),q.m);

// lecture : l'enfant tape les heures (hh) et les minutes (mm, vide = 0)
function clockReadOk(q,hh,mm){
  const H=+hh,Mi=mm===''?0:+mm;
  if(hh===''||Mi!==q.m)return false;
  if(q.pm===null)return H%12===q.h%12;   // 3 h ou 15 h
  return H===clockHour(q);
}
// énigme : l'enfant règle les aiguilles (set = {h:1–12, m})
const clockSetOk=(q,set)=>set.h%12===q.h%12&&set.m===q.m;
// avancer ou reculer les aiguilles ; les minutes entraînent les heures, comme sur une vraie horloge
function clockAdjust(set,minutes){
  const t=(((set.h%12)*60+set.m+minutes)%720+720)%720;
  return {h:Math.floor(t/60)||12,m:t%60};
}
// le nombre maximal d'heures qu'on peut taper pour cette question
const clockMaxHour=q=>q.pm===null?12:23;

// comment on le dit : « 3 heures et quart », « 4 heures moins le quart »
function clockSpoken(h,m){
  const hours=n=>n===12?'midi':n===1?'1 heure':`${n} heures`,next=h%12+1;
  if(m===0)return hours(h);
  if(m===15)return `${hours(h)} et quart`;
  if(m===30)return h===12?'midi et demi':`${hours(h)} et demie`;
  if(m===45)return `${hours(next)} moins le quart`;
  return '';
}

// étapes de l'indice (reveal=false) ou de la correction (reveal=true)
function clockSteps(q,reveal,setting){
  const H=q.h,next=H%12+1,steps=[];
  const small='<b style="color:'+HOUR_HAND+'">petite aiguille</b>',big='<b style="color:'+MINUTE_HAND+'">grande aiguille</b>';
  if(setting){
    steps.push(reveal?`La ${big} va sur le ${q.m?q.m/5:12} : ${q.m?`${q.m/5} × 5 = ${q.m} minutes`:'0 minute, l\'heure pile'}.`
      :`Commence par la ${big} (les minutes) : compte de 5 en 5 à partir du 12 jusqu'à ${q.m}.`);
    if(q.pm)steps.push(`${clockHour(q)} h, c'est ${H} heure${H>1?'s':''} de l'après-midi : sur l'horloge, on cherche le ${H} (${clockHour(q)} − 12 = ${H}).`);
    steps.push(reveal||!q.m?`La ${small} va sur le ${H}${q.m?`, puis avance un peu vers le ${next}`:''}.`:`Puis la ${small} (les heures) : elle a dépassé le ${H}, sans arriver au ${next}.`);
    return steps;
  }
  steps.push(reveal?(q.m?`La ${small} a dépassé le ${H} mais n'est pas encore sur le ${next} : il est ${H} heure${H>1?'s':''} et quelques minutes.`:`La ${small} est sur le ${H}.`)
    :`La ${small} montre les heures : quel nombre vient-elle de passer ?`);
  steps.push(reveal?(q.m?`La ${big} est sur le ${q.m/5} : ${q.m/5} × 5 = ${q.m} minutes.`:`La ${big} est sur le 12 : 0 minute, c'est l'heure pile.`)
    :`La ${big} montre les minutes : compte de 5 en 5 à partir du 12. Le bouton « Minutes » peut t'aider.`);
  if(q.pm===true)steps.push(reveal?`C'est l'après-midi : on ajoute 12. ${H} + 12 = ${H+12}.`:`C'est l'après-midi : après midi, on continue à compter 13, 14, 15… (on ajoute 12).`);
  if(q.pm===false)steps.push(`C'est le matin : on garde l'heure de l'horloge.`);
  if(reveal){const say=q.pm===null?clockSpoken(H,q.m):'';steps.push(`Il est <b>${clockAnswer(q)}</b>${say&&say!==clockAnswer(q)?` : on dit aussi « ${say} »`:''}.`)}
  return steps;
}
