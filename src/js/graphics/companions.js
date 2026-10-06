"use strict";
/* Compagnons (gagnés en mode énigme) */

/* compagnons : dessins simplifiés, un par planète (gagné en mode énigme) */
const EYE=(x,y,rx,ry,c)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}"/><circle cx="${x+rx*.3}" cy="${y-ry*.35}" r="${rx*.38}" fill="#fff" stroke="none"/>`;
const PALS={
  tens:{name:'Pikachu',cry:'Pika pika !',art:`<path d="M66 72 L82 60 L76 56 L90 40 L78 36 L92 16 L68 38 L74 42 L62 54 Z" fill="#f8d030"/>
    <path d="M34 40 L18 6 L46 30 Z" fill="#f8d030"/><path d="M18 6 L22 14.5 L24.5 12 Z" fill="#2b2b2b"/>
    <path d="M66 40 L82 6 L54 30 Z" fill="#f8d030"/><path d="M82 6 L78 14.5 L75.5 12 Z" fill="#2b2b2b"/>
    <ellipse cx="50" cy="75" rx="20" ry="17" fill="#f8d030"/><ellipse cx="41" cy="91" rx="7" ry="4" fill="#f8d030"/><ellipse cx="59" cy="91" rx="7" ry="4" fill="#f8d030"/>
    <ellipse cx="50" cy="48" rx="25" ry="20" fill="#f8d030"/>${EYE(41,45,3.8,4.2,'#2b2b2b')}${EYE(59,45,3.8,4.2,'#2b2b2b')}
    <circle cx="33" cy="55" r="5" fill="#e8433f"/><circle cx="67" cy="55" r="5" fill="#e8433f"/><circle cx="50" cy="51" r="1" fill="#2b2b2b"/>
    <path d="M45 55 Q47.5 58 50 55 Q52.5 58 55 55" fill="none"/>
    <ellipse cx="40" cy="70" rx="4" ry="5" fill="#f8d030"/><ellipse cx="60" cy="70" rx="4" ry="5" fill="#f8d030"/>`},
  addSmall:{name:'Salamèche',cry:'Sala !',art:`<path d="M64 82 Q86 84 84 64" fill="none" stroke="#f08030" stroke-width="7"/>
    <path d="M84 44 Q93 55 89 62 Q84 67 79 62 Q75 55 84 44Z" fill="#f89030"/><path d="M84 52 Q88 58 86.5 61 Q84 63 81.5 61 Q80 58 84 52Z" fill="#f8e050" stroke="none"/>
    <ellipse cx="50" cy="75" rx="18" ry="17" fill="#f08030"/><ellipse cx="50" cy="79" rx="11" ry="11" fill="#f8e0a0"/>
    <ellipse cx="40" cy="91" rx="7" ry="4" fill="#f08030"/><ellipse cx="60" cy="91" rx="7" ry="4" fill="#f08030"/>
    <ellipse cx="33" cy="70" rx="4.5" ry="7" fill="#f08030" transform="rotate(25 33 70)"/><ellipse cx="67" cy="70" rx="4.5" ry="7" fill="#f08030" transform="rotate(-25 67 70)"/>
    <ellipse cx="50" cy="44" rx="22" ry="20" fill="#f08030"/>${EYE(42,41,3.8,5.5,'#2b2b2b')}${EYE(58,41,3.8,5.5,'#2b2b2b')}
    <path d="M42 52 Q50 62 58 52 Z" fill="#a8322a"/>`},
  add2:{name:'Carapuce',cry:'Cara cara !',art:`<path d="M66 84 Q88 86 86 70 Q84 61 76 66" fill="none" stroke="#7ec8e3" stroke-width="7"/>
    <ellipse cx="50" cy="75" rx="21" ry="18" fill="#b5651d"/><ellipse cx="50" cy="77" rx="14" ry="13" fill="#f3d98b"/><path d="M38 73 H62 M38 81 H62" fill="none" stroke="#b08a3a"/>
    <ellipse cx="29" cy="70" rx="5" ry="7.5" fill="#7ec8e3" transform="rotate(30 29 70)"/><ellipse cx="71" cy="70" rx="5" ry="7.5" fill="#7ec8e3" transform="rotate(-30 71 70)"/>
    <ellipse cx="40" cy="92" rx="7" ry="4" fill="#7ec8e3"/><ellipse cx="60" cy="92" rx="7" ry="4" fill="#7ec8e3"/>
    <circle cx="50" cy="41" r="21" fill="#7ec8e3"/>
    <ellipse cx="42" cy="40" rx="5.5" ry="6.5" fill="#fff"/><circle cx="43" cy="41" r="3.8" fill="#8b3a2a" stroke="none"/><circle cx="43.5" cy="41.5" r="1.8" fill="#2b2b2b" stroke="none"/><circle cx="44.5" cy="39.5" r="1.1" fill="#fff" stroke="none"/>
    <ellipse cx="58" cy="40" rx="5.5" ry="6.5" fill="#fff"/><circle cx="57" cy="41" r="3.8" fill="#8b3a2a" stroke="none"/><circle cx="56.5" cy="41.5" r="1.8" fill="#2b2b2b" stroke="none"/><circle cx="58" cy="39.5" r="1.1" fill="#fff" stroke="none"/>
    <path d="M43 52 Q50 57 57 52" fill="none"/>`},
  subSimple:{name:'Bulbizarre',cry:'Bulbi !',art:`<path d="M50 18 Q70 22 68 42 Q62 52 50 50 Q38 52 32 42 Q30 22 50 18Z" fill="#4caf50"/><path d="M50 19 Q46 34 50 50 M50 19 Q58 30 60 46" fill="none" stroke="#2e7d32"/>
    <ellipse cx="28" cy="84" rx="6.5" ry="5.5" fill="#78c8a0"/><ellipse cx="42" cy="87" rx="6.5" ry="5.5" fill="#78c8a0"/><ellipse cx="58" cy="87" rx="6.5" ry="5.5" fill="#78c8a0"/><ellipse cx="72" cy="84" rx="6.5" ry="5.5" fill="#78c8a0"/>
    <ellipse cx="50" cy="72" rx="30" ry="15" fill="#78c8a0"/>
    <path d="M31 56 L26 44 L39 51 Z" fill="#78c8a0"/><path d="M69 56 L74 44 L61 51 Z" fill="#78c8a0"/>
    <ellipse cx="50" cy="64" rx="23" ry="16" fill="#78c8a0"/>
    <ellipse cx="38" cy="55" rx="3.5" ry="2" fill="#4a9a7a" stroke="none"/><ellipse cx="62" cy="55" rx="4" ry="2.4" fill="#4a9a7a" stroke="none"/>
    <ellipse cx="41" cy="64" rx="5.5" ry="5" fill="#fff"/><circle cx="42" cy="64.5" r="3.5" fill="#c0392b" stroke="none"/><circle cx="42.3" cy="64.8" r="1.6" fill="#2b2b2b" stroke="none"/><circle cx="43.3" cy="63" r="1" fill="#fff" stroke="none"/>
    <ellipse cx="59" cy="64" rx="5.5" ry="5" fill="#fff"/><circle cx="58" cy="64.5" r="3.5" fill="#c0392b" stroke="none"/><circle cx="57.7" cy="64.8" r="1.6" fill="#2b2b2b" stroke="none"/><circle cx="59" cy="63" r="1" fill="#fff" stroke="none"/>
    <path d="M44 72 Q50 77 56 72" fill="none"/>`},
  addCross:{name:'Évoli',cry:'Évoli !',art:`<path d="M62 80 Q94 80 88 50 Q84 40 76 48 Q74 62 62 68 Z" fill="#c58c4b"/><path d="M88 50 Q84 40 76 48 Q82 47 87 56 Z" fill="#f3e2c0"/>
    <ellipse cx="50" cy="78" rx="15" ry="14" fill="#c58c4b"/><ellipse cx="42" cy="91" rx="5" ry="4" fill="#c58c4b"/><ellipse cx="58" cy="91" rx="5" ry="4" fill="#c58c4b"/>
    <path d="M37 40 L22 4 L49 31 Z" fill="#c58c4b"/><path d="M37 35 L27 13 L44 31 Z" fill="#6b4423" stroke="none"/>
    <path d="M63 40 L78 4 L51 31 Z" fill="#c58c4b"/><path d="M63 35 L73 13 L56 31 Z" fill="#6b4423" stroke="none"/>
    <ellipse cx="50" cy="46" rx="20" ry="17" fill="#c58c4b"/>
    <circle cx="37" cy="64" r="6.5" fill="#f3e2c0"/><circle cx="63" cy="64" r="6.5" fill="#f3e2c0"/><circle cx="44" cy="68" r="6.5" fill="#f3e2c0"/><circle cx="56" cy="68" r="6.5" fill="#f3e2c0"/><circle cx="50" cy="69" r="6.5" fill="#f3e2c0"/>
    ${EYE(42,45,3.8,5,'#3a2210')}${EYE(58,45,3.8,5,'#3a2210')}
    <path d="M48.5 51 H51.5 L50 52.5 Z" fill="#2b2b2b"/><path d="M46 54 Q48 56 50 54 Q52 56 54 54" fill="none"/>`},
  addCarry:{name:'Rondoudou',cry:'Rondouuu ♪',art:`<ellipse cx="40" cy="89" rx="8" ry="4.5" fill="#f8b8d0"/><ellipse cx="60" cy="89" rx="8" ry="4.5" fill="#f8b8d0"/>
    <ellipse cx="20" cy="62" rx="4.5" ry="7" fill="#f8b8d0"/><ellipse cx="80" cy="62" rx="4.5" ry="7" fill="#f8b8d0"/>
    <path d="M28 40 L22 20 L42 30 Z" fill="#f8b8d0"/><path d="M27 34 L24.5 25 L34 30 Z" fill="#2b2b2b" stroke="none"/>
    <path d="M72 40 L78 20 L58 30 Z" fill="#f8b8d0"/><path d="M73 34 L75.5 25 L66 30 Z" fill="#2b2b2b" stroke="none"/>
    <circle cx="50" cy="58" r="30" fill="#f8b8d0"/><path d="M44 30 Q40 18 52 17 Q62 19 56 27 Q52 31 50 25" fill="#f8b8d0"/>
    <circle cx="38" cy="55" r="9" fill="#fff"/><circle cx="39" cy="56.5" r="6.5" fill="#2e8b9a" stroke="none"/><circle cx="39" cy="56.5" r="2.6" fill="#2b2b2b" stroke="none"/><circle cx="41.5" cy="53" r="2.2" fill="#fff" stroke="none"/>
    <circle cx="62" cy="55" r="9" fill="#fff"/><circle cx="61" cy="56.5" r="6.5" fill="#2e8b9a" stroke="none"/><circle cx="61" cy="56.5" r="2.6" fill="#2b2b2b" stroke="none"/><circle cx="63.5" cy="53" r="2.2" fill="#fff" stroke="none"/>
    <path d="M46 72 Q50 75 54 72" fill="none"/>`},
  subCross:{name:'Psykokwak',cry:'Kwak ?',art:`<ellipse cx="40" cy="92" rx="8" ry="4" fill="#f3e2b3"/><ellipse cx="60" cy="92" rx="8" ry="4" fill="#f3e2b3"/>
    <ellipse cx="50" cy="76" rx="18" ry="16" fill="#f8d860"/><ellipse cx="50" cy="42" rx="22" ry="19" fill="#f8d860"/>
    <ellipse cx="27" cy="44" rx="5" ry="10" fill="#f8d860" transform="rotate(-25 27 44)"/><ellipse cx="73" cy="44" rx="5" ry="10" fill="#f8d860" transform="rotate(25 73 44)"/>
    <path d="M46 24 Q44 15 39 12 M50 23 V10 M54 24 Q56 15 61 12" fill="none"/>
    <circle cx="41" cy="39" r="6" fill="#fff"/><circle cx="41" cy="39" r="1.6" fill="#2b2b2b" stroke="none"/><circle cx="59" cy="39" r="6" fill="#fff"/><circle cx="59" cy="39" r="1.6" fill="#2b2b2b" stroke="none"/>
    <ellipse cx="50" cy="52" rx="11" ry="6" fill="#f3e2b3"/><path d="M40 52 H60" fill="none"/>`},
  subBorrow:{name:'Ronflex',cry:'Zzz… Ronfl…',art:`<path d="M31 24 L28 10 L41 18 Z" fill="#2f6f7e"/><path d="M69 24 L72 10 L59 18 Z" fill="#2f6f7e"/>
    <ellipse cx="17" cy="62" rx="7" ry="11" fill="#2f6f7e"/><ellipse cx="83" cy="62" rx="7" ry="11" fill="#2f6f7e"/>
    <ellipse cx="50" cy="63" rx="33" ry="29" fill="#2f6f7e"/><ellipse cx="50" cy="70" rx="24" ry="20" fill="#f3e2c0"/>
    <ellipse cx="32" cy="91" rx="11" ry="6.5" fill="#f3e2c0"/><ellipse cx="68" cy="91" rx="11" ry="6.5" fill="#f3e2c0"/>
    <ellipse cx="50" cy="34" rx="23" ry="18" fill="#2f6f7e"/>
    <path d="M32 38 Q34 28 42 30 L50 34 L58 30 Q66 28 68 38 Q66 50 50 51 Q34 50 32 38 Z" fill="#f3e2c0"/>
    <path d="M39 38 H46 M54 38 H61" fill="none" stroke-width="2.5"/><path d="M43 44 Q50 48 57 44" fill="none"/>
    <path d="M45 44.6 L46.5 42.5 L48 45.6 Z M52 45.6 L53.5 42.5 L55 44.6 Z" fill="#fff" stroke-width="1"/>`},
  mix:{name:'Mew',cry:'Mew !',art:`<path d="M58 82 Q84 90 88 64 Q91 44 80 36" fill="none" stroke="#f4a6c8" stroke-width="4"/><ellipse cx="79" cy="33" rx="4.5" ry="6.5" fill="#f4a6c8" transform="rotate(-20 79 33)"/>
    <ellipse cx="42" cy="88" rx="4" ry="7" fill="#f4a6c8"/><ellipse cx="55" cy="88" rx="4" ry="7" fill="#f4a6c8"/>
    <ellipse cx="48" cy="74" rx="12" ry="13" fill="#f4a6c8"/>
    <ellipse cx="36" cy="70" rx="3" ry="5" fill="#f4a6c8" transform="rotate(30 36 70)"/><ellipse cx="60" cy="70" rx="3" ry="5" fill="#f4a6c8" transform="rotate(-30 60 70)"/>
    <path d="M30 36 L27 16 L42 28 Z" fill="#f4a6c8"/><path d="M66 36 L69 16 L54 28 Z" fill="#f4a6c8"/>
    <ellipse cx="48" cy="45" rx="22" ry="18" fill="#f4a6c8"/>${EYE(40,46,5,7,'#2c6fbb')}${EYE(56,46,5,7,'#2c6fbb')}
    <path d="M45 55 Q48 57 51 55" fill="none"/>`},
};
const palSVG=(id,cls)=>`<svg viewBox="0 0 100 100" ${cls?`class="${cls}"`:''} aria-hidden="true"><g stroke="#2b2b2b" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">${PALS[id].art}</g></svg>`;
