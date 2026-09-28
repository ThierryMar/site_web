# Déploiement Vercel — 27 septembre 2026

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
