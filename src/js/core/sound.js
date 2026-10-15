"use strict";
/* Sons (joués après un premier toucher) */

let actx=null;
function tone(freqs,dur,type){
  if(!S.sound)return;
  try{
    actx=actx||new (window.AudioContext||window.webkitAudioContext)();
    freqs.forEach((f,i)=>{const o=actx.createOscillator(),g=actx.createGain(),t=actx.currentTime+i*dur;
      o.type=type||'sine';o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.18,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
      o.connect(g);g.connect(actx.destination);o.start(t);o.stop(t+dur+.05)});
  }catch(e){}
}
const sfx={good:()=>tone([660,880],.11),bad:()=>tone([220,180],.16,'triangle'),win:()=>tone([523,659,784,1047],.13),key:()=>tone([440],.04)};
