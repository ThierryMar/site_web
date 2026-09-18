# SpaceOrbitLAB

Socle Next.js App Router + TypeScript, Payload CMS/authentification, PostgreSQL Neon,
Stripe et Google Analytics 4, destiné à Vercel. Le frontend est en anglais.

## État du projet

Le [plan détaillé et suivi des phases](docs/SUIVI_PHASES.md) présente l’état actuel,
les étapes vers la plateforme complète, les critères de validation et le journal d’avancement.

- Démo HTML/Python conservée dans `index.html/`; elle n'est pas publiée par cette application Next.js.
- Nouvelle page d'attente sur `/`, administration sur `/admin`, API Payload sur `/api`.
- Comptes `admins` pour le CMS et `users` pour les étudiants, avec authentification Payload.
- Collection `pages` avec brouillons, publication et éditeur riche. Le rendu des pages CMS sera ajouté ultérieurement.
- Les cours, inscriptions publiques, formulaires étudiants, emails, quiz et achats restent à implémenter.
- Aucun projet distant n'est créé automatiquement; aucune modification DNS n'est faite.

## Démarrage local

Installer Node.js 24 et pnpm 11.19.0, puis :

```sh
pnpm install --frozen-lockfile
```

Copier `.env.example` vers `.env` si le fichier n'existe pas. Générer un secret aléatoire d'au moins
32 caractères pour `PAYLOAD_SECRET`. Un secret local a été généré lors de la préparation de ce dépôt.
Ne jamais réutiliser ce secret entre les environnements ou le committer.

Renseigner la connexion Neon, puis :

```sh
pnpm check:env
pnpm migrate
pnpm dev
```

Le site est accessible sur http://localhost:3000. La page publique et `/api/health` peuvent fonctionner
sans base. Le CMS, les sessions et les contenus exigent une base accessible et les migrations appliquées.

Pour le premier administrateur, ouvrir `/admin` localement avec la base du bon environnement,
puis créer le compte initial **avant d'exposer cette base via un déploiement public**.
Créer ensuite les comptes étudiants depuis la collection Users dans le CMS.

## Authentification Payload

Payload assure le hachage des mots de passe, les sessions et le verrouillage après échecs répétés.
Les étudiants ne peuvent pas accéder au CMS, modifier les pages ou consulter un autre compte.

| Usage | Endpoint |
| --- | --- |
| Connexion étudiant | `POST /api/users/login` |
| Session étudiant | `GET /api/users/me` |
| Déconnexion étudiant | `POST /api/users/logout` |
| Administration | `/admin` (collection `admins`) |

Le login accepte `{"email":"…","password":"…"}`. Utiliser les cookies de session Payload avec
des requêtes de même origine. Ne pas stocker les jetons dans localStorage.
La création publique de comptes est fermée pour ce socle; seuls les administrateurs créent des utilisateurs.
La vérification du courriel et la récupération par email nécessitent un adaptateur email à configurer ultérieurement.
L'API locale de Payload contourne les droits par défaut : transmettre `user` et `overrideAccess: false`
dans les futures opérations effectuées pour un étudiant.

## Configurer les plateformes

### 1. GitHub

Le remote existant pointe vers `ThierryMar/site_web`. Les nouveaux fichiers sont locaux, sans commit ni push.
Le workflow `.github/workflows/ci.yml` exécute lint, TypeScript, tests et compilation.
Il utilise des valeurs fictives uniquement pour compiler et ne teste pas Neon.
Un push sur une branche connectée à Vercel pourra déclencher un déploiement.

### 2. Neon

Créer un projet PostgreSQL, choisir une région proche de celle du projet Vercel, et préparer des
bases/branches distinctes pour développement, preview et production.
Mettre la connexion poolée dans `DATABASE_URL` avec `sslmode=require`.
Mettre la connexion directe dans `DATABASE_URL_UNPOOLED` pour les migrations.

`pnpm migrate` applique les migrations versionnées. `pnpm migrate:create nom` génère une migration
après un changement de collection; inspecter son SQL avant de l'appliquer.
Les migrations utilisent la connexion directe si présente. La synchronisation automatique du schéma
est désactivée. Aucun changement de schéma n'est effectué pendant `pnpm build`.
Ne pas donner la base de production aux déploiements de preview.

### 3. Vercel

Créer un projet en important le dépôt GitHub, avec le répertoire racine `.`,
le framework Next.js et Node.js 24. Les commandes sont dans `vercel.json`.
Configurer les variables pour chaque environnement séparément :

| Variable | Usage |
| --- | --- |
| `PAYLOAD_SECRET` | Secret privé, différent par environnement |
| `DATABASE_URL` | Connexion Neon poolée |
| `NEXT_PUBLIC_SERVER_URL` | Origine HTTPS exacte de l'application |
| `STRIPE_SECRET_KEY` | Optionnelle, clé de test pour commencer |
| `STRIPE_WEBHOOK_SECRET` | Optionnelle, secret de signature |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Optionnelle, identifiant GA4 `G-…` |

La connexion directe reste dans l'environnement sécurisé exécutant les migrations.
Appliquer les migrations puis initialiser l'administrateur avant la mise à disposition du CMS.
Tester d'abord l'URL Vercel; la bascule de `spaceorbitlab.com` est une étape distincte.
Les variables `NEXT_PUBLIC_*` sont publiques et nécessitent une recompilation pour changer.

### 4. Stripe

Créer le compte et utiliser le mode test. Renseigner les clés côté serveur dans `.env` et Vercel.
`src/lib/stripe.ts` expose un client serveur, initialisé à la demande.

`POST /api/stripe/webhook` vérifie la signature sur le corps brut :
503 sans configuration, 400 pour une signature absente/invalide, 501 pour un événement signé.
**Ne pas encore enregistrer cet endpoint comme destination d'événements de paiement dans Stripe.**
Il n'accuse pas réception des paiements avant l'ajout du traitement durable et idempotent.
Aucun Checkout, produit, prix, achat ou droit d'accès payant n'est créé dans ce socle.

### 5. Google Analytics

Créer une propriété GA4 et un flux Web, puis renseigner `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
Le script reste absent tant que le visiteur n'accepte pas les statistiques. Le refus et le retrait
du consentement désactivent le chargement lors du rechargement.
L'administration n'intègre pas Analytics. Aucune donnée de compte n'est envoyée par le code.
La navigation SPA détaillée et les événements métier seront ajoutés avec les écrans concernés.

## Vérifications

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

`pnpm check:env` vérifie la présence et la forme de la configuration sans afficher de secrets,
mais ne vérifie pas les connexions. `/api/health` mesure uniquement la disponibilité du serveur.

## Références officielles

- [Payload et Next.js](https://payloadcms.com/docs/getting-started/installation)
- [Authentification Payload](https://payloadcms.com/docs/authentication/overview)
- [Migrations Payload](https://payloadcms.com/docs/database/migrations)
- [Connexion Neon](https://neon.com/docs/connect/connect-from-any-app)
- [Next.js sur Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs)
- [Signatures Stripe](https://docs.stripe.com/webhooks/signature)

## Authentification des participants

Pages : `/connexion`, `/inscription`, `/mot-de-passe-oublie`,
`/reinitialiser-mot-de-passe?token=…` et `/mon-compte` (authentification requise).
Les comptes utilisent la collection Payload `users`; le CMS reste réservé à `admins`.
L'inscription passe par une Server Action qui ne transmet que le courriel et le mot de passe.
Les mots de passe des formulaires doivent contenir entre 12 et 128 caractères.
Les connexions sont verrouillées dix minutes après cinq échecs. Les sessions durent deux heures.
La déconnexion et la réinitialisation révoquent toutes les sessions du participant.

Configurer `RESEND_API_KEY`, `EMAIL_FROM` (adresse sur un domaine vérifié dans Resend)
et `NEXT_PUBLIC_SERVER_URL` (URL publique HTTPS en production) pour les liens de récupération.
Sans configuration d'envoi, le formulaire indique que la récupération est indisponible.
Les liens expirent après une heure. Les demandes ne révèlent pas si le compte existe.
Aucune nouvelle migration n'est nécessaire : les champs d'authentification existent déjà.

Recette avec une base de développement : créer un compte, se connecter, ouvrir `/mon-compte`,
se déconnecter, demander un courriel, utiliser le lien puis vérifier que l'ancien mot de passe
et le lien déjà utilisé sont refusés. Tester également le verrouillage après cinq échecs.
