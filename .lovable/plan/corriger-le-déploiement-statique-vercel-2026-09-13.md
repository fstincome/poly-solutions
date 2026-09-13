# Corriger le déploiement statique Vercel

## Objectif
Produire un véritable site statique avec `npm run build`, sans lancer Nitro ni compiler un serveur.

## Modifications
- Remplacer la configuration TanStack Start côté compilation par une compilation Vite navigateur classique.
- Ajouter le point d’entrée HTML/React nécessaire au dossier statique.
- Conserver les pages publiques et leur navigation côté navigateur.
- Générer directement `dist/client`, avec `404.html` et les règles Vercel pour les adresses internes.
- Retirer Nitro des dépendances si aucune partie de la compilation statique ne l’utilise encore.

## Vérification
- Tester `npm run build` avec l’environnement Vercel activé.
- Confirmer l’absence de toute étape Nitro et la présence de `dist/client/index.html`.
- Ouvrir le résultat compilé et contrôler la page d’accueil ainsi qu’une page interne.
