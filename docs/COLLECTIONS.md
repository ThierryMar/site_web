# Collections Payload

Dans `/admin`, les contenus sont organisés en deux groupes.

| Groupe | Collection | API |
| --- | --- | --- |
| Site marketing | Intro | `/api/intro` |
| Site marketing | Cours (Aperçu) | `/api/course-overviews` |
| Site marketing | Ressources (Downloads) | `/api/downloads` |
| Site marketing | Simulations | `/api/simulations` |
| Cours | Cours | `/api/courses` |
| Cours | Leçons | `/api/lessons` |
| Cours | Ressources | `/api/course-resources` |
| Cours | Exercices | `/api/exercises` |
| Cours | Quiz | `/api/quizzes` |

Créer un cours, puis ses leçons, ressources, exercices et quiz avec le champ
« Cours ». Les listes associées sont également accessibles depuis le cours.
Créer ensuite un aperçu marketing associé pour sa présentation publique.
Chaque collection possède un titre, un slug unique dans la collection, un ordre
d'affichage et un historique avec brouillons/publication.

Les visiteurs peuvent lire uniquement les contenus marketing publiés.
Les participants connectés peuvent lire le cours exemple `course-2` publié,
ses leçons publiées et son quiz d’entraînement. Les autres cours, les brouillons,
les ressources privées et les exercices restent réservés aux administrateurs.
La publication du cours parent est également nécessaire à la lecture de ses leçons
et quiz. Les corrigés restent masqués par les droits des champs dans les API.
Le quiz exemple possède une correction serveur réservée aux participants,
sans enregistrement des tentatives. Les inscriptions générales et le suivi
persistant de la progression restent à implémenter.

Les ressources utilisent des URL HTTP(S) de fichiers déjà hébergés ; aucun
stockage ni téléversement de fichiers n'est configuré. Pour des fichiers de cours
privés, utiliser un hébergement avec contrôle d'accès : une URL publique reste publique.
Les simulations sont référencées par URL. Le rendu de ces contenus sur le site
frontend reste à connecter. La collection `pages` existante est conservée.

Le schéma est livré dans la migration `20260914_173953_marketing_courses`.
Sur chaque autre environnement, appliquer `pnpm migrate` avant d'utiliser ces collections.

## Premier module : Astrodynamics Laws

Le contenu suit le document de Richard L. Lachance, Ph.D.,
`SꙨL Part II – Section 1 – Astrodynamics Laws.pptx` (85 diapositives).
Il couvre uniquement la section 1 de Foundations of Astrodynamics, en anglais.
Le plan des sections ultérieures du PowerPoint ne constitue pas du contenu livré.

- Version abrégée : aperçu `course-2`, à `/courses#course-2`.
- Version complète : `/dashboard?section=courses`, puis `/dashboard/courses/course-2`.
- Neuf leçons (120 minutes estimées) dans `lessons`, avec références aux diapositives,
  exemples résolus, hypothèses et unités cohérentes.
- Quiz `astrodynamics-laws-self-check` : dix questions et corrigés. Le score est
  temporaire, sans certificat ni enregistrement de progression.
- Calculateur interactif : orbite terrestre circulaire, altitude de 200 à 40 000 km.

Le gabarit réutilisable est dans `src/components/learning/` et la route
`src/app/(frontend)/dashboard/courses/[slug]/page.tsx`. Les pages lisent exclusivement
le contenu publié dans Payload. Modifier le cours, ses leçons et le quiz dans `/admin`.
Le manifeste `src/content/astrodynamics-laws.ts` sert à l’import initial uniquement.

Pour initialiser une autre base déjà migrée :

```sh
pnpm exec tsx scripts/import-astrodynamics-course.ts
pnpm exec tsx scripts/import-astrodynamics-course.ts --apply
```

La première commande prévisualise les changements. La seconde sauvegarde le cours et
l’aperçu existants dans `output/astrodynamics-before-*.json`, puis publie l’ensemble
dans une transaction. Si des leçons ou le quiz existent déjà, elle ne les remplace
pas. Aucun changement de schéma n’est requis. Le catalogue d’accès exemple est défini
dans `src/lib/course-catalog.ts` et les restrictions dans `src/access.ts`.

Les corrections pédagogiques apportées au support concernent notamment les unités
de `h` (km²/s) et du moment d’inertie (kg·m²), le poids apparent en chute libre, la
distinction entre période nodale et précession des nœuds, l’interprétation du moyen
mouvement TLE, et le potentiel gravitationnel qui tend vers zéro à l’infini.
Les notes de travail internes aux diapositives n’ont pas été reprises comme consignes.

### Illustrations du module

Les 136 fichiers image du support sont conservés à l’identique dans
`assets/course-images/astrodynamics-laws/originals`. La sélection pédagogique
affichée comprend 20 illustrations, dont trois animations avec lecture/pause.
Les logos, décorations, captures de texte, symboles isolés et doublons sont exclus
du cours et de sa galerie. Les équations restent lisibles dans le texte des leçons.

`scripts/build-course-images.mjs` définit la sélection et son placement par rubrique,
puis génère `src/content/astrodynamics-images.json`. Les illustrations sont insérées
dans le contenu du CMS ; une rubrique renommée conserve ses illustrations en fin
de leçon. La galerie `/dashboard/courses/course-2?images=all` reprend cette même
sélection. Deux schémas sont également présents dans l’aperçu public.

Les images du cours complet passent par `/api/course-images/[id]` : authentification,
accès au cours publié et liste d’identifiants autorisés. Les fichiers écartés ne sont
pas servis. Le traçage Next.js n’inclut que les fichiers de la sélection. Les
originaux GIF restent animés ; leur première image sert d’aperçu au repos.

Pour régénérer les images depuis le PowerPoint sur Windows :

```powershell
./scripts/extract-astrodynamics-images.ps1 -Source 'chemin/vers/le/document.pptx'
node scripts/build-course-images.mjs
```

Référence : [configuration des collections Payload](https://payloadcms.com/docs/configuration/collections).
