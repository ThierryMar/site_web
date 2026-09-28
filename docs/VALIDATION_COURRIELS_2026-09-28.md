# Confirmation d'adresse et récupération — 28 septembre 2026

## Fonctionnalités livrées

- Les nouvelles inscriptions reçoivent un courriel de confirmation. Le compte
  reste non confirmé et ne peut pas se connecter avant validation.
- `/confirmer-courriel?token=…` présente un bouton explicite : visiter la page
  ne consomme pas le lien, notamment lors du passage d'un scanner de messagerie.
- `/renvoyer-confirmation` permet de recevoir un nouveau lien. Le renvoi invalide
  l'ancien jeton et attend au moins une minute entre deux envois par compte.
  La réponse ne révèle pas si l'adresse existe ou est déjà confirmée.
- Le lien de confirmation est à usage unique. Le mécanisme natif Payload n'a
  pas d'expiration temporelle pour ce jeton ; il reste valide jusqu'à son
  utilisation ou son remplacement par un renvoi.
- Les liens de récupération expirent après une heure. Un changement de mot de
  passe invalide les anciennes sessions et demande une nouvelle connexion.
- Les protections s'appliquent aussi aux opérations Payload : un compte non
  confirmé ne peut pas utiliser le reset pour obtenir une session ; les mots
  de passe de réinitialisation respectent la longueur 12–128 caractères.
- Les étudiants ne peuvent ni remplacer leur adresse ni modifier les champs
  de confirmation via l'API générique. Les jetons et dates d'envoi ne sont pas
  exposés par les lectures étudiantes.

## Migration et compatibilité

Migration appliquée : `20260928_180411_email_verification`.
Elle ajoute les champs de vérification et la date du dernier envoi.

Les comptes préexistants sont exemptés de confirmation obligatoire lors de cette
transition (`_verified = true`) pour préserver leur accès. Cela ne constitue pas
une preuve de vérification historique de leur boîte. Les nouvelles créations
publiques forcent `_verified = false` côté serveur.

Un lien de confirmation valide a été envoyé au compte universitaire de Thierry
à sa demande pour contrôler l'arrivée du message et l'écran de confirmation,
sans retirer l'accès existant. Un lien de récupération réel a aussi été envoyé.
Aucun mot de passe réel n'a été modifié par l'agent.

## Validation effectuée

| Contrôle | Résultat |
| --- | --- |
| Tests unitaires | 21 réussis |
| ESLint | Réussi |
| TypeScript | Réussi ; erreurs préexistantes de valeurs nulles corrigées dans `output/verify-account.ts` |
| Compilation locale | Réussie |
| Compilation Vercel | Réussie |
| Intégration Payload/PostgreSQL | Réussie dans un schéma temporaire distinct, supprimé après le test |
| Formulaire de confirmation publié | Visible ; jeton invalide refusé avec message lisible |
| Pages confirmation/renvoi/inscription | HTTP 200 |
| Compte sans session | Redirection vers la connexion |
| Deux envois réels à l'adresse demandée | Acceptés par Resend |
| Réception dans la boîte de Thierry | En attente de confirmation de Thierry |
| Réinitialisation réelle par Thierry puis reconnexion | En attente de son action ; scénario automatisé déjà validé sur compte isolé |

`pnpm test:auth-integration` couvre : inscription non confirmée, refus de
connexion, refus de reset contournant la confirmation, délai de renvoi, rotation
et usage unique du jeton, connexion après vérification, interdiction de modifier
les champs protégés, expiration du reset, mot de passe trop court, révocation
de session, refus de l'ancien mot de passe, connexion avec le nouveau, absence
d'envoi pour compte inexistant/déjà confirmé et annulation de l'inscription
lorsque le service de courriel échoue.

Ce script utilise un schéma `auth_test_<identifiant aléatoire>` et un adaptateur
de capture local ; il n'envoie aucun courriel et ne modifie pas les comptes
de l'application. Il nécessite la configuration PostgreSQL locale.

## Publication

Déploiement final : `dpl_EacbiFyxobkLmpZY3Tu4Q6XCPBao`, état READY,
sur <https://spaceorbitlab.com>.

La publication utilise les variables Vercel. `.vercelignore` exclut les fichiers
`.env*`, les sorties de recette et les sources historiques inutiles à la
publication. Le dossier `public/legacy` reste inclus pour les ressources et
simulations existantes.

## Dernière étape humaine

Confirmer la réception des deux messages, cliquer sur le lien de confirmation,
puis utiliser le lien de récupération reçu pour choisir un nouveau mot de passe
et se reconnecter. Ne communiquer ni le mot de passe ni le jeton au support.
Si le lien de récupération a expiré, en demander un nouveau depuis le site.
