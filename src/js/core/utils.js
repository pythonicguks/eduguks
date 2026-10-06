"use strict";
/* Petits outils partagés : hasard, calculs, formats, échappement HTML */

const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const Q=(a,op,b)=>({a,op,b});
const res=q=>q.op==='+'?q.a+q.b:q.a-q.b;
const sign=op=>op==='+'?'+':'−';
const qkey=q=>q.a+q.op+q.b;
const dayStr=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const fmt=ms=>(Math.floor(ms/100)/10).toFixed(1).replace('.',',')+' s';
const fmtPts=p=>String(p).replace('.',',');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
