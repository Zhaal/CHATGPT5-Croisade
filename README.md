# Nexus Crusade Tracker

Cette application permet de gérer une campagne de croisade Warhammer 40k.

## Lancer le projet

L'application repose sur des fonctions serverless hébergées par Netlify. Pour les utiliser en local :

1. Installez l'outil Netlify CLI si nécessaire :
   ```bash
   npm install -g netlify-cli
   ```
2. Depuis la racine du projet, lancez le serveur de développement :
   ```bash
   netlify dev
   ```

Ce serveur expose à la fois le site statique et les fonctions. Les boutons **Sauvegarder en ligne** et **Charger en ligne** n'effectuent leurs opérations qu'au sein de cet environnement Netlify.

## Déploiement

Pour publier le site et ses fonctions sur Netlify :

1. Déploiement de prévisualisation :
   ```bash
   netlify deploy
   ```
2. Déploiement en production :
   ```bash
   netlify deploy --prod
   ```

Une fois déployées, les fonctions sont accessibles via des URLs de la forme :

```
https://<nom-du-site>.netlify.app/.netlify/functions/<nom-de-la-fonction>
```

Vous pouvez utiliser cette structure (`/.netlify/functions/...`) pour tester chaque fonction directement.
