"use strict";
/* Sauvegarde de la progression (dans ce navigateur) et règles de déblocage */

const KEY='fusee-des-nombres-v1';
const fresh=()=>({v:1,name:'',sound:true,levels:{},stats:{},errors:[],stickers:{},lastDay:'',dayStreak:0,times:{},rockets:{},ship:'base',riddles:{},pals:{},pal:''});
let S=fresh();
try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&s.v===1)S=Object.assign(fresh(),s)}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}

const starsOf=id=>(S.levels[id]&&S.levels[id].stars)||0;
const unlocked=i=>i===0||starsOf(LEVELS[i-1].id)>=1;
const totalStars=()=>LEVELS.reduce((n,l)=>n+starsOf(l.id),0);
function touchDay(){const t=dayStr(new Date()),y=new Date();y.setDate(y.getDate()-1);if(S.lastDay!==t){S.dayStreak=S.lastDay===dayStr(y)?S.dayStreak+1:1;S.lastDay=t}}
const chronoOpen=id=>starsOf(id)>=1;
function currentStreak(){const t=dayStr(new Date()),y=new Date();y.setDate(y.getDate()-1);return (S.lastDay===t||S.lastDay===dayStr(y))?S.dayStreak:0}
