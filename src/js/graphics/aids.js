"use strict";
/* Aides pédagogiques : cubes (dizaines, unités) et calcul posé en colonnes avec ses étapes */

/* aide visuelle : barres de dizaines et cubes d'unités */
function blocks(n,label){
  const t=Math.floor(n/10),u=n%10;
  let h=`<div class="grp"><div class="cubes">`;
  for(let i=0;i<t;i++)h+=`<span class="ten"></span>`;
  if(u){h+=`<span class="units">`;for(let i=0;i<u;i++)h+=`<span class="one"></span>`;h+=`</span>`}
  h+=`</div><div class="lbl"><b>${n}</b><br>${t} dizaine${t>1?'s':''}, ${u} unité${u>1?'s':''}${label?'<br>'+label:''}</div></div>`;
  return h;
}

/* calcul posé en colonnes + étapes ; reveal=false : indice, reveal=true : correction */
function column(q,reveal){
  const ta=Math.floor(q.a/10),ua=q.a%10,tb=Math.floor(q.b/10),ub=q.b%10,r=res(q),tr=Math.floor(r/10),ur=r%10;
  const add=q.op==='+',carry=add&&ua+ub>=10,borrow=!add&&ua<ub;
  const cell=(c,cls)=>`<span class="${cls||''}">${c}</span>`;
  let g='';
  // ligne des retenues / échanges
  g+=cell('')+cell(carry?'1':borrow?String(ta-1):'','carry')+cell('');
  g+=cell('')+cell(ta||'',borrow?'x tens':'tens')+cell(borrow?`<sup>1</sup>${ua}`:ua);
  g+=cell(sign(q.op),'tens')+cell(tb||'','tens')+cell(ub);
  g+=`<span class="rule"></span>`;
  g+=cell('')+cell(reveal?(tr||(r<10?'':'0')):'?','res')+cell(reveal?ur:'?','res');
  const S=[];
  if(ua===0&&ub===0){
    S.push(`Pense en dizaines : ${ta} dizaine${ta>1?'s':''} ${add?'+':'−'} ${tb} dizaine${tb>1?'s':''} = ${reveal?tr+' dizaine'+(tr>1?'s':''):'?'}.`);
    if(reveal)S.push(`Donc ${q.a} ${sign(q.op)} ${q.b} = <b>${r}</b>.`);
    return {grid:g,steps:S};
  }
  if(add){
    const su=ua+ub;
    if(reveal){
      S.push(carry?`Unités : ${ua} + ${ub} = ${su}. J'écris ${su-10} et je retiens 1 dizaine.`:`Unités : ${ua} + ${ub} = ${su}.`);
      S.push(tb?`Dizaines : ${ta} + ${tb}${carry?' + 1 (la retenue)':''} = ${tr}.`:(carry?`Dizaines : ${ta} + 1 (la retenue) = ${tr}.`:`Dizaines : le ${ta} descend.`));
      S.push(`Résultat : <b>${r}</b>.`);
    }else{
      S.push(`Commence par les unités : ${ua} + ${ub}.`);
      if(carry)S.push(`Tu trouves 10 ou plus ? Garde 1 dizaine en retenue, en haut.`);
      S.push(tb?`Puis les dizaines : ${ta} + ${tb}${carry?' + la retenue':''}.`:(carry?`Puis les dizaines : ${ta} + la retenue.`:`Les dizaines ne changent pas.`));
    }
  }else{
    if(reveal){
      S.push(borrow?`Unités : ${ua} − ${ub}, c'est trop petit ! J'échange 1 dizaine contre 10 unités : ${ua+10} − ${ub} = ${ua+10-ub}.`:`Unités : ${ua} − ${ub} = ${ua-ub}.`);
      const tt=borrow?ta-1:ta;
      S.push(borrow?`Il reste ${tt} dizaine${tt>1?'s':''}. ${tb?`${tt} − ${tb} = ${tr}.`:''}`:(tb?`Dizaines : ${ta} − ${tb} = ${tr}.`:`Dizaines : le ${ta} descend.`));
      S.push(`Résultat : <b>${r}</b>.`);
    }else{
      S.push(`Commence par les unités : ${ua} − ${ub}.`);
      if(borrow)S.push(`${ua} est plus petit que ${ub} ! Échange 1 dizaine contre 10 unités : tu calcules ${ua+10} − ${ub}.`);
      S.push(borrow?`Il ne reste plus que ${ta-1} dizaine${ta-1>1?'s':''}${tb?` : calcule ${ta-1} − ${tb}`:''}.`:(tb?`Puis les dizaines : ${ta} − ${tb}.`:`Les dizaines ne changent pas.`));
    }
  }
  return {grid:g,steps:S};
}
