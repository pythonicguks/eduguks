// Vérifie la logique des calculs sans navigateur : node tests/logic.test.js
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const files = ["core/utils.js", "data/levels.js", "core/storage.js", "graphics/aids.js", "game/mission.js"];
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
vm.runInContext("this.T={GEN,LEVELS,res,ans,inverse,column}", ctx);
const { GEN, LEVELS, res, ans, inverse, column } = ctx.T;
check(LEVELS.every((l) => rules[l.id]), "chaque planète a une règle de test");

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

if (failures) { console.error(`${failures} échec(s)`); process.exit(1); }
console.log(`OK : ${Object.keys(rules).length} planètes × ${RUNS} calculs vérifiés`);
