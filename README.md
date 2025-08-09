# Nexus Crusade Tracker

Cette application permet de gérer une campagne de croisade Warhammer 40k.

## Sauvegarde en ligne

Les boutons **Sauvegarder en ligne** et **Charger en ligne** utilisent des fonctions Netlify pour stocker ou récupérer la campagne.

## Configuration des sauvegardes

Les fonctions Netlify utilisent le service **Netlify Blobs** pour un stockage persistant des campagnes. Pour les utiliser hors de la plateforme Netlify, définissez les variables d'environnement suivantes :

- `NETLIFY_BLOBS_URL`
- `NETLIFY_BLOBS_TOKEN`

Ces variables doivent avoir des droits de lecture et d'écriture sur le store utilisé (`campaigns`). Sur Netlify, elles sont fournies automatiquement.

Après récupération du projet, installez les dépendances avec `npm install` afin d'obtenir notamment `@netlify/blobs`.
