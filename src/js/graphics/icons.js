"use strict";
/* Icônes : cadenas, étoiles */

const LOCK=`<svg width="28" height="32" viewBox="0 0 28 32" aria-hidden="true"><path d="M7 14 V9 a7 7 0 0 1 14 0 V14" stroke="var(--ink)" stroke-width="4" fill="none"/><rect x="2" y="13" width="24" height="18" rx="4" fill="var(--ink)"/></svg>`;
const STAR=(on)=>`<svg viewBox="0 0 24 24" class="${on?'on':''}" aria-hidden="true"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 21l1.6-7L2 9.2l7.1-.6z" fill="${on?'var(--star)':'var(--line)'}"/></svg>`;
const starsTxt=n=>`<span class="stars" aria-label="${n} étoile${n>1?'s':''} sur 3">${[0,1,2].map(i=>`<span class="${i<n?'on':''}">★</span>`).join('')}</span>`;
