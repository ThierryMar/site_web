# Audit de SpaceOrbitLAB — 28 septembre 2026

## Conclusion

La plateforme dispose d'un site public publié, d'un système de comptes étudiants,
d'un CMS pédagogique, de téléchargements publics et de deux simulations Python
exécutables. Le parcours d'apprentissage reliant un étudiant à ses cours, ses
leçons, ses résultats et ses simulations reste à construire.

| Domaine | État | Limite principale |
| --- | --- | --- |
| Comptes | Inscription, connexion, profil et récupération développés ; recette de compte documentée le 27 septembre | Courriel de récupération à valider de bout en bout ; pas de vérification d'adresse |
| Création de cours | Collections CMS et quatre cours en brouillon présents | Aucun lecteur étudiant ni droit d'inscription ; une seule leçon de test |
| Téléchargements | Quatre PDF et un ZIP accessibles en production | Fichiers publics ; pas de téléversement CMS ni de stockage privé |
| Python | Deux simulations fonctionnelles dans le navigateur | Non reliées aux comptes, aux leçons ou au CMS ; pas de sauvegarde |
| Livraison | Site publié accessible | La compilation de l'arbre local actuel échoue au contrôle TypeScript |

## Périmètre et méthode

- Lecture de l'arbre de travail local basé sur `ff40fd1`, incluant les modifications
  déjà présentes et les fichiers non suivis. Aucun correctif applicatif effectué.
- Contrôles HTTP anonymes sur `https://spaceorbitlab.com`.
- Exécution des simulations dans le navigateur sur le site publié.
- Consultation PostgreSQL en transaction `READ ONLY`, limitée aux contenus
  pédagogiques. La connexion est celle du poste local ; le guide de déploiement
  du 27 septembre indique qu'elle est partagée avec la production. L'identité
  des connexions distantes Vercel n'a pas été revérifiée dans cet audit.
- Exécution de `pnpm test`, `pnpm lint`, `pnpm typecheck` et `pnpm build`.
- Aucun compte créé, aucune donnée distante modifiée et aucun courriel envoyé.
  L'inscription et la connexion complètes n'ont donc pas été rejouées aujourd'hui.

## 1. Création et utilisation des comptes

### Présent

- Pages `/inscription`, `/connexion`, `/mot-de-passe-oublie`,
  `/reinitialiser-mot-de-passe` et `/mon-compte`.
- Inscription publique par une Server Action dédiée, avec courriel, mot de passe
  de 12 à 128 caractères et confirmation. L'API générique de création demeure
  réservée aux administrateurs.
- Séparation des comptes étudiants `users` et administrateurs `admins`.
- Session de deux heures ; verrouillage de dix minutes après cinq échecs.
- Modification du nom, consultation du courriel et déconnexion de toutes les
  sessions depuis le compte.
- Récupération de mot de passe via Resend, jeton valable une heure et révocation
  des sessions après réinitialisation.

### Vérification et limites

Le formulaire d'inscription est visible en production. Les pages d'inscription,
connexion et récupération répondent HTTP 200. Un visiteur anonyme sur
`/mon-compte` est redirigé en HTTP 307 vers `/connexion`.

La recette du 27 septembre dans `ESPACE_UTILISATEUR.md` documente la création
d'un compte temporaire, la connexion API, l'accès protégé, la modification du
profil et la révocation de session. Cette preuve antérieure est distincte des
contrôles effectués aujourd'hui.

Il reste à :

- Vérifier la réception réelle du courriel, le lien, son expiration et son usage
  unique dans un parcours complet. La présence de l'adaptateur ne prouve pas la
  livraison des messages.
- Ajouter la confirmation du courriel à l'inscription si elle est requise :
  aucune vérification d'adresse n'est configurée actuellement.
- Prévoir les protections contre les inscriptions/demandes de récupération
  automatisées : aucune limitation dédiée n'est visible dans les Server Actions
  examinées. Le verrouillage existant concerne les échecs de connexion.
- Harmoniser les formulaires en français avec le site public en anglais.

Le compte reste un espace de profil : il ne contient ni liste de cours inscrits,
ni progression, ni historique de simulations.

Sources : `src/collections/Users.ts`, `src/access.ts`,
`src/app/(frontend)/auth-actions.ts`, `src/lib/email.ts`,
`src/app/(frontend)/(authentification)/mon-compte/page.tsx`.

## 2. Création et consultation des cours

### Ce que l'administration permet déjà

Payload possède des collections Cours, Leçons, Ressources, Exercices et Quiz,
avec titres, slugs, ordre, relations, brouillons et publication. Les leçons
acceptent du texte riche, une URL vidéo et une durée. Les exercices peuvent
contenir un indice et un corrigé. Les quiz prévoient des questions, des choix,
des bonnes réponses et un seuil de réussite.

La page publique `/courses` lit les aperçus marketing publiés. Elle présente
quatre cours ; il s'agit d'une présentation de l'offre, pas du lecteur de cours.

### Contenu réellement présent dans la base consultée

| Collection | Contenu |
| --- | --- |
| Cours | 4, tous en brouillon |
| Leçons | 1 publiée, intitulée « Test de leçon », rattachée au premier cours |
| Ressources de cours | 0 |
| Exercices | 0 |
| Quiz | 0 |

Les quatre aperçus publics sont : Basic Astronomy and Celestial Mechanics,
Foundations of Astrodynamics, Applied Astrodynamics and Space Situational
Awareness, et Remote Sensing from Space: Orbit-to-Image Physics.

### Blocage du parcours étudiant

`courseAccess` réserve actuellement toutes les opérations pédagogiques aux
administrateurs, y compris la lecture. Les tests confirment que les étudiants
ne peuvent pas lire ces contenus. Les cinq API pédagogiques renvoient bien
HTTP 403 aux visiteurs anonymes en production.

**Publier un cours dans Payload ne le rend donc pas accessible à un étudiant.**

Il manque le mécanisme d'inscription/d'attribution d'accès, les pages de lecture
des leçons, le tableau de bord, la progression, la soumission et la correction
des quiz, ainsi que les résultats persistants. Aucun modèle de module distinct
n'est présent : les leçons sont rattachées directement au cours.

Stripe reste préparatoire : pas de Checkout ni d'attribution d'accès après
paiement. Le webhook local retourne volontairement HTTP 501 pour un événement
signé valide tant que le traitement n'est pas implémenté. Aucun achat n'a été
tenté dans cet audit.

Sources : `src/collections/Courses.ts`, `src/collections/contentFields.ts`,
`src/collections/Marketing.ts`, `src/components/MarketingPage.tsx`,
`src/app/api/stripe/webhook/route.ts`.

## 3. Téléchargements et ajout de fichiers

La page `/downloads` est reliée au CMS. L'administrateur peut créer une fiche,
modifier son titre, sa description, son format, son ordre et son URL, puis la
publier. Il ne peut pas encore téléverser un fichier directement dans Payload.

Cinq ressources publiées ont été observées et contrôlées en production :

| Ressource | Format | Vérification |
| --- | --- | --- |
| Astrodynamics acronyms | PDF | HTTP 206, signature PDF |
| SOL Part 0 | PDF | HTTP 206, signature PDF |
| SOL Part I.I | PDF | HTTP 206, signature PDF |
| SOL Part I.II | PDF | HTTP 206, signature PDF |
| Orbits101 Installer Beta 0.96 | ZIP | HTTP 206, signature ZIP |

Les requêtes utilisaient une plage de huit octets : elles prouvent la
disponibilité des URL, le type et la signature des fichiers, pas l'intégrité
complète d'un téléchargement distant ni le fonctionnement de l'installateur.
Les tests locaux vérifient aussi l'identité des cinq fichiers avec les originaux.

Les fichiers sont servis depuis `public/legacy`. Toute personne disposant de
l'URL peut y accéder sans compte. Dépublier une fiche masque son lien dans le
catalogue, mais ne protège pas le fichier statique. Ce comportement convient
à des ressources gratuites ; des ressources réservées aux inscrits demanderaient
un stockage privé et une vérification d'accès au téléchargement.

La section vidéos affiche encore « Coming Soon ».

Sources : `src/collections/Marketing.ts`, `src/lib/public-downloads.ts`,
`src/app/(frontend)/downloads/page.tsx`, `public/legacy/Fichiers`,
`public/legacy/Telechargement`.

## 4. Simulations Python

### Fonctionnement vérifié en production

Python s'exécute sur l'appareil du visiteur via Pyodide, avec NumPy, SciPy,
Matplotlib et la bibliothèque SOL. Aucun serveur de calcul Python n'est présent.
Le code est modifiable et produit du texte ainsi qu'une image Matplotlib.

| Cas exécuté | Résultat observé |
| --- | --- |
| Orbite circulaire, altitude 400 km | 7,669 km/s, période 92,56 min, graphique produit |
| Orbite elliptique, a = 12 000 km, e = 0,45 | Périgée 6 600 km, apogée 17 400 km, période 218,04 min, graphique produit |
| Excentricité invalide e = 1,2 | Erreur explicite : excentricité attendue entre 0 et 1 |
| Reset Code après modification | Code initial restauré et exécution réussie |

Ces contrôles valident le fonctionnement des exemples ; ils ne constituent pas
une validation scientifique complète des fonctions SOL et des cas limites.

### Intégration restante

- Accès sans connexion, contrairement au souhait « obliger les utilisateurs à
  se connecter » des notes de rencontre.
- Page HTML historique servie par réécriture d'URL, indépendante du CMS.
  La collection Simulations existe mais contient zéro entrée ; ajouter une fiche
  dans cette collection ne crée pas un laboratoire Python sur la page actuelle.
- Aucun rattachement à une leçon, aucune sauvegarde du code ou des résultats et
  aucun suivi par étudiant.
- Deux exemples seulement dans l'interface. Aucun atelier Hohmann ni interface
  3D interactive. Les angles orbitaux existent dans le code de l'ellipse mais
  le graphique affiché reste une projection 2D.
- Aucune interruption ni durée maximale d'exécution dans le code examiné ; pas
  de Web Worker. Un code utilisateur très coûteux peut bloquer l'onglet. Ce cas
  n'a volontairement pas été provoqué pendant l'audit.
- Instructions de l'ellipse incohérentes : le texte demande de modifier
  `semi_major_axis_km` et `eccentricity`, alors que le code utilise `a` et `e`.

Sources : `next.config.mjs`, `public/legacy/Simulations.html`,
`public/legacy/simulations.js`, `public/legacy/SOL.py` et `SOL_Tools`.

## 5. Vérification technique et priorités

| Contrôle | Résultat du 28 septembre |
| --- | --- |
| Tests automatisés | 20/20 réussis |
| ESLint | Réussi |
| TypeScript | Échec : trois erreurs TS2531 dans `output/verify-account.ts`, lignes 26, 29 et 41 |
| Build de production local | Compilation initiale réussie, puis échec sur les mêmes erreurs TypeScript |
| Site publié | Pages publiques contrôlées accessibles ; compte anonyme protégé |

Le fichier de vérification est inclus par les motifs `**/*.ts` de `tsconfig.json`.
Le site déjà déployé fonctionne, mais l'arbre local actuel ne passe pas les
contrôles nécessaires à une nouvelle livraison. La correction peut consister à
traiter les valeurs nulles dans ce script ou à isoler les scripts de recette
hors du périmètre de compilation de l'application.

Le dépôt contient de nombreuses modifications non enregistrées. Les documents
de déploiement indiquent une publication depuis un arbre local ; le commit
`ff40fd1` seul ne suffit donc pas à représenter les fonctionnalités observées.
Plusieurs paragraphes historiques du README et du suivi des phases sont devenus
inexacts, notamment ceux annonçant que les formulaires et modèles de cours
n'existent pas.

Ordre de travail recommandé :

1. Rétablir les contrôles TypeScript/build, enregistrer une version reproductible
   et confirmer une base distincte pour les essais de développement.
2. Finaliser la recette des comptes, particulièrement les courriels de
   récupération, puis appliquer l'accès authentifié aux simulations si cette
   exigence est maintenue, en couvrant aussi l'URL HTML historique directe.
3. Livrer un cours pilote complet : contenu réel, attribution d'accès, lecteur
   de leçons et affichage dans « Mon compte ». C'est le prochain jalon produit
   le plus utile.
4. Ajouter le téléversement et le stockage des ressources ; décider explicitement
   lesquelles sont publiques et lesquelles sont réservées aux inscrits.
5. Relier les simulations aux leçons et comptes, ajouter sauvegarde et
   interruption, puis développer Hohmann et la 3D. Compléter ensuite quiz,
   progression et achats selon les priorités pédagogiques et commerciales.

Le premier parcours de validation à viser est : création de compte → connexion
→ accès à un cours pilote → lecture d'une leçon → téléchargement de sa ressource
→ simulation associée → retour ultérieur avec progression conservée.
