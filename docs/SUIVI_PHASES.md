# SpaceOrbitLAB — Plan et suivi des phases

Dernière mise à jour : **13 septembre 2026**.

Ce document sert de référence pour suivre le projet depuis son socle actuel jusqu’à la plateforme complète. Il doit être mis à jour après chaque lot de travail, validation ou changement de périmètre.

## 1. Origine et périmètre du plan

Le plan reprend les orientations de la tâche **« Créer site et app de mécanique orbit »**, le [README](../README.md), les [notes de rencontre avec Richard](../notes%20rencontre%20Richard.txt) et le code local. La numérotation ci-dessous formalise ces orientations en phases de réalisation : elle n’était pas définie dans les échanges initiaux.

La priorité immédiate demandée était la mise en place de Next.js et des plateformes, avec **Payload également responsable de l’authentification**. Les phases pédagogiques décrivent la suite du projet; leur présence ici ne signifie pas qu’elles sont déjà développées.

### État final visé

- Une application Next.js en anglais, déployée sur Vercel, dont le code est versionné sur GitHub.
- Un site marketing reprenant l’identité, les contenus et les ressources utiles de la démo SpaceOrbitLAB.
- Un catalogue avec des aperçus gratuits et un accès payant par achat unique, avec codes de réduction pour les cohortes.
- Un espace étudiant avec connexion par courriel et mot de passe, leçons, ressources, quiz et progression persistante.
- Des simulations d’orbites képlériennes, de transferts de Hohmann et des six éléments orbitaux en 3D.
- Payload pour administrer les contenus, les comptes et les droits; Neon pour les données PostgreSQL.
- Stripe pour les paiements; Google Analytics 4 avec consentement pour les visites et conversions.
- Un stockage adapté aux ressources pédagogiques et un service de courriel transactionnel, encore à choisir.

### Décisions restant à prendre

| Décision | État / conséquence | À résoudre avant |
| --- | --- | --- |
| Vente séparée des quatre cours ou achat du programme complet | Achat unique retenu comme orientation; périmètre de l’achat non confirmé. Le programme complet était une suggestion. | Phases 4 et 6 |
| Prix, devise et règles des codes de réduction | Non définis; nécessaires au catalogue commercial et aux tests Stripe. | Phase 6 |
| Service de courriel et adresse d’envoi | À choisir et configurer. | Phase 3 |
| Stockage des PDF, vidéos et fichiers privés | À choisir selon formats, volumes et contrôle d’accès. | Phase 4 |
| Règles des quiz et de complétion | Seuil de réussite, tentatives et impact sur la progression à définir. | Phase 7 |
| Certificat | Les notes demandent une information sur le certificat; l’émission automatisée n’a pas été confirmée. | Phase 7 |
| Liste des contenus de lancement | Quatre cours présentés dans la démo; déterminer lesquels seront prêts au lancement. | Phases 4 et 9 |

## 2. État actuel vérifié

L’inventaire ci-dessous repose sur le code au 13 septembre 2026. La tâche **« Mettre en place les plateformes »** travaille simultanément sur les services distants : son résultat devra être reporté ici avec une date et des preuves de validation.

| Domaine | Présent aujourd’hui | Limite actuelle |
| --- | --- | --- |
| Démo | Pages HTML, images, PDF, Orbits101, Python/Pyodide et outils orbitaux dans `index.html/`. | Conservée séparément; non publiée par la nouvelle application Next.js. |
| Next.js | App Router, TypeScript, page d’attente anglaise et route `/api/health`. | Aucun parcours marketing ou étudiant complet. La santé serveur ne teste pas la base. |
| Payload | Administration, API, collections `admins`, `users`, `pages`, brouillons et texte riche. | Aucun modèle de cours; aucun rendu public des pages CMS. |
| Authentification | Séparation administrateur/étudiant et droits d’accès dans le code. | Inscription publique fermée; aucun formulaire étudiant ni service de courriel. Parcours réel avec base à valider. |
| Neon | Adaptateur PostgreSQL, migration initiale et scripts de migration. | Configuration distante et application effective des migrations non validées dans ce document. |
| Stripe | Client serveur et vérification de signature du webhook. | Un événement signé reçoit encore HTTP 501; aucun paiement ni droit d’accès traité. |
| Analytics | Composant de consentement et chargement conditionnel GA4. | Propriété connectée, navigation et événements métier à valider/compléter. |
| Livraison | Configuration Vercel et workflow GitHub : lint, types, tests, build. | Lors de l’inventaire, le socle est encore non suivi par Git; aucun déploiement validé ici. |

**Validation antérieure :** la tâche de création du socle rapporte lint, TypeScript, compilation, 7 tests et contrôles HTTP réussis. Ces vérifications n’ont pas été relancées pour cette modification documentaire. Elles ne prouvent pas la connexion à Neon ni un parcours d’achat fonctionnel.

## 3. Tableau de pilotage

Statuts : **À faire**, **En cours**, **À valider**, **Terminée**, **Bloquée**. Une phase n’est terminée que lorsque ses critères de sortie sont vérifiés et consignés. Les cases cochées ci-dessous indiquent un livrable observé, pas la validation complète de sa phase.

| Phase | Objectif | Statut au 13/09/2026 | Dépendances | Prochain résultat attendu |
| --- | --- | --- | --- | --- |
| 0 | Cadrage et inventaire | En cours | — | Trancher les décisions produit encore ouvertes. |
| 1 | Socle local Next.js / Payload | En cours — contrôles réussis | 0, pour le périmètre technique | Enregistrer le commit après renseignement de l’identité Git. |
| 2 | Plateformes et environnement de validation | En cours, dans une autre tâche | 1 | Base migrée, CMS initialisé et preview opérationnelle. |
| 3 | Comptes et accès étudiants | À faire | 2 | Inscription, connexion et récupération fonctionnelles. |
| 4 | CMS pédagogique et ressources | À faire | 2; 3 pour tester les accès | Un module pilote publié avec ressources protégées. |
| 5 | Site marketing et catalogue | À faire | 4 pour les contenus dynamiques | Site anglais navigable relié au CMS. |
| 6 | Achat et droits payants | À faire | 3, 4 et offre commerciale définie | Achat test donnant le bon accès, une seule fois. |
| 7 | Espace étudiant, progression et quiz | À faire | 3, 4, 6 pour les parcours payants | Parcours pédagogique complet et persistant. |
| 8 | Simulations pédagogiques 2D/3D | À faire; démo réutilisable | 3, 4, 7 pour l’intégration finale | Simulations intégrées et calculs validés. |
| 9 | Recette, lancement et exploitation | À faire | 2 à 8 | Production validée et procédure de maintenance disponible. |

Ordre principal : **socle → plateformes → comptes et contenus → marketing et achat → apprentissage → simulations → lancement**. Les maquettes publiques et l’inventaire pédagogique peuvent avancer avant que les services soient tous prêts; la validation finale de leurs accès dépend des phases indiquées.

## 4. Détail des phases

### Phase 0 — Cadrage et reprise de la démo

**But :** disposer d’un périmètre de lancement explicite et réutiliser les supports existants.

- [x] Retrouver les orientations initiales et identifier le stack demandé.
- [x] Identifier la démo, les ressources et le socle Next.js dans le dépôt.
- [ ] Inventorier les pages, quatre cours, PDF, images, téléchargements et simulations à reprendre.
- [ ] Rapprocher les contenus des notes de Richard : « Applied », contact et biographie, témoignages, « Understanding Motion in Space », information sur le certificat et liens partenaires.
- [ ] Classer chaque élément : à reprendre, à corriger, à réécrire ou à reporter.
- [ ] Définir l’offre commerciale et la liste des contenus prêts pour le lancement.

**Livrables :** inventaire éditorial, arborescence cible, décisions produit renseignées dans ce document.

**Sortie :** chaque contenu de lancement possède une destination et les décisions nécessaires aux phases suivantes sont prises.

### Phase 1 — Stabiliser le socle local

**But :** rendre l’application installable et reproductible avant son branchement distant.

- [x] Installer Next.js, TypeScript, Payload et l’adaptateur PostgreSQL.
- [x] Séparer les collections administrateurs et étudiants et définir les règles d’accès.
- [x] Ajouter la collection de pages, la migration initiale, Stripe et le consentement Analytics.
- [x] Ajouter les scripts de vérification, la configuration Vercel et le workflow CI.
- [ ] Vérifier les fichiers à versionner et enregistrer le socle dans Git.
- [x] Confirmer une installation depuis le fichier de verrouillage et les contrôles sur cette version.

**Livrables :** code versionné, migration initiale, `.env.example`, guide de démarrage et résultats de vérification.

**Sortie :** installation reproductible; `pnpm lint`, `pnpm typecheck`, `pnpm test` et `pnpm build` réussis sur la version enregistrée. La connexion distante est couverte en phase 2.

**Vérification du 13 septembre 2026 :** copie du socle dans un dossier temporaire vierge, sans `.env`, `node_modules` ni `.next` du projet. Installation `pnpm install --frozen-lockfile` réussie (645 paquets, cache pnpm réutilisé), puis lint, TypeScript, 7 tests sur 7 et compilation de production réussis. Environnement : Windows, Node.js 24.19.0 et pnpm 11.19.0. La compilation utilise uniquement des valeurs fictives pour Payload et PostgreSQL; aucun accès Neon ou Stripe n’est validé. Les fichiers `.env`, dépendances et sorties de compilation sont ignorés par Git. Seule correction : normalisation des espaces dans la migration générée, sans changement du SQL; lint et TypeScript relancés avec succès après cette correction. Contrôle des espaces Git réussi; 39 fichiers préparés pour le commit. Le commit reste en attente du nom et du courriel Git demandés à Thierry; aucun push effectué.

### Phase 2 — Connecter les plateformes

**But :** obtenir un environnement de validation réel sans confondre preview et production.

- [ ] Reporter le résultat de la tâche « Mettre en place les plateformes » et réutiliser les projets qu’elle a configurés.
- [ ] Vérifier le dépôt GitHub, publier la version du socle et obtenir une exécution CI réussie.
- [ ] Configurer Neon avec des bases/branches distinctes pour développement, preview et production.
- [ ] Configurer les connexions poolée et directe et appliquer les migrations dans l’environnement cible.
- [ ] Initialiser le premier administrateur avant d’exposer publiquement le CMS relié à cette base.
- [ ] Relier Vercel au dépôt, configurer les variables par environnement et déployer une preview.
- [ ] Vérifier dans cette preview : page publique, santé serveur, connexion CMS, création d’un étudiant et persistance d’un contenu.
- [ ] Préparer Stripe en mode test, sans activer le webhook incomplet comme destination de paiement.
- [ ] Relier la propriété GA4 et vérifier le comportement avec acceptation, refus et retrait du consentement.
- [ ] Documenter les environnements, liens de consoles et procédures de migration, sans copier de secrets.

**Livrables :** preview accessible, base migrée, accès administrateur opérationnel, registre de configuration et preuves CI.

**Sortie :** un contenu créé dans Payload persiste après redémarrage et les previews n’utilisent pas la base de production. Les intégrations Stripe préparées ne sont pas encore considérées comme un parcours d’achat terminé.

### Phase 3 — Construire l’authentification étudiante

**But :** permettre aux visiteurs de créer et utiliser leur propre compte.

- [ ] Créer les écrans anglais d’inscription, connexion, déconnexion et compte.
- [ ] Ouvrir la création publique de comptes étudiants avec validations adaptées, sans ouvrir la création d’administrateurs.
- [ ] Configurer le service de courriel, la vérification d’adresse et la réinitialisation du mot de passe.
- [ ] Gérer les sessions expirées, messages d’erreur et redirections après connexion.
- [ ] Protéger les routes étudiantes et vérifier les autorisations côté serveur et API.
- [ ] Vérifier l’isolation entre comptes, le refus d’accès étudiant au CMS et les restrictions des opérations Payload locales.

**Livrables :** parcours d’identité complet et service de courriel opérationnel.

**Sortie :** un nouveau compte reçoit les courriels, se connecte, récupère son accès et ne peut consulter ni modifier les données d’un autre étudiant.

### Phase 4 — Structurer le CMS pédagogique

**But :** permettre la publication des cours sans modifier le code pour chaque leçon.

- [ ] Définir les collections et relations : cours, modules, leçons et ressources; préparer les liens vers quiz et simulations.
- [ ] Définir l’ordre des contenus, les slugs, les brouillons et le caractère gratuit ou payant.
- [ ] Choisir et configurer le stockage des fichiers et, si nécessaire, des vidéos.
- [ ] Ajouter le rendu des contenus Payload dans Next.js.
- [ ] Importer un module pilote à partir des supports existants et valider sa mise en page.
- [ ] Protéger les ressources privées côté serveur, y compris leur téléchargement direct.
- [ ] Importer ensuite les contenus retenus pour le lancement et versionner les migrations.

**Livrables :** modèle pédagogique, stockage, module pilote, contenus de lancement et guide d’édition.

**Sortie :** un administrateur publie une leçon visible au bon public; les brouillons et ressources payantes restent inaccessibles sans autorisation. Les fichiers déjà publics dans l’historique Git ne deviennent pas privés par cette migration.

### Phase 5 — Migrer le site marketing

**But :** remplacer la page d’attente par le site SpaceOrbitLAB relié au CMS.

- [ ] Reprendre l’identité visuelle, les images et la structure utile de la démo.
- [ ] Construire accueil, objectifs/introduction, catalogue, détails des cours, contact/biographie et téléchargements.
- [ ] Intégrer les témoignages et les corrections éditoriales retenues avec Richard.
- [ ] Afficher les aperçus gratuits et les appels à l’inscription ou à l’achat.
- [ ] Traiter le formulaire de contact et ses retours utilisateur via le service retenu.
- [ ] Préparer titres, descriptions, partage social, sitemap et correspondances des anciennes URL.
- [ ] Adapter la navigation et les pages aux téléphones et tablettes; vérifier clavier et lisibilité.

**Livrables :** site public anglais, contenu CMS, catalogue et plan de redirections.

**Sortie :** le visiteur comprend l’offre, consulte un aperçu et atteint le parcours étudiant; les liens et formulaires sont fonctionnels. Les ajustements mobiles finaux seront repris en phase 9, conformément aux notes.

### Phase 6 — Activer les achats et les droits d’accès

**But :** transformer un paiement confirmé en un droit d’accès fiable.

- [ ] Confirmer l’offre, les prix, la devise et les codes de réduction.
- [ ] Créer les produits/prix Stripe de test et le parcours Checkout lié à un utilisateur authentifié.
- [ ] Ajouter les données de commandes, événements traités et droits d’accès dans Payload/Neon.
- [ ] Remplacer le webhook préparatoire par un traitement durable et idempotent des événements utiles.
- [ ] Accorder l’accès depuis la confirmation serveur Stripe et gérer les événements répétés ou retardés.
- [ ] Prévoir annulation, échec, remboursement et politique de maintien/retrait des droits.
- [ ] Construire les pages de retour et afficher l’état de l’achat dans le compte.
- [ ] Tester les codes de réduction et la séparation des données Stripe de test et de production.

**Livrables :** achat unique opérationnel en test, historique d’achat et contrôle des droits.

**Sortie :** un achat test donne exactement l’accès acheté; rejouer l’événement ne crée aucun doublon; une visite de la page de succès sans paiement ne débloque rien. L’échec, l’annulation et le remboursement produisent l’état attendu.

### Phase 7 — Livrer l’espace d’apprentissage

**But :** permettre de suivre le cours et retrouver son avancement.

- [ ] Construire le tableau de bord, la liste des cours accessibles et la navigation entre leçons.
- [ ] Enregistrer la progression par étudiant et la restaurer à la reconnexion.
- [ ] Définir les questions, réponses, explications et règles de réussite des quiz dans le CMS.
- [ ] Enregistrer les tentatives et calculer les résultats côté serveur.
- [ ] Afficher la progression et les conditions de complétion du cours.
- [ ] Ajouter l’information sur le certificat; ne développer son émission automatisée que si elle est retenue.
- [ ] Tester les parcours gratuit, payant, inachevé et terminé.

**Livrables :** tableau de bord étudiant, lecteur de leçons, quiz et progression persistante.

**Sortie :** un étudiant reprend une leçon sur une nouvelle session, retrouve ses résultats et ne peut écrire la progression d’un autre compte.

### Phase 8 — Intégrer les simulations 2D et 3D

**But :** convertir la démo scientifique en activités intégrées au cours.

- [ ] Examiner les fonctions Python et les simulations circulaire/elliptique pour décider quoi réutiliser.
- [ ] Définir les entrées, unités, limites et résultats attendus de chaque simulation.
- [ ] Intégrer les orbites képlériennes et les transferts de Hohmann en 2D.
- [ ] Ajouter la manipulation des six éléments orbitaux et leur représentation 3D.
- [ ] Corriger le placement des résultats, la liste des simulations et la lisibilité du code signalés dans les notes.
- [ ] Ajouter les fonctions prédéfinies, explications, ressources Python et guide Orbits101 utiles aux activités.
- [ ] Appliquer l’accès authentifié demandé dans les notes et les restrictions payantes retenues.
- [ ] Gérer chargement, erreurs, réinitialisation et performances sur les appareils cibles.
- [ ] Valider les calculs sur des cas de référence et faire relire les explications pédagogiques.

**Livrables :** activités de simulation intégrées, cas de référence documentés et aide utilisateur.

**Sortie :** les résultats respectent les valeurs et tolérances définies; les commandes 2D/3D sont utilisables et chaque simulation est reliée à une leçon. Octave reste une piste ultérieure, comme dans les notes initiales.

### Phase 9 — Valider et lancer la plateforme

**But :** publier une version utilisable et maintenable.

- [ ] Effectuer la recette complète : visite → inscription → aperçu → achat → leçon → quiz → simulation → reprise de progression.
- [ ] Tester les droits par accès direct aux URL, API et fichiers, ainsi que les scénarios d’échec essentiels.
- [ ] Faire relire les contenus, liens, formules et activités par le responsable pédagogique.
- [ ] Finaliser l’affichage mobile, l’accessibilité, les performances et les navigateurs cibles.
- [ ] Compléter GA4 pour les navigations et événements de conversion, sans données de compte et selon le consentement.
- [ ] Finaliser les informations de confidentialité, conditions de vente et politique de remboursement adaptées à l’offre.
- [ ] Préparer sauvegarde/restauration, journaux d’erreurs, suivi de disponibilité et procédure de retour à la version précédente.
- [ ] Exécuter la CI sur la version de lancement et consigner la recette avec la version testée.
- [ ] Configurer les services de production, appliquer les migrations et vérifier l’administrateur.
- [ ] Passer Stripe en production lorsque le parcours est validé; vérifier les courriels et le stockage de production.
- [ ] Déployer, valider l’URL Vercel, puis effectuer la bascule de `spaceorbitlab.com` et les redirections.
- [ ] Effectuer les contrôles après lancement et enregistrer les anomalies restantes.

**Livrables :** plateforme publique, recette signée par le responsable du projet, guide d’exploitation et liste des améliorations ultérieures.

**Sortie :** le parcours complet fonctionne en production, les contenus de lancement sont disponibles et une procédure de restauration a été vérifiée.

## 5. Règles de mise à jour

1. À chaque lot terminé, cocher les livrables réellement réalisés et actualiser le tableau de pilotage.
2. Ajouter une entrée au journal avec date, phase, changements, validation, limites et prochaine action.
3. Distinguer **code présent**, **test local réussi**, **service configuré** et **parcours validé en production**.
4. Pour une validation, indiquer la commande ou le scénario, son résultat, la version/commit et l’environnement. Si une information manque, l’écrire explicitement.
5. Pour un blocage, consigner ce qui manque, qui peut le résoudre et la condition de reprise.
6. Ne jamais inscrire de mot de passe, clé API, secret ou chaîne de connexion dans ce fichier.
7. Actualiser les décisions et dépendances lorsque le périmètre change; ne pas attribuer de pourcentage global sans estimation de charge.

### Journal d’avancement

| Date | Phase | Réalisation / constat | Validation et limite | Prochaine action |
| --- | --- | --- | --- | --- |
| 2026-09-13 | 1 | Installation dans un dossier vierge et validation du socle local; revue des fichiers à versionner. | Installation figée, lint, types, 7/7 tests et build réussis sous Node 24.19.0 / pnpm 11.19.0. Configuration fictive pour compiler, aucun test de connexion distante. | Renseigner l’identité Git puis enregistrer le commit; phase non clôturée tant que le commit manque. |
| 2026-09-13 | 1 | Socle Next.js/Payload, migration, Stripe préparatoire, consentement GA4 et CI présents. | Tâche initiale : lint, types, build, 7 tests et HTTP réussis. Version locale non commitée lors de l’inventaire; services distants non validés ici. | Versionner puis valider les plateformes. |
| 2026-09-13 | 2 | Configuration des plateformes en cours dans « Mettre en place les plateformes ». | Résultat final non encore repris; ne pas considérer la phase terminée. | Reporter environnements configurés et tests réels. |
| 2026-09-13 | 0–9 | Création du présent plan, rapprochement avec les échanges initiaux et inventaire du code. | Revue documentaire; aucun test applicatif relancé pour ce document. | Mettre à jour la phase 2, puis préciser les décisions des phases 3 et 4. |

### Modèle pour une prochaine mise à jour

```text
Date :
Phase et nouveau statut :
Travail réalisé :
Fichiers / commit / environnement :
Vérifications effectuées et résultats :
Limites ou blocages (responsable et condition de reprise) :
Décisions prises :
Prochaine action :
```
