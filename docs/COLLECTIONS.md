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
Les contenus pédagogiques sont réservés aux administrateurs en attendant
l'implémentation des inscriptions et droits étudiants. Les corrigés disposent
également de restrictions de lecture au niveau des champs.
Les quiz stockent des questions à choix multiples ; la soumission, la notation
et le suivi des tentatives restent à implémenter.

Les ressources utilisent des URL HTTP(S) de fichiers déjà hébergés ; aucun
stockage ni téléversement de fichiers n'est configuré. Pour des fichiers de cours
privés, utiliser un hébergement avec contrôle d'accès : une URL publique reste publique.
Les simulations sont référencées par URL. Le rendu de ces contenus sur le site
frontend reste à connecter. La collection `pages` existante est conservée.

Le schéma est livré dans la migration `20260914_173953_marketing_courses`.
Sur chaque autre environnement, appliquer `pnpm migrate` avant d'utiliser ces collections.

Référence : [configuration des collections Payload](https://payloadcms.com/docs/configuration/collections).
