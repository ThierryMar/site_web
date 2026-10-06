# Devoirs dans Downloads

La section **Assignments** affiche les ressources publiées de la collection
`downloads` dont l’URL commence par `/downloads/assignments/`. Ces ressources
ne sont pas répétées dans **Course Notes**. Leur format reste `PDF` pour le
bouton de téléchargement et le tableau de bord.

Pour ajouter un devoir, placer son fichier dans `public/downloads/assignments/`,
déployer, puis publier sa fiche dans le CMS avec l’URL encodée du fichier.
Les champs titre, description et ordre restent modifiables dans le CMS.

Le premier devoir, `PHY-7012 – Assignment #1 (2026-09-28).pdf`, est importé par
`pnpm exec tsx scripts/import-assignment-download.ts --apply`. Sans `--apply`,
la commande affiche seulement l’ajout prévu. Elle préserve les fiches existantes
et vérifie que le PDF en ligne est identique au fichier local avant publication.
