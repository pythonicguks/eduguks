# eduguks

## Fusée des Nombres

Jeu de calcul pour le CE1 : additions et soustractions à deux chiffres.
Ouvrir `index.html` dans un navigateur (tablette, ordinateur ou téléphone). Rien à installer.

- 9 planètes, une par compétence : dizaines rondes, ajout d'unités, additions sans puis avec retenue, soustractions sans puis avec échange, et un grand défi final.
- 10 calculs par mission. 1 à 3 étoiles selon les réussites ; 1 étoile débloque la planète suivante.
- Aides : cubes (dizaines et unités) et calcul posé en colonnes. Après une erreur, un indice ; après deux, la correction pas à pas.
- Les calculs ratés reviennent dans les missions suivantes. La « Mission réparation » reprend uniquement ces calculs (8 au plus), du plus facile au plus difficile, avec le calcul posé ouvert d'office.
- Mode chrono par planète (ouvert dès 1 étoile) : 10 calculs, +5 s par erreur. Le meilleur temps est enregistré ; battre l'objectif argent puis or fait gagner la fusée de la planète, à choisir dans le hangar.
- Mode énigme par planète (ouvert dès 1 étoile) : trouver le nombre caché (34 + ? = 52), avec une astuce qui montre le calcul inverse. 8 points sur 10 font gagner un compagnon Pokémon, affiché sur la carte et à choisir dans « Mes compagnons ».
- Album d'aliens à collectionner, série de jours d'entraînement, espace parents avec le taux de réussite par compétence.

## Organisation du code

Pas de framework ni de dépendance : du HTML, du CSS et du JavaScript simples. `index.html` charge les fichiers de `src/` dans l'ordre ; chaque script peut utiliser ce que définissent les précédents.

```
index.html                 page d'entrée (charge styles et scripts)
src/
  styles/
    base.css               couleurs, polices, éléments communs, effets
    home.css               carte des planètes, compagnon, boutons des défis
    game.css               écran de jeu : piste, calcul, aides, clavier
    screens.css            résultats, album, hangar, compagnons, parents
  js/
    core/
      utils.js             hasard, calculs, formats, échappement HTML
      storage.js           sauvegarde de la progression, déblocages
      sound.js             sons
    data/
      levels.js            les 9 planètes : générateurs de calculs, objectifs
      messages.js          textes d'encouragement
    graphics/
      icons.js             cadenas, étoiles
      rockets.js           fusées
      aliens.js            aliens de l'album
      companions.js        compagnons
      aids.js              cubes et calcul posé (aides pédagogiques)
    game/
      mission.js           déroulement d'une mission (normale, chrono, énigme, réparation)
    ui/
      render.js            affichage de l'écran courant
      home.js, game.js, results.js, collections.js, parents.js   un fichier par écran
      effects.js           confettis, ciel étoilé
    main.js                démarrage et interactions
tools/build.py             assemble tout en un seul fichier
tests/logic.test.js        vérifie la logique des calculs
```

**Ajouter ou modifier une planète** : tout se passe dans `src/js/data/levels.js` (générateur de calculs dans `GEN`, nom, couleurs et objectifs dans `LEVELS`). Ajouter aussi sa fusée (automatique), son alien (automatique) et son compagnon dans `src/js/graphics/companions.js`, puis une règle dans `tests/logic.test.js`.

## Commandes

```
node tests/logic.test.js     # vérifie 20 000 calculs par planète
python3 tools/build.py       # crée dist/fusee-des-nombres.html, un fichier unique autonome
```
