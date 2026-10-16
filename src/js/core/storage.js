"use strict";
/* Sauvegarde de la progression (dans ce navigateur), joueurs et règles de déblocage.
   Chaque joueur a sa propre sauvegarde ; la liste des joueurs dit lequel joue. */

const KEY='fusee-des-nombres-v1';                 // ancienne sauvegarde unique : reprise comme premier joueur
const PLAYERS_KEY='fusee-des-nombres-joueurs';
const playerKey=id=>`fusee-des-nombres-joueur-${id}`;
const MAX_PLAYERS=8;
const MAGIC_NAME='GVDM';                          // ce prénom ouvre toutes les planètes, avec tous les compagnons et les fusées

const fresh=()=>({v:1,name:'',sound:true,levels:{},stats:{},errors:[],stickers:{},lastDay:'',dayStreak:0,times:{},rockets:{},ship:'base',riddles:{},pals:{},pal:'',world:'calc',magic:false});
let S=fresh();
let P={current:'',list:[]};                       // joueurs : {id, name}

const store={
  get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},
  remove(k){try{localStorage.removeItem(k)}catch(e){}},
};
function loadState(id){const s=store.get(playerKey(id));return s&&s.v===1?Object.assign(fresh(),s):fresh()}
function save(){store.set(playerKey(P.current),S)}
const savePlayers=()=>store.set(PLAYERS_KEY,P);
const newId=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);

function loadPlayers(){
  const saved=store.get(PLAYERS_KEY);
  if(saved&&saved.list&&saved.list.length){P=saved;if(!P.list.some(p=>p.id===P.current))P.current=P.list[0].id}
  else{
    // première ouverture : l'ancienne sauvegarde devient le premier joueur
    const old=store.get(KEY),id=newId();
    P={current:id,list:[{id,name:old&&old.v===1&&old.name||''}]};
    if(old&&old.v===1)store.set(playerKey(id),old);
    savePlayers();
  }
  S=loadState(P.current);
}
function switchPlayer(id){
  if(!P.list.some(p=>p.id===id))return;
  save();P.current=id;savePlayers();S=loadState(id);
}
function addPlayer(name){
  if(P.list.length>=MAX_PLAYERS)return;
  const id=newId();P.list.push({id,name:''});
  switchPlayer(id);setPlayerName(name);
}
function deletePlayer(id){
  store.remove(playerKey(id));
  P.list=P.list.filter(p=>p.id!==id);
  if(!P.list.length){const nid=newId();P.list.push({id:nid,name:''})}
  if(P.current===id){P.current=P.list[0].id;S=loadState(P.current)}
  savePlayers();
}
function setPlayerName(name){
  S.name=String(name||'').trim().slice(0,20);
  const p=P.list.find(p=>p.id===P.current);if(p)p.name=S.name;
  applyMagic();save();savePlayers();
}
// le prénom magique : toutes les planètes ouvertes, tous les compagnons, toutes les fusées dorées
function applyMagic(){
  if(S.name.toUpperCase()!==MAGIC_NAME)return;
  S.magic=true;
  LEVELS.forEach(l=>{S.pals[l.id]=true;S.rockets[l.id]='gold'});
  if(!S.pal)S.pal=LEVELS[0].id;
}
// résumé d'un joueur pour l'écran « Qui joue ? »
function playerSummary(id){
  const s=id===P.current?S:loadState(id);
  return {stars:LEVELS.reduce((n,l)=>n+((s.levels[l.id]&&s.levels[l.id].stars)||0),0),pal:s.pals[s.pal]?s.pal:'',magic:s.magic};
}
loadPlayers();

const starsOf=id=>(S.levels[id]&&S.levels[id].stars)||0;
// la première planète de chaque monde est ouverte ; les suivantes demandent 1 étoile sur la précédente
const unlocked=i=>S.magic||i===0||worldOf(LEVELS[i-1])!==worldOf(LEVELS[i])||starsOf(LEVELS[i-1].id)>=1;
const totalStars=()=>LEVELS.reduce((n,l)=>n+starsOf(l.id),0);
function touchDay(){const t=dayStr(new Date()),y=new Date();y.setDate(y.getDate()-1);if(S.lastDay!==t){S.dayStreak=S.lastDay===dayStr(y)?S.dayStreak+1:1;S.lastDay=t}}
const chronoOpen=id=>S.magic||starsOf(id)>=1;
function currentStreak(){const t=dayStr(new Date()),y=new Date();y.setDate(y.getDate()-1);return (S.lastDay===t||S.lastDay===dayStr(y))?S.dayStreak:0}
