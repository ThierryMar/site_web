# Reprise du frontend historique — 27 septembre 2026

Le frontend versionné dans `index.html/` est repris sur le domaine
https://spaceorbitlab.com. Le fichier `public/legacy/style.css` est une copie
octet pour octet de `index.html/style.css`, sans réécriture par le compilateur CSS.
Son SHA-256 est `df92ed58d03ef9d9556b70afc8998116b53e90a07eeb562dd2a71ca1ebb764ff`.
Les styles et le JavaScript des simulations sont également copiés à l'identique.

## Pages et ressources

- Accueil : présentation, liens et visuels historiques restaurés.
- Introduction, Courses et Downloads : classes CSS historiques ; contenus déjà
  importés dans Payload conservés et toujours éditables dans le CMS.
- Contact : biographie, missions et présentation Orbits101 restaurées.
- Objectives : contenu historique repris.
- Simulations : page HTML historique, Pyodide, SOL.py et outils Python disponibles.
- Images et logo repris ; anciennes URL HTML redirigées vers les nouvelles routes.
- Navigation corrigée pour le lien Downloads et le téléchargement Orbits101.

L'accueil, Contact, Objectives et Simulations restent gérés dans le code ; leur
présence sur le site ne signifie pas que leurs contenus sont éditables dans Payload.
Aucune nouvelle écriture en base n'a été nécessaire pour cette reprise graphique.
Le HTML injecté provient exclusivement des fichiers statiques du dépôt.

## Reproduction et adaptation mobile

`python scripts/restore-legacy-frontend.py` reconstruit les templates JSON et copie
les ressources depuis les sources historiques. Les adaptations concernent les
chemins des liens et des images, pas le CSS original.

`public/legacy-mobile.css`, chargé après le CSS historique, contient uniquement
des corrections à moins de 760 px : grilles sur une colonne, sommaire non collant,
titre d'accueil ajusté et retours à la ligne. Le CSS historique écrasait certaines
de ses propres règles mobiles avec des déclarations placées plus bas dans le fichier.
Cette correction séparée préserve le fichier source et le rendu sur ordinateur.

## Vérifications

- 20 tests automatisés réussis, dont égalité binaire des fichiers historiques.
- ESLint réussi ; compilation et vérification TypeScript réussies sur Vercel.
- 32 routes et images en HTTP 200 ; anciennes URL Contact, Simulations et Objectives
  résolues vers les nouvelles pages.
- CSS principal et CSS des simulations téléchargés depuis la production et
  comparés avec succès aux sources originales.
- Simulation circulaire exécutée en production : altitude 400 km, vitesse
  7,669 km/s, période 92,56 min et graphique affiché.
- Lien `/simulations#circular-orbit` rechargeable sans erreur de routage ; le
  sélecteur revient à son état initial selon le comportement du JavaScript historique.
- Écran CMS `/admin/login` disponible ; connexion authentifiée non exercée ici.

Le dépôt contient encore des modifications locales non commitées, notamment des
travaux CMS antérieurs. Le déploiement utilise une copie de travail sur D: afin
d'éviter une erreur de suppression de cache `.next` dans le dossier OneDrive.

Validation mobile finale à 390 px : accueil et Courses sans débordement horizontal
(largeur du document 375 px, viewport 390 px avec barre de défilement). Contact
également contrôlé sans débordement ni image manquante.

Déploiement final READY : `dpl_8wJcaK4DyeYKRkoNnsz89kaZvrU8`, alias
https://spaceorbitlab.com, compilation distante réussie en 21 secondes.

## Correction des sommaires — 27 septembre 2026

Suppression du nav imbriqué dans le sommaire : il héritait de la disposition
horizontale du menu principal et recouvrait les paragraphes. Le sommaire reprend
la structure historique, avec le rôle navigation accessible conservé. Aucune
couleur modifiée. Introduction et Courses vérifiés en production à 1280 px et
390 px : liens contenus dans leur colonne, pas de débordement horizontal et
sommaire placé avant le texte sur mobile. ESLint, TypeScript et build réussis.
Déploiement READY : `dpl_3ZTF6mPcYkCoN146SNJ8SqPqwgKG`.

Préférence utilisateur clarifiée : le CSS peut être modifié à condition de
conserver les palettes de couleurs choisies.
