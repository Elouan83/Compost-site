# SOLAÏ — site web (SAÉ Création d'entreprise, S3, Mission 2)

Site fictif de la marque SOLAÏ (« Du soleil à chaque gorgée »). Site statique HTML / CSS / JavaScript, sans dépendance, prêt pour Firebase Hosting.

## Arborescence

- `index.html` — Accueil (gammes, 5 boissons, offre de lancement, quiz, valeurs, salon)
- `produits.html` — Boutique avec filtre par gamme
- `produit.html?id=…` — Fiche produit (orange, pomme, japon, bresil, madagascar)
- `offre.html` — Offre de lancement Évasion Japon « 2 achetées = 1 offerte »
- `histoire.html` — La marque, le contenant, les points de vente
- `salon.html` — Participation au salon
- `contact.html` — Formulaire de contact
- `mentions-legales.html`, `cgv.html`, `confidentialite.html` — Informations légales

Les contenus produits (prix, ingrédients, dates de l'offre) sont dans `public/assets/js/data.js`.
Les éléments surlignés en jaune sur le site (`[à compléter : …]`) sont des informations à renseigner.

## Voir le site en local

```
cd public
python -m http.server 8000
```

Puis ouvrir http://localhost:8000

## Déployer sur Firebase Hosting (invite de commandes Windows)

1. Installer Node.js (https://nodejs.org), puis :
   ```
   npm install -g firebase-tools
   firebase login
   ```
2. Dans le dossier du projet :
   ```
   firebase deploy --only hosting
   ```

L'adresse du site s'affiche à la fin de la commande (`Hosting URL`).
