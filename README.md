# eduguks

## Fusée des Nombres

Jeu de mathématiques pour le CE1 : additions et soustractions à deux chiffres, lecture de l'heure et monnaie.
Ouvrir `index.html` dans un navigateur (tablette, ordinateur ou téléphone). Rien à installer.

- 9 planètes, une par compétence : dizaines rondes, ajout d'unités, additions sans puis avec retenue, soustractions sans puis avec échange, et un grand défi final.
- 10 calculs par mission. 1 à 3 étoiles selon les réussites ; 1 étoile débloque la planète suivante.
- Aides : cubes (dizaines et unités) et calcul posé en colonnes. Après une erreur, un indice ; après deux, la correction pas à pas.
- Les calculs ratés reviennent dans les missions suivantes. La « Mission réparation » reprend uniquement ces calculs (8 au plus), du plus facile au plus difficile, avec le calcul posé ouvert d'office.
- Mode chrono par planète (ouvert dès 1 étoile) : 10 calculs, +5 s par erreur. Le meilleur temps est enregistré ; battre l'objectif argent puis or fait gagner la fusée de la planète, à choisir dans le hangar.
- Mode énigme par planète (ouvert dès 1 étoile) : trouver le nombre caché (34 + ? = 52), avec une astuce qui montre le calcul inverse. 8 points sur 10 font gagner un compagnon Pokémon, affiché sur la carte et à choisir dans « Mes compagnons ».
- Monde « Horloges » (onglet sur la carte) : 5 planètes pour lire l'heure sur une horloge à aiguilles : heures pile, et demie, quarts d'heure, de 5 en 5 minutes, puis matin ou après-midi (15 h 20). Aides « Minutes » (0, 5, 10… autour du cadran) et « Indice » (petite aiguille = heures, grande = minutes). Le chrono existe aussi ; l'énigme consiste à régler les aiguilles. Chaque planète a son alien, sa fusée et son compagnon.
- Monde « Marché » : 6 planètes sur la monnaie, jusqu'à 100 € : compter des pièces, puis des billets, payer le prix exact en touchant l'argent du porte-monnaie, payer avec le moins de pièces et billets possible, rendre la monnaie (en comptant à partir du prix), et une planète bonus pour les centimes. Aides « Ranger », « Compter pour moi » et « Indice ». L'énigme : payer avec un porte-monnaie limité.
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
    clock.css              horloges et onglets des mondes
    money.css              pièces, billets, comptoir et porte-monnaie
  js/
    core/
      utils.js             hasard, calculs, formats, échappement HTML
      storage.js           sauvegarde de la progression, déblocages
      sound.js             sons
    data/
      levels.js            les mondes et les 9 planètes de calcul : générateurs, objectifs
      clock-levels.js      les 5 planètes des horloges
      money-levels.js      les 6 planètes du Marché
      messages.js          textes d'encouragement
    graphics/
      icons.js             cadenas, étoiles
      rockets.js           fusées
      aliens.js            aliens de l'album
      companions.js        compagnons
      aids.js              cubes et calcul posé (aides pédagogiques)
      clock.js             horloge à aiguilles
      money.js             pièces et billets
    game/
      mission.js           déroulement d'une mission (normale, chrono, énigme, réparation)
      clock.js             horloges : vérification des réponses, explications
      money.js             monnaie : vérification, explications, énigmes du porte-monnaie
    ui/
      render.js            affichage de l'écran courant
      home.js, game.js, results.js, collections.js, parents.js   un fichier par écran
      game-clock.js        écran de jeu des horloges
      game-money.js        écran de jeu du Marché
      effects.js           confettis, ciel étoilé
    main.js                démarrage et interactions
tools/build.py             assemble tout en un seul fichier
tests/logic.test.js        vérifie la logique des questions
.github/workflows/tests.yml  lance les tests sur GitHub
```

**Ajouter ou modifier une planète** : tout se passe dans `src/js/data/levels.js`, `clock-levels.js` ou `money-levels.js` (générateur de questions dans `GEN`, nom, monde, couleurs et objectifs dans `LEVELS`). Ajouter aussi sa fusée (automatique), son alien (automatique) et son compagnon dans `src/js/graphics/companions.js`, puis une règle dans `tests/logic.test.js`.

## Commandes

```
node tests/logic.test.js     # vérifie 20 000 questions par planète
python3 tools/build.py       # met à jour les numéros de version et crée dist/fusee-des-nombres.html
```

**Après chaque modification d'un fichier de `src/`, lancer `python3 tools/build.py`** et enregistrer `index.html` avec le reste. Chaque fichier y est chargé avec un numéro tiré de son contenu (`?v=…`) : quand il change, les téléphones le rechargent au lieu de garder l'ancien en cache. Les tests sur GitHub (`.github/workflows/tests.yml`) échouent si un numéro est périmé.
