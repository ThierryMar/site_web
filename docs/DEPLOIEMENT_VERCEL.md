# Déploiement Vercel — 27 septembre 2026

## Quiz COE — 6 octobre 2026

### Quiz regroupés par cours

- Publication `dpl_5m4hU9zwWJ3Cb46kKVKp9vCSGURR`, production READY, source `2afab31`.
- Mes quiz affiche quatre sections correspondant aux quatre cours du site. SOL Part II - COE exercices est dans le cours 2, Foundations of Astrodynamics, avec le quiz d’entraînement existant et le rappel du dernier résultat.
- Vérifications : types, ESLint et compilation Vercel réussis ; navigateur de production confirme quatre sections, une seule entrée COE dans le cours 2, sections vides explicites, accès au quiz et mobile sans débordement. Compte temporaire supprimé, aucun courriel envoyé. Aucune migration.

### Note finale et dernier résultat

- Publication `dpl_9wsyUHm8moAZo9k66KKKXax2Csn8`, production READY ; source `0b269d6`.
- URL immuable : `https://spaceorbitlab-5i0d6t190-space-orbit-lab.vercel.app`.
- Les 43 questions sont notées côté serveur (1 point par question, toutes sous-réponses correctes ; valeurs numériques à 1 %, angles à 0,1° et interprétation circulaire du vecteur arrondi acceptée). Les anciennes réponses libres sont remplacées par des champs structurés.
- Dernière note, pourcentage, date, version du barème et réponses conservés dans le compte ; rappel dans Mes quiz, consultation du corrigé et nouvelle tentative. Une nouvelle soumission remplace le dernier résultat ; le résultat reste disponible après rechargement ou nouvelle session.
- Migration additive `20261006_134519_coe_result` appliquée : colonne JSONB `users.last_coe_result`. Identité et score calculés côté serveur, champ non modifiable via les API génériques.
- Vérifications : 33 tests, types, lint et build réussis ; deux soumissions via navigateur en production, comparaison de la note et des données persistées, résistance à une modification par API, nouvelle session, rechargement, rappel Dashboard et mobile sans débordement. Compte temporaire supprimé ; aucun courriel envoyé.

### Corrigé provisoire

- Mise à jour publiée : `dpl_GcZgWydMSRCUhcEfgb1YrzbK7nz9`, production READY, source `f576e60`.
- URL immuable : `https://spaceorbitlab-iihx1hw9l-space-orbit-lab.vercel.app`.
- Corrigé des 43 questions, réponses attendues et explications, marqué provisoire et à valider. Disponible après réponse à toutes les questions et fin du quiz ; positionnement et focus au début du corrigé.
- Choix comparés au corrigé provisoire ; réponses libres accompagnées de modèles sans note automatique. Constantes affichées, ambiguïtés des orbites dégénérées et vitesses arrondies expliquées.
- Vérifications : 31 tests, TypeScript, ESLint et build Vercel ; parcours navigateur réel en production, blocage avant complétion, affichage des 43 corrections, focus du titre, mobile sans débordement et aucune erreur navigateur. Comptes temporaires supprimés, aucun courriel envoyé.

- Production publiée sur `https://spaceorbitlab.com`, état **READY**.
- Déploiement : `dpl_sn2B89pbKvrGFhdHKb8fXn6bZxyK`.
- URL immuable : `https://spaceorbitlab-xncg74ai1-space-orbit-lab.vercel.app`.
- Source Git : `fbe0bbd` sur `main`, après récupération des deux commits distants et push.
- Quiz « SOL Part II - COE exercices » dans Dashboard / Mes quiz : 14 sections du PDF, recommandation Orbit101, réponses interactives sans correction automatique.
- Publication depuis un instantané Git dans `D:/codex-deploy-cache/spaceorbitlab-coe-20261006/site`, sans secrets locaux ni images de travail écartées.
- Vérifications : 28 tests, ESLint, TypeScript et compilation Vercel réussis ; accueil, health et connexion en HTTP 200 ; quiz anonyme redirigé vers connexion ; lien Dashboard et contenu du quiz confirmés avec un compte temporaire authentifié.
- Compte de vérification supprimé, aucun courriel envoyé, aucune migration ni réimportation des contenus.

- Site : https://spaceorbitlab.vercel.app
- CMS Payload : https://spaceorbitlab.vercel.app/admin
- Équipe / projet : `space-orbit-lab/spaceorbitlab`.
- Déploiement : `dpl_7bXxbXSN1QuXowB51CYm7MguVRdf`, état **READY**, production.
- Version : arbre de travail local basé sur `ff40fd1`, incluant les changements non
  commités (migration Introduction/Courses et plugin MCP). Aucun push GitHub effectué.
- Next.js 16.3.5, Node.js 24, compilation distante réussie (environ une minute).

Le CMS fait partie de la même application Next.js. La base Neon utilisée est celle
configurée localement et contenant les imports existants ; elle est donc actuellement
partagée avec le développement local. Les futures écritures locales affectent ces
mêmes données. Prévoir une branche de développement distincte avant les essais de contenu.

Variables de production configurées : `DATABASE_URL`, `PAYLOAD_SECRET` (nouveau secret
de production), `NEXT_PUBLIC_SERVER_URL`, `RESEND_API_KEY`, `EMAIL_FROM`.
Aucune valeur secrète n’est consignée ici. Les environnements preview/development
Vercel n’ont pas reçu la connexion de production. Les migrations étaient déjà appliquées.

## Contrôles après publication

- HTTP 200 : accueil, Introduction, Courses, Downloads, `/admin`, `/api/health`.
- Textes des cours et de l’introduction présents dans les réponses publiques.
- Administrateur initial existant confirmé ; écran `/admin/login` chargé dans le navigateur,
  champs courriel/mot de passe visibles, aucune erreur navigateur. Connexion avec mot de passe
  non testée pendant ce déploiement.
- `/api/courses` refuse les visiteurs anonymes en HTTP 403, comme prévu.
- Ancienne URL `/courses.html` redirigée en HTTP 308.
- Journaux consultés : refus 403 provoqué par le contrôle d’accès et avertissements du
  pilote PostgreSQL sur les alias SSL ; aucune erreur de chargement constatée sur les pages testées.

Le dossier local est lié au projet via `.vercel/project.json` (ignoré par Git).
Le transfert initial a été préparé dans `D:/codex-deploy-cache/spaceorbitlab-20260927`
car C: était plein. Le disque C: dispose depuis d’espace libre.

Pour les prochaines publications, exécuter depuis le dépôt : `npx vercel deploy --prod`.
## Domaine personnalisé — actif

Le 27 septembre 2026, les DNS Namecheap ont été remplacés :

- Deux A pour `@` : `216.198.79.1` et `64.29.17.1`.
- CNAME `www` : `b62a21d63315c758.vercel-dns-017.com`.
- Les MX, SPF, CNAME Resend et DKIM existants ont été conservés.

Vercel confirme les deux domaines correctement configurés. Certificat HTTPS émis
pour les deux noms ; `www` redirige en HTTP 308 vers `https://spaceorbitlab.com`,
en conservant le chemin.

`NEXT_PUBLIC_SERVER_URL` de production vaut désormais `https://spaceorbitlab.com`.
Redéploiement réussi : `dpl_EJ7ie8nZBUF7DYBvioBorj3Cfckt`, état READY.
HTTP 200 vérifiés sur accueil, Introduction, Courses, Downloads, CMS et health.
Le contenu Courses est présent et l’écran `/admin/login` a été vérifié dans le navigateur.
La connexion authentifiée et l’envoi de courriels n’ont pas été exercés.

## Reprise graphique historique — 27 septembre 2026

Déploiement final `dpl_8wJcaK4DyeYKRkoNnsz89kaZvrU8`, état READY, alias
https://spaceorbitlab.com. Accueil, Contact, Objectives et Simulations restaurés ;
CSS historique inchangé et correctif mobile séparé. Compilation distante et
TypeScript réussis ; 20 tests et ESLint réussis. Détails et limites CMS :
[Reprise du frontend historique](REPRISE_FRONTEND_HISTORIQUE.md).

## Cours Astrodynamics Laws — 30 septembre 2026

Publication demandée du cours préparé localement et de la sélection finale de
20 illustrations (dont trois animations), sur `https://spaceorbitlab.com`.

- Déploiement : `dpl_A1L5f1sDWBxg2jYtGBm9eMtBiZRa`, production **READY**.
- URL immuable : `https://spaceorbitlab-6yc7nu7te-space-orbit-lab.vercel.app`.
- Version précédente : `dpl_DeYLfaiiLHsNSFa4g7f4kJbg4Ym6` (28 septembre).
- Source : instantané de l’application locale basée sur `9ff7397`, comprenant
  les modifications du cours, du Dashboard, des comptes et des téléchargements
  présentes dans cet arbre. Aucun commit ni push effectué.
- Préparation : `D:/codex-deploy-cache/spaceorbitlab-course-1790822843868`,
  189 fichiers, dont les 40 fichiers nécessaires aux 20 illustrations. Les
  archives d’images écartées, fichiers `.env`, sorties de travail et notes locales
  n’ont pas été transférés. Les empreintes sont conservées localement dans
  `output/course-deployment-snapshot.json`.
- Commande : `npx vercel deploy --prod --yes --archive=tgz --logs` depuis cet
  instantané lié au projet existant. Configuration et secrets de production conservés.
- Compilation et TypeScript réussis sur Vercel ; domaine principal et alias
  affectés au nouveau déploiement. Aucune migration ni réimportation des contenus.

Contrôles sur le domaine de production : accueil, Courses, Downloads, connexion
et health en HTTP 200 ; aperçu enrichi et ses deux figures présents. Avec un
compte vérifié temporaire : connexion réussie, neuf leçons accessibles, vingt
illustrations et leurs originaux chargés, galerie filtrable, animations avec
lecture/pause, affichage ordinateur/mobile sans débordement ni erreur navigateur.
Les fichiers servis en grand format correspondent aux originaux du PowerPoint.
Les images privées refusent les visiteurs anonymes et les images écartées
renvoient 404. Le compte temporaire a été supprimé après vérification ; aucun
courriel n’a été envoyé. Les 28 tests, lint et types avaient été validés localement.
