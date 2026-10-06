"use strict";
/* Déroulement d'une mission (normale, chrono, énigme, réparation) : questions, réponses, fin de mission */

let M=null;   // mission en cours
let screen='home';

// mode : undefined (normal), 'timed' (chrono) ou 'riddle' (énigme : trouver le nombre caché)
function buildMission(lvId,mode){
  const timed=mode==='timed',riddle=mode==='riddle';
  const qs=[],seen=new Set();
  // réparation : uniquement les calculs ratés, du plus facile au plus difficile
  const bank=(timed||riddle)?[]:lvId==='review'?S.errors.slice().sort((x,y)=>lvOrder(x.lv)-lvOrder(y.lv)).slice(0,REVIEW_MAX):S.errors.filter(e=>e.lv===lvId).slice(-3);
  bank.forEach(e=>{if(!seen.has(qkey(e))){seen.add(qkey(e));qs.push({a:e.a,op:e.op,b:e.b,lv:e.lv,review:true})}});
  const gen=GEN[lvId]||GEN.mix;
  let guard=0;
  while(lvId!=='review'&&qs.length<QUESTIONS&&guard++<500){const q=gen();if(seen.has(qkey(q)))continue;seen.add(qkey(q));q.lv=lvId==='review'?'mix':lvId;qs.push(q)}
  if(riddle)qs.forEach(q=>q.hide=Math.random()<.5?'a':'b');
  if(lvId!=='review')for(let i=qs.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[qs[i],qs[j]]=[qs[j],qs[i]]}
  return {lv:lvId,qs,i:0,tries:0,input:'',pts:0,first:0,streak:0,best:0,marks:[],aid:qs[0]&&qs[0].review?'hint':false,phase:'ask',msg:'',msgCls:'',
    timed,riddle,elapsed:0,penalty:0,errs:0,tick:performance.now()};
}
function startMission(lvId,mode){M=buildMission(lvId,mode);screen='game';render()}
/* réponse attendue : le résultat, ou le nombre caché en mode énigme */
const ans=q=>q.hide==='a'?q.a:q.hide==='b'?q.b:res(q);
/* le calcul inverse qui permet de trouver le nombre caché */
function inverse(q){const r=res(q);
  if(q.hide==='a')return q.op==='+'?Q(r,'-',q.b):Q(r,'+',q.b);
  return q.op==='+'?Q(r,'-',q.a):Q(q.a,'-',r);
}
/* temps du chrono : il ne tourne que pendant qu'une question attend sa réponse */
function clockMs(){return M.elapsed+M.penalty+(M.phase==='ask'&&!M.paused?performance.now()-M.tick:0)}

function addError(q){
  if(!S.errors.some(e=>qkey(e)===qkey(q)))S.errors.push({lv:q.lv,a:q.a,op:q.op,b:q.b});
  if(S.errors.length>40)S.errors.shift();
}
function removeError(q){S.errors=S.errors.filter(e=>qkey(e)!==qkey(q))}
function stat(lv){return S.stats[lv]||(S.stats[lv]={q:0,first:0,missions:0})}
function cheer(){const c=pick(CHEERS);return S.name&&Math.random()<.35?c.replace(' !',`, ${S.name} !`):c}

function submit(){
  if(M.phase!=='ask'||!M.input)return;
  const q=M.qs[M.i],v=parseInt(M.input,10),st=stat(q.lv);
  if(M.timed){
    M.elapsed+=performance.now()-M.tick;
    if(v===res(q)){M.first++;M.streak++;M.best=Math.max(M.best,M.streak);M.marks[M.i]='ok';M.phase='good';M.msg=pick(['Vite et juste !','Bien !','Exact !','Ça file !']);M.msgCls='good';sfx.good()}
    else{M.penalty+=5000;M.errs++;M.streak=0;M.marks[M.i]='miss';M.phase='timedbad';M.msg=`+5 s · la bonne réponse était ${res(q)}`;M.msgCls='bad';sfx.bad()}
    save();render();const m=M;setTimeout(()=>{if(M===m)nextQ()},M.phase==='good'?450:1700);
    return;
  }
  if(M.tries===0&&!M.riddle)st.q++;
  if(v===ans(q)){
    if(M.tries===0){M.pts+=1;M.first++;if(!M.riddle)st.first++;M.streak++;M.best=Math.max(M.best,M.streak);M.marks[M.i]='ok';if(q.review)removeError(q)}
    else{M.pts+=.5;M.streak=0;M.marks[M.i]='half'}
    M.phase='good';
    M.msg=M.streak>=3&&M.streak%2===1?`${M.streak} bonnes réponses d'affilée, la fusée accélère !`:(M.tries?'Oui ! Tu as trouvé.':cheer());
    M.msgCls='good';sfx.good();save();render();
    const m=M;setTimeout(()=>{if(M===m)nextQ()},M.tries?1100:900);
  }else{
    M.tries++;M.streak=0;if(!M.riddle)addError(q);sfx.bad();
    if(M.tries===1){M.phase='ask';M.aid='hint';M.msg=M.riddle?'Presque ! Regarde l\'astuce et réessaie.':'Presque ! Regarde l\'indice et réessaie.';M.msgCls='bad';M.wrong=M.input;M.input=''}
    else{M.phase='solution';M.aid='solution';M.marks[M.i]='miss';M.msg='Pas grave, voici comment on fait.';M.msgCls='bad';M.wrong=M.input}
    save();render();
  }
}
function nextQ(){
  if(!M||screen!=='game')return;
  M.i++;M.tries=0;M.input='';M.phase='ask';M.aid=M.qs[M.i]&&M.qs[M.i].review?'hint':false;M.msg='';M.msgCls='';M.wrong='';M.tick=performance.now();
  if(M.i>=M.qs.length)(M.timed?finishTimed:M.riddle?finishRiddle:finish)();else render();
}
function finish(){
  const pts=M.pts,stars=pts>=9?3:pts>=7?2:pts>=5?1:0,lv=M.lv;
  const out={stars,pts,first:M.first,best:M.best,lv,n:M.qs.length,newSticker:null,unlockedNext:false};
  if(lv!=='review'){
    const L=S.levels[lv]||(S.levels[lv]={stars:0,plays:0});
    const idx=LEVELS.findIndex(l=>l.id===lv);
    const wasLocked=idx<LEVELS.length-1&&!unlocked(idx+1);
    L.plays++;if(stars>L.stars)L.stars=stars;
    stat(lv).missions++;
    if(stars>=1){const had=S.stickers[lv];const now=stars===3?'gold':'normal';if(!had||(had==='normal'&&now==='gold')){S.stickers[lv]=now;out.newSticker={idx,gold:now==='gold'}}}
    out.unlockedNext=wasLocked&&idx<LEVELS.length-1&&unlocked(idx+1);
  }
  touchDay();
  save();M.result=out;screen='result';
  const allFixed=lv==='review'&&M.first===M.qs.length;
  if(stars>=1||lv==='review')sfx.win();
  if(stars===3||allFixed)confetti();
  render();
}

function finishTimed(){
  const lv=M.lv,L=LEVELS.find(l=>l.id===lv),total=Math.round(M.elapsed+M.penalty);
  const prev=S.times[lv]||0,record=!prev||total<prev;
  if(record)S.times[lv]=total;
  const tier=total<=L.gold*1000?'gold':total<=L.silver*1000?'silver':null;
  const had=S.rockets[lv];let won=null;
  if(tier&&(!had||(had==='silver'&&tier==='gold'))){S.rockets[lv]=tier;S.ship=lv;won=tier}
  touchDay();save();
  M.result={timed:true,lv,total,prev,record,tier,won,errs:M.errs,first:M.first};screen='result';
  if(won||record)sfx.win();
  if(won)confetti();
  render();
}

function finishRiddle(){
  const lv=M.lv,pts=M.pts,R=S.riddles[lv]||(S.riddles[lv]={best:0,plays:0});
  R.plays++;const record=pts>R.best;if(record)R.best=pts;
  let won=false;
  if(pts>=RIDDLE_GOAL&&!S.pals[lv]){S.pals[lv]=true;S.pal=lv;won=true}
  touchDay();save();
  M.result={riddle:true,lv,pts,first:M.first,n:M.qs.length,won,record};screen='result';
  if(pts>=RIDDLE_GOAL)sfx.win();
  if(won)confetti();
  render();
}
