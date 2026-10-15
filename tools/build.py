#!/usr/bin/env python3
"""Assemble index.html et ses sources en un seul fichier autonome.

Usage : python3 tools/build.py
Résultat : dist/fusee-des-nombres.html (une page sans dépendance locale,
à publier en Artifact ou à copier sur un appareil).
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "dist" / "fusee-des-nombres.html"


def main():
    page = (ROOT / "index.html").read_text(encoding="utf-8")
    styles = re.findall(r'<link rel="stylesheet" href="(src/[^"]+)">', page)
    scripts = re.findall(r'<script src="(src/[^"]+)"></script>', page)
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


if __name__ == "__main__":
    main()
