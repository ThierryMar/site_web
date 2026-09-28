# Espace utilisateur — 27 septembre 2026

Mise à jour du 28 septembre : confirmation d'adresse obligatoire pour les
nouveaux comptes, renvoi du lien et recette technique de récupération livrés.
Voir [la validation des courriels](VALIDATION_COURRIELS_2026-09-28.md) pour les
tests, la compatibilité des comptes existants et la réception restant à confirmer.

Accès visibles dans l’en-tête des pages Next.js : connexion, création de compte,
mon compte et paramètres. Les formulaires existants sont désormais présentés
avec les palettes bleu, crème et or du site.

Le compte authentifié permet de modifier son nom affiché et de consulter son
adresse de connexion. Il propose la récupération du mot de passe par courriel
et la déconnexion de tous les appareils. La modification du courriel, la suppression
du compte et les préférences de notification ne font pas partie de ce lot.

L’action de profil vérifie la session côté serveur et utilise exclusivement
l’identifiant authentifié ; les champs reçus se limitent au nom, borné à 100 caractères.
Les permissions Payload restent appliquées. Aucun changement de schéma nécessaire.

Validation : ESLint, TypeScript, 20 tests et build Vercel réussis. Formulaires
contrôlés visuellement sur ordinateur et mobile à 390 px. Compte temporaire utilisé
pour vérifier la création en base, la connexion API, l’accès à la page protégée,
la persistance du profil via Server Action, la révocation de session à la déconnexion
et la redirection des visiteurs anonymes. Compte de test supprimé ensuite.
La réception du courriel de récupération n’a pas été testée dans ce lot.

Déploiement READY : `dpl_3QShc4G18kv8aRn6PtYhxTbkBPpi`,
https://spaceorbitlab.com.

## Navigation compacte

Les trois liens sont regroupés sous le menu natif `Account` : `Sign in`,
`Create an account`, `My account & settings`. Dans l’en-tête public, ce menu
remplace `Get Started` et supprime la ligne de liens supplémentaire. Il est
également présent sur Simulations et dans les pages d’authentification.
Les palettes existantes sont conservées ; les formulaires restent en français.
