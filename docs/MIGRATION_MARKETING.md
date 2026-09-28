# Migration Introduction et Courses — 27 septembre 2026

## Contenu repris

Source : fichiers `index.html/introduction.html` et `index.html/courses.html` du
dépôt `ThierryMar/site_web`, commit `ff40fd1` (HEAD distant vérifié avant reprise).

- `/introduction` affiche les onze sections de présentation du programme.
- `/courses` affiche les quatre aperçus avec résumé, objectifs, sujets et question clé.
- Les textes anglais, leur ordre et les ancres historiques sont conservés. Le sommaire
  de l’introduction est généré depuis les sections réelles et remplace les liens cassés de la source.
- Le rendu reprend la palette et la navigation du frontend Next.js existant, avec un
  sommaire latéral sur ordinateur et placé avant le contenu sur mobile.
- Aucun nouveau schéma de base de données ni dépendance n’est nécessaire.

## Modifier dans le CMS

Dans `/admin` :

- **Pages** : titres et présentations des pages `introduction` et `courses`.
- **Site marketing → Intro** : titres, textes riches et ordre des onze sections.
- **Site marketing → Cours (Aperçu)** : titres, résumés, présentations et ordre des quatre cours.
- **Cours → Cours** : quatre fiches associées créées en brouillon, réservées aux administrateurs.
  Elles constituent les points d’attache des futures leçons, pas des cours pédagogiques complets.

Publier un document pour le rendre visible. Les pages publiques lisent les données
à chaque requête avec les droits anonymes, même pour un administrateur connecté.
Les relations vers les cours privés ne sont pas développées. Un catalogue vide reste vide ;
une erreur de base affiche un message d’indisponibilité, sans reprendre un ancien contenu statique.

## Rejouer l’import

```sh
pnpm exec tsx scripts/import-legacy-marketing.ts
pnpm exec tsx scripts/import-legacy-marketing.ts --apply
```

La première commande effectue une lecture seule. La seconde crée uniquement les documents
manquants dans la base configurée localement. Tout slug existant, publié ou en brouillon,
est préservé. Les aperçus et sections importés sont publiés ; les cours associés restent privés.
L’exécution administrative locale utilise volontairement `overrideAccess: true`.

Le manifeste `src/content/legacy-marketing.json` peut être reconstruit depuis les fichiers
HTML versionnés avec `python scripts/extract-legacy-marketing.py` (bibliothèque standard).
Ce manifeste n’est utilisé que pour l’import, jamais comme source du frontend public.

## Validation

- Import appliqué : deux pages, onze sections, quatre aperçus et quatre cours associés en brouillon.
- Seconde exécution : documents préservés, aucun doublon.
- Lint, TypeScript, 18 tests et compilation de production réussis.
- Test comparant tous les textes et ancres des quinze sections aux sources HTML.
- HTTP 200 sur les deux nouvelles pages et Downloads ; HTTP 403 sur les cours privés anonymes.
- Anciennes URL `/introduction.html`, `/courses.html` et leurs variantes `/index.html/…`
  redirigées en HTTP 308 ; ancres conservées.
- Navigation navigateur, rendu ordinateur et mobile à 390 px vérifiés ; aucun débordement
  horizontal sur Courses, aucune ancre manquante et aucune erreur navigateur relevée.

Validation sur la compilation locale, port 3108. Aucun déploiement Vercel effectué dans ce lot.
Restent notamment la reprise complète de l’accueil, Contact/biographie et les simulations.

## Mise à jour — reprise graphique publiée

Le lot suivant reprend désormais accueil, Contact, Objectives et Simulations,
et applique le CSS historique aux pages publiques. Les contenus Introduction,
Courses et Downloads restent alimentés par Payload. Voir
[la reprise du frontend historique](REPRISE_FRONTEND_HISTORIQUE.md) pour les
validations de production et les pages qui restent statiques.
