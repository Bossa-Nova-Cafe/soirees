# Votre soirée privée · Bossa Nova Café

## Les fichiers

| Fichier | Rôle |
| --- | --- |
| `index.html` | Le calculateur pour les clients |
| `admin.html` | Le panneau d'administration : plats, prix, vins, digestifs, réglages |
| `achats.html` | Les achats des soirées : soirées confirmées, liste d'achats, coût et marge |
| `stock.html` | Le contrôle du stock du café (tablette, téléphone, Mac) |
| `catalogue.js` | Le catalogue partagé et les valeurs d'origine |
| `firebase-config.js` | La connexion à Firebase (vide = mode local) |

Ces fichiers doivent rester dans le même dossier.

## 1. Tester en local

1. Ouvrir `admin.html` dans Chrome. Le badge indique « Mode local ».
2. Changer un prix, cliquer sur **Enregistrer**.
3. Ouvrir ou recharger `index.html` : le nouveau prix apparaît.

En mode local, les changements restent dans ce navigateur. Les clients ne les voient pas.

## 2. Mettre en ligne (après validation des tests)

1. **Firebase** : `firebase-config.js` contient déjà la configuration du projet `bossa-nova-reservations` (le même que le portail de réservations).
2. **Compte administrateur** : c'est le même compte que celui du portail de réservations. Rien à créer.
3. **Règles Firestore** : dans la console Firebase, Firestore Database > Règles, ajouter ces deux blocs juste avant les deux dernières accolades `}` (à côté des règles `soirees` et `reservations`), puis **Publier** :

```
    // Festa : catalogue lisible par tous, modifiable par l'équipe
    match /parametres/confra-catalogue {
      allow read: if true;
      allow write: if admin();
    }
    // Festa : offres personnalisées, réservées à l'équipe
    match /parametres/confra-offres {
      allow read, write: if admin();
    }
```

4. **GitHub** : le site est dans le dépôt `soirees`, publié par GitHub Pages (branche main).
5. Ouvrir `admin.html` en ligne, se connecter, vérifier les prix, puis **Enregistrer** une première fois : le catalogue est alors créé dans Firestore.

Tant que rien n'est enregistré en ligne, le calculateur utilise les valeurs d'origine de `catalogue.js`.

## Offres personnalisées

Dans `admin.html`, section « Offres personnalisées » : client, date, nombre d'invités, remises, cadeaux, prix spéciaux et un mot pour le client. Le bouton crée un lien à envoyer au client : le calculateur s'ouvre avec ses conditions, et sa demande arrive avec le numéro de l'offre.

- Les conditions sont contenues dans le lien lui-même. Si vous modifiez une offre, renvoyez le nouveau lien : l'ancien garde les anciennes conditions.
- Vérifiez toujours le numéro de l'offre dans la demande reçue avant de confirmer : c'est votre liste d'offres qui fait foi.
- En mode local, le lien ne fonctionne que sur votre ordinateur.

## Bon à savoir

- Décocher « Visible » retire un plat du calculateur sans le supprimer : pratique pour un plat de saison.
- « Télécharger une copie » garde une sauvegarde du catalogue sur l'ordinateur ; « Charger une copie » la remet.
- `admin.html` n'est pas référencé par les moteurs de recherche, mais son adresse n'est pas secrète : en ligne, c'est la connexion qui protège les modifications.

## Achats des soirées

`achats.html` (lien « Achats des soirées » dans l'administration, même connexion).

1. **Soirées** : colle la demande reçue par WhatsApp ou e-mail, clique sur « Lire le message », vérifie, puis « Enregistrer la soirée ». Un plat non reconnu est signalé : ajoute-le à la main. Statut « En option » pour une soirée pas encore confirmée.
2. **Liste d'achats** : choisis la période ; les quantités de toutes les soirées cochées s'additionnent, classées par rayon Aligro. Imprimer, ou copier en texte pour WhatsApp.
3. **Recettes et prix** : quantités pour 8 (la fiche de production) et prix d'achat hors TVA. Les prix marqués « Estimation » sont à vérifier ; ceux marqués « Aligro » viennent du prospectus PRO n° 45 (souvent en promotion).

Coût matière et marge : calculés sur le prix du menu (hors TVA 8,1 %, hors vins et boissons du bar). Pour une offre à prix spécial, indique le « prix du menu convenu ».

**Règle Firestore à ajouter une fois** (console Firebase, Firestore Database > Règles, à côté des règles `confra-offres`, puis Publier) :

```
    // Achats des soirées : réservés à l'équipe
    match /parametres/confra-achats {
      allow read, write: if admin();
    }
```

## Stock du café

`stock.html` (lien « Stock » dans l'administration, même connexion). Pensé pour la tablette du bar : compteurs − / + pour les sorties et les livraisons, « Compter » pour l'inventaire, seuil d'alerte et stock idéal sur la fiche de chaque article. L'onglet **Commande** regroupe par fournisseur ce qui est au seuil ou en dessous, avec un texte à copier pour WhatsApp ; l'onglet **Journal** garde les mouvements des 120 derniers jours.

Au premier lancement, le bouton « Importer la liste de départ » crée les articles des fiches papier.

**Règle Firestore à ajouter une fois** (à côté de `confra-achats`, puis Publier) :

```
    // Stock : réservé à l'équipe
    match /stock-articles/{id} {
      allow read, write: if admin();
    }
    match /stock-mouvements/{id} {
      allow read, write: if admin();
    }
```
