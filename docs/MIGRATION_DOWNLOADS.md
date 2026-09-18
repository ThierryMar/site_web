# Migration de Download — 18 septembre 2026

## Périmètre livré

- `/downloads` remplace `index.html/Download.html` dans le frontend Next.js.
- Les quatre PDF et l’archive Orbits101 Beta 0.96 sont copiés à l’identique dans
  `public/legacy/`. Les fichiers sources restent dans `index.html/`.
- La navigation de l’accueil donne accès à Downloads.
- Le titre et la présentation proviennent du document `pages` de slug `downloads`.
- Les titres, descriptions, formats, liens et ordres proviennent de `downloads`.
- Les autres pages et les simulations de l’ancien site restent à migrer.

## Gestion dans Payload

Dans `/admin`, ouvrir **Pages** pour modifier la présentation de `downloads`,
et **Site marketing → Ressources (Downloads)** pour gérer les fichiers affichés.
Publier les documents pour les rendre visibles. Un brouillon nouveau reste privé.
Le site lit les contenus publiés à chaque requête, y compris pour un administrateur
connecté : aucun mode de prévisualisation des brouillons n’est activé ici.

Le champ **Format** classe les ressources : `PDF` dans les notes, `ZIP` dans les
logiciels, toute autre valeur dans les autres ressources. **Ordre** contrôle le tri.
Une URL peut être HTTP(S), ou relative à ce site, par exemple
`/legacy/Telechargement/Orbits101%20Installer%20Beta%200.96.zip`.
Encoder les espaces et caractères spéciaux dans les chemins.

Les fichiers de ce lot sont publics, comme sur l’ancien site. Dépublier une fiche
retire son affichage du catalogue mais ne révoque pas l’URL publique du fichier.
Le téléversement via le CMS et le stockage de documents privés ne sont pas inclus.
Ajouter un nouveau fichier nécessite un hébergement HTTP(S) ou un fichier dans
`public/` livré au prochain déploiement. Ne pas y placer les ressources privées des cours.

## Import sur un autre environnement

Utiliser la configuration de la base cible et appliquer les migrations existantes
avant l’import. Ce lot ne modifie pas le schéma de base de données.

```sh
pnpm exec tsx scripts/import-legacy-downloads.ts
pnpm exec tsx scripts/import-legacy-downloads.ts --apply
```

La première commande affiche les ajouts prévus sans écrire. La seconde crée les
cinq fiches et la page, publiées. L’import vérifie d’abord la présence des fichiers.
Il préserve tout document existant portant le même slug, même en brouillon, et peut
être relancé après une interruption. Il est réservé à une exécution administrative
locale : l’API locale contourne volontairement les droits pour cet import.

L’absence de ressources publiées affiche un état vide. Une indisponibilité de la
base affiche un message explicite sans réutiliser une copie des anciens contenus.

## Redirections

| Ancienne adresse | Destination |
| --- | --- |
| `/index.html/Download.html`, `/Download.html` | `/downloads` |
| `/index.html/Fichiers/:path`, `/Fichiers/:path` | `/legacy/Fichiers/:path` |
| `/index.html/Telechargement/:path`, `/Telechargement/:path` | `/legacy/Telechargement/:path` |

Les redirections permanentes 308 seront actives sur le domaine lorsque la nouvelle
application y sera déployée. Les fichiers PDF/ZIP sont servis par Next.js depuis
`public/`, sans dépendre de l’hébergement historique.

## Validation réalisée

- Sauvegarde préalable publiée sur GitHub : `dda87fb` (même arbre de fichiers que
  le commit local initial `d5fe8fd`).
- Lint et TypeScript réussis ; 16 tests réussis ; build de production réussi.
- Import réel : cinq ressources et une page dans la base configurée localement.
- Deuxième import : six documents préservés, aucun doublon.
- Rendu navigateur de la compilation de production sur ordinateur et à 390 px.
- Aucun message d’erreur dans la console du navigateur lors de la vérification.
- Cinq fichiers servis en HTTP 200 avec types PDF/ZIP et tailles attendues.
- Ancienne page et cinq anciens liens de fichiers vérifiés en HTTP 308.

La bascule du domaine et le déploiement de production ne font pas partie de ce lot.
