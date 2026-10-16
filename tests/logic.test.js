// Vérifie la logique des calculs sans navigateur : node tests/logic.test.js
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const files = ["core/utils.js", "data/levels.js", "data/clock-levels.js", "data/money-levels.js", "core/storage.js", "graphics/aids.js", "graphics/clock.js", "game/clock.js", "game/money.js", "game/mission.js"];
const ctx = vm.createContext({ console });
vm.runInContext(files.map((f) => fs.readFileSync(path.join(ROOT, "src/js", f), "utf8")).join("\n"), ctx);

const RUNS = 20000;
let failures = 0;
const check = (ok, msg) => { if (!ok) { failures++; if (failures < 10) console.error("ÉCHEC :", msg); } };

// Chaque générateur respecte la compétence de sa planète.
const rules = {
  tens: (q) => q.a % 10 === 0 && q.b % 10 === 0,
  addSmall: (q) => q.op === "+" && q.b < 10 && (q.a % 10) + q.b < 10,
  add2: (q) => q.op === "+" && q.b >= 10 && (q.a % 10) + (q.b % 10) < 10,
  subSimple: (q) => q.op === "-" && q.a % 10 >= q.b % 10,
  addCross: (q) => q.op === "+" && q.b < 10 && (q.a % 10) + q.b >= 10,
  addCarry: (q) => q.op === "+" && q.b >= 10 && (q.a % 10) + (q.b % 10) >= 10,
  subCross: (q) => q.op === "-" && q.b < 10 && q.a % 10 < q.b,
  subBorrow: (q) => q.op === "-" && q.b >= 10 && q.a % 10 < q.b % 10,
  mix: () => true,
};
// Horloges : heures de 1 à 12, minutes de 5 en 5, et le pas attendu par planète.
const clockRules = {
  clockHours: (q) => q.m === 0 && q.pm === null,
  clockHalf: (q) => [0, 30].includes(q.m) && q.pm === null,
  clockQuarter: (q) => [15, 30, 45].includes(q.m) && q.pm === null,
  clockFive: (q) => q.m % 5 === 0 && q.pm === null,
  clockDay: (q) => q.m % 5 === 0 && (q.pm === true ? q.h + 12 <= 19 : q.h >= 6 && q.h <= 11),
};
vm.runInContext("this.T={GEN,LEVELS,res,ans,inverse,column,clockReadOk,clockSetOk,clockAdjust,clockSteps,clockAnswer,clockHour,unlocked,moneyValue,moneyTypedOk,moneyPayOk,moneySolution,moneyPuzzle,moneySteps,greedy,fmtEur,DENOMS}", ctx);
const { GEN, LEVELS, res, ans, inverse, column, clockReadOk, clockSetOk, clockAdjust, clockSteps, clockAnswer, clockHour, unlocked,
  moneyValue, moneyTypedOk, moneyPayOk, moneySolution, moneyPuzzle, moneySteps, greedy, fmtEur, DENOMS } = ctx.T;
// Marché : chaque planète produit le bon type de question, avec des sommes jusqu'à 100 €.
const sum = (a) => a.reduce((s, x) => s + x, 0);
const moneyRules = {
  moneyCoins: (q) => q.kind === "count" && q.items.every((v) => v === 100 || v === 200),
  moneyBills: (q) => q.kind === "count" && q.items.some((v) => v >= 500) && sum(q.items) <= 9900,
  moneyPay: (q) => q.kind === "pay" && !q.few && q.price % 100 === 0 && q.price >= 1100 && q.price <= 9900,
  moneyFew: (q) => q.kind === "pay" && q.few && q.price % 100 === 0 && q.price <= 9900,
  moneyChange: (q) => q.kind === "change" && q.paid > q.price && sum(q.paidItems) === q.paid && q.paid <= 10000,
  moneyCents: (q) => q.kind === "count" && q.cents && sum(q.items) >= 100 && sum(q.items) < 1000 && sum(q.items) % 100 !== 0,
};
check(LEVELS.every((l) => rules[l.id] || clockRules[l.id] || moneyRules[l.id]), "chaque planète a une règle de test");
check(unlocked(LEVELS.findIndex((l) => l.id === "clockHours")), "la première horloge est ouverte dès le départ");

for (const id of Object.keys(rules)) {
  for (let i = 0; i < RUNS; i++) {
    const q = GEN[id]();
    const r = res(q);
    check(rules[id](q), `${id} : ${q.a} ${q.op} ${q.b} ne respecte pas la compétence`);
    check(q.a >= 10 && q.b >= 1 && r >= 0 && r <= 99, `${id} : ${q.a} ${q.op} ${q.b} = ${r} hors limites`);
    // Mode énigme : le calcul inverse donne toujours le nombre caché.
    for (const hide of ["a", "b"]) {
      const e = { ...q, hide };
      const inv = inverse(e);
      check(res(inv) === ans(e) && res(inv) >= 0 && res(inv) <= 99, `${id} : inverse faux pour ${JSON.stringify(e)}`);
    }
    // Le calcul posé se construit et la correction donne le bon résultat.
    const c = column(q, true);
    check(c.steps.some((s) => s.includes(`<b>${r}</b>`)), `${id} : correction sans le résultat pour ${q.a} ${q.op} ${q.b}`);
  }
}

const pad = (m) => String(m).padStart(2, "0");
for (const id of Object.keys(clockRules)) {
  for (let i = 0; i < RUNS; i++) {
    const q = GEN[id]();
    check(q.clock && q.h >= 1 && q.h <= 12 && q.m >= 0 && q.m <= 55 && clockRules[id](q), `${id} : ${JSON.stringify(q)} ne respecte pas la compétence`);
    const H = clockHour(q);
    // lecture : la bonne heure est acceptée, avec ou sans « 00 » ; 5 minutes ou 1 heure d'écart sont refusées
    check(clockReadOk(q, String(H), pad(q.m)), `${id} : ${clockAnswer(q)} refusé`);
    if (q.m === 0) check(clockReadOk(q, String(H), ""), `${id} : ${H} h sans minutes refusé`);
    check(!clockReadOk(q, String(H), pad((q.m + 5) % 60)), `${id} : minutes fausses acceptées`);
    check(!clockReadOk(q, String((H % 12) + 1), pad(q.m)), `${id} : heure fausse acceptée`);
    if (q.pm === null) check(clockReadOk(q, String(q.h + 12), pad(q.m)), `${id} : ${q.h + 12} h refusé alors que l'horloge ne dit pas matin ou soir`);
    if (q.pm === true) check(!clockReadOk(q, String(q.h), pad(q.m)), `${id} : l'heure du matin acceptée pour l'après-midi`);
    // énigme : en partant de midi, les boutons permettent toujours d'atteindre l'heure demandée
    const L = LEVELS.find((l) => l.id === id);
    let set = { h: 12, m: 0 };
    for (let k = 0; k < q.h % 12; k++) set = clockAdjust(set, 60);
    for (let k = 0; k < q.m / Math.min(L.step, 60) && L.step < 60; k++) set = clockAdjust(set, L.step);
    check(clockSetOk(q, set), `${id} : impossible de régler ${clockAnswer(q)} avec un pas de ${L.step} min`);
    // la correction donne l'heure attendue
    check(clockSteps(q, true, false).some((s) => s.includes(`<b>${clockAnswer(q)}</b>`)), `${id} : correction sans l'heure pour ${clockAnswer(q)}`);
  }
}
// le moins de pièces possible : le rendu « glouton » est optimal pour les euros (vérifié par programmation dynamique)
const best = [0];
for (let c = 10; c <= 10000; c += 10) best[c / 10] = Math.min(...DENOMS.filter((d) => d <= c).map((d) => best[(c - d) / 10] + 1));
for (let c = 10; c <= 10000; c += 10) check(greedy(c).length === best[c / 10] && sum(greedy(c)) === c, `rendu glouton non optimal pour ${c} c`);

for (const id of Object.keys(moneyRules)) {
  const L = LEVELS.find((l) => l.id === id);
  for (let i = 0; i < RUNS; i++) {
    const q = GEN[id]();
    q.lv = id;
    check(moneyRules[id](q), `${id} : ${JSON.stringify(q)} ne respecte pas la compétence`);
    const v = moneyValue(q);
    if (q.kind === "pay") {
      const sol = moneySolution(q);
      check(moneyPayOk(q, sol), `${id} : la solution ne paie pas ${fmtEur(q.price)}`);
      check(sol.every((c) => L.denoms.includes(c.v)), `${id} : la solution utilise de l'argent absent du porte-monnaie`);
      // payer avec trop de pièces : accepté pour « prix exact », refusé pour « le moins possible »
      const split = sol.findIndex((c) => c.v === 200);
      if (split >= 0) {
        const more = [...sol.slice(0, split), { v: 100, w: -1 }, { v: 100, w: -1 }, ...sol.slice(split + 1)];
        check(moneyPayOk(q, more) === !q.few, `${id} : paiement en trop de pièces mal jugé pour ${fmtEur(q.price)}`);
      }
      check(!moneyPayOk(q, [...sol, { v: 100, w: -1 }]), `${id} : un paiement trop grand est accepté`);
    } else if (q.cents) {
      check(moneyTypedOk(q, "", String(Math.floor(v / 100)), String(v % 100)), `${id} : ${fmtEur(v)} refusé`);
      check(!moneyTypedOk(q, "", String(Math.floor(v / 100)), String((v % 100) + 10)), `${id} : centimes faux acceptés`);
    } else {
      check(moneyTypedOk(q, String(v / 100), "", ""), `${id} : ${fmtEur(v)} refusé`);
      check(!moneyTypedOk(q, String(v / 100 + 1), "", ""), `${id} : réponse fausse acceptée`);
    }
    check(moneySteps(q, true).some((s) => s.includes(`<b>${fmtEur(v)}</b>`)), `${id} : correction sans la somme ${fmtEur(v)}`);
    // énigme : le porte-monnaie limité permet toujours de payer, sans utiliser deux fois la même pièce
    if (i < 2000) {
      const p = moneyPuzzle(L);
      const s = moneySolution(p);
      check(moneyPayOk(p, s) && new Set(s.map((c) => c.w)).size === s.length && p.price <= 9900, `${id} : énigme impossible ${JSON.stringify(p)}`);
    }
  }
}
check(clockAdjust({ h: 12, m: 0 }, -5).h === 11 && clockAdjust({ h: 11, m: 55 }, 5).h === 12, "les aiguilles tournent dans les deux sens autour de midi");

if (failures) { console.error(`${failures} échec(s)`); process.exit(1); }
console.log(`OK : ${Object.keys(rules).length + Object.keys(clockRules).length + Object.keys(moneyRules).length} planètes × ${RUNS} questions vérifiées`);
