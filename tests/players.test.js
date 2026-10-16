// Vérifie les joueurs et la sauvegarde sans navigateur : node tests/players.test.js
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const files = ["core/utils.js", "data/levels.js", "data/clock-levels.js", "data/money-levels.js", "core/storage.js"];
const code = files.map((f) => fs.readFileSync(path.join(ROOT, "src/js", f), "utf8")).join("\n");
let failures = 0;
const check = (ok, msg) => { if (!ok) { failures++; console.error("ÉCHEC :", msg); } };

// un faux localStorage partagé entre deux « ouvertures » du jeu
function memoryStorage(initial = {}) {
  const data = { ...initial };
  return { data, getItem: (k) => (k in data ? data[k] : null), setItem: (k, v) => { data[k] = String(v); }, removeItem: (k) => { delete data[k]; } };
}
function open(storage) {
  const ctx = vm.createContext({ console, localStorage: storage });
  vm.runInContext(code + "\nthis.api={get S(){return S},get P(){return P},save,switchPlayer,addPlayer,deletePlayer,setPlayerName,unlocked,chronoOpen,LEVELS,MAX_PLAYERS}", ctx);
  return ctx.api;
}

// 1. l'ancienne sauvegarde unique devient le premier joueur
const old = { v: 1, name: "Léo", levels: { tens: { stars: 2, plays: 1 } }, pals: {} };
const storage = memoryStorage({ "fusee-des-nombres-v1": JSON.stringify(old) });
let g = open(storage);
check(g.P.list.length === 1 && g.S.name === "Léo" && g.S.levels.tens.stars === 2, "ancienne sauvegarde reprise comme premier joueur");
const leo = g.P.current;

// 2. un deuxième joueur a sa propre progression, et on retrouve chacun après réouverture
g.addPlayer("Emma");
check(g.P.list.length === 2 && g.S.name === "Emma" && !g.S.levels.tens, "nouveau joueur sans progression");
g.S.levels.add2 = { stars: 3, plays: 1 }; g.save();
g = open(storage);
check(g.S.name === "Emma" && g.S.levels.add2.stars === 3, "le dernier joueur est repris à la réouverture");
g.switchPlayer(leo);
check(g.S.name === "Léo" && g.S.levels.tens.stars === 2 && !g.S.levels.add2, "progressions séparées");

// 3. prénom magique : toutes les planètes et tous les défis ouverts, tous les compagnons, toutes les fusées dorées
g.addPlayer("gvdm");
check(g.S.magic && g.LEVELS.every((l, i) => g.unlocked(i) && g.chronoOpen(l.id) && g.S.pals[l.id] && g.S.rockets[l.id] === "gold"), "GVDM débloque tout");
g.switchPlayer(leo);
check(!g.S.magic && !g.unlocked(g.LEVELS.findIndex((l) => l.id === "subSimple")), "les autres joueurs ne sont pas débloqués");

// 4. suppression : la progression disparaît, il reste toujours au moins un joueur
const emma = g.P.list.find((p) => p.name === "Emma").id;
g.deletePlayer(emma);
check(!g.P.list.some((p) => p.id === emma) && !("fusee-des-nombres-joueur-" + emma in storage.data), "joueur supprimé avec sa sauvegarde");
for (const p of g.P.list.slice()) g.deletePlayer(p.id);
check(g.P.list.length === 1 && g.P.current === g.P.list[0].id, "il reste toujours un joueur");

// 5. sans localStorage (navigation bloquée), le jeu démarre quand même
const blocked = { getItem() { throw new Error("bloqué"); }, setItem() { throw new Error("bloqué"); }, removeItem() {} };
check(open(blocked).P.list.length === 1, "démarrage sans stockage");

if (failures) { console.error(`${failures} échec(s)`); process.exit(1); }
console.log("OK : joueurs, sauvegarde et prénom magique vérifiés");
