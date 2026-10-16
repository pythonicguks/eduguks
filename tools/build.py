#!/usr/bin/env python3
"""Numérote les fichiers du jeu dans index.html, puis assemble un fichier unique autonome.

Usage :
  python3 tools/build.py          met à jour les numéros de version de index.html
                                  et crée dist/fusee-des-nombres.html
  python3 tools/build.py --check  vérifie seulement que les numéros sont à jour
                                  (échoue sinon ; utilisé par les tests sur GitHub)

Numéros de version : chaque fichier de src/ est chargé avec « ?v=<empreinte de son contenu> ».
Quand un fichier change, son adresse change : le téléphone le recharge au lieu de garder
l'ancien en cache, et ne peut plus mélanger anciens et nouveaux fichiers.
"""
import hashlib
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
INDEX = ROOT / "index.html"
OUT = ROOT / "dist" / "fusee-des-nombres.html"
ASSET = re.compile(r'(href|src)="(src/[^"?]+)(?:\?v=[0-9a-f]*)?"')


def fingerprint(path):
    return hashlib.sha1((ROOT / path).read_bytes()).hexdigest()[:8]


def stamped(page):
    return ASSET.sub(lambda m: f'{m[1]}="{m[2]}?v={fingerprint(m[2])}"', page)


def assemble(page):
    styles = re.findall(r'<link rel="stylesheet" href="(src/[^"?]+)', page)
    scripts = re.findall(r'<script src="(src/[^"?]+)', page)
    css = "\n".join((ROOT / p).read_text(encoding="utf-8") for p in styles)
    # Les fichiers partagent la même portée dans le navigateur ; une fois
    # réunis, on les enveloppe dans une fonction pour ne rien exposer.
    js = "\n".join((ROOT / p).read_text(encoding="utf-8").replace('"use strict";\n', "", 1) for p in scripts)
    fonts = "\n".join(re.findall(r'<link rel="(?:preconnect|stylesheet)" href="https://[^>]+>', page))
    body = re.search(r"<body>\n(.*?)\n<!--", page, re.S).group(1)
    out = (
        "<title>Fusée des Nombres</title>\n" + fonts + "\n<style>\n" + css + "</style>\n\n"
        + body + "\n\n<script>\n(function(){\n\"use strict\";\n" + js + "})();\n</script>\n"
    )
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(out, encoding="utf-8")
    print(f"{OUT.relative_to(ROOT)} : {len(styles)} feuilles de style, {len(scripts)} scripts, {len(out) // 1024} Ko")


def main():
    page = INDEX.read_text(encoding="utf-8")
    fresh = stamped(page)
    if "--check" in sys.argv:
        if fresh != page:
            sys.exit("index.html : numéros de version périmés. Lancez python3 tools/build.py puis enregistrez index.html.")
        print("index.html : numéros de version à jour")
        return
    if fresh != page:
        INDEX.write_text(fresh, encoding="utf-8")
        print("index.html : numéros de version mis à jour")
    assemble(fresh)


if __name__ == "__main__":
    main()
