// Vérifie la logique des calculs sans navigateur : node tests/logic.test.js
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const files = ["core/utils.js", "data/levels.js", "data/clock-levels.js", "core/storage.js", "graphics/aids.js", "graphics/clock.js", "game/clock.js", "game/mission.js"];
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
vm.runInContext("this.T={GEN,LEVELS,res,ans,inverse,column,clockReadOk,clockSetOk,clockAdjust,clockSteps,clockAnswer,clockHour,unlocked}", ctx);
const { GEN, LEVELS, res, ans, inverse, column, clockReadOk, clockSetOk, clockAdjust, clockSteps, clockAnswer, clockHour, unlocked } = ctx.T;
check(LEVELS.every((l) => rules[l.id] || clockRules[l.id]), "chaque planète a une règle de test");
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
check(clockAdjust({ h: 12, m: 0 }, -5).h === 11 && clockAdjust({ h: 11, m: 55 }, 5).h === 12, "les aiguilles tournent dans les deux sens autour de midi");

if (failures) { console.error(`${failures} échec(s)`); process.exit(1); }
console.log(`OK : ${Object.keys(rules).length + Object.keys(clockRules).length} planètes × ${RUNS} questions vérifiées`);
