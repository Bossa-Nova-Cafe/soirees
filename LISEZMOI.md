# Votre soirée privée · Bossa Nova Café

## Les fichiers

| Fichier | Rôle |
| --- | --- |
| `index.html` | Le calculateur pour les clients |
| `admin.html` | L'accueil de l'administration : toutes les pages, en un seul endroit |
| `festa-admin.html` | Les prix de la Festa : plats, prix, vins, digestifs, réglages, offres personnalisées |
| `nav-admin.js` | La barre de navigation commune à toutes les pages d'administration |
| `achats.html` | Les achats des soirées : soirées confirmées, liste d'achats, coût et marge |
| `stock.html` | Le contrôle du stock du café (tablette, téléphone, Mac) |
| `caisse.html` | La fermeture de caisse : saisie par le serveur, clôture par le manager, historique et export |
| `catalogue.js` | Le catalogue partagé et les valeurs d'origine |
| `firebase-config.js` | La connexion à Firebase (vide = mode local) |

Ces fichiers doivent rester dans le même dossier.

## 1. Tester en local

1. Ouvrir `festa-admin.html` dans Chrome. Le badge indique « Mode local ».
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
5. Ouvrir `festa-admin.html` en ligne, se connecter, vérifier les prix, puis **Enregistrer** une première fois : le catalogue est alors créé dans Firestore.

Tant que rien n'est enregistré en ligne, le calculateur utilise les valeurs d'origine de `catalogue.js`.

## Offres personnalisées

Dans `festa-admin.html`, section « Offres personnalisées » : client, date, nombre d'invités, remises, cadeaux, prix spéciaux et un mot pour le client. Le bouton crée un lien à envoyer au client : le calculateur s'ouvre avec ses conditions, et sa demande arrive avec le numéro de l'offre.

- Les conditions sont contenues dans le lien lui-même. Si vous modifiez une offre, renvoyez le nouveau lien : l'ancien garde les anciennes conditions.
- Vérifiez toujours le numéro de l'offre dans la demande reçue avant de confirmer : c'est votre liste d'offres qui fait foi.
- En mode local, le lien ne fonctionne que sur votre ordinateur.

## Bon à savoir

- Décocher « Visible » retire un plat du calculateur sans le supprimer : pratique pour un plat de saison.
- « Télécharger une copie » garde une sauvegarde du catalogue sur l'ordinateur ; « Charger une copie » la remet.
- Les pages d'administration ne sont pas référencées par les moteurs de recherche, mais leur adresse n'est pas secrète : en ligne, c'est la connexion qui protège les modifications.

## Achats des soirées

`achats.html` (barre de navigation en haut des pages d'administration, même connexion).

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

`stock.html` (barre de navigation en haut des pages d'administration, même connexion). Pensé pour la tablette du bar : compteurs − / + pour les sorties et les livraisons, « Compter » pour l'inventaire, seuil d'alerte et stock idéal sur la fiche de chaque article. L'onglet **Commande** regroupe par fournisseur ce qui est au seuil ou en dessous, avec un texte à copier pour WhatsApp ; l'onglet **Journal** garde les mouvements des 120 derniers jours.

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

## Accueil de l'administration

**Soirées à remplir** : quand une soirée des 14 prochains jours se remplit trop lentement, l'accueil affiche une alerte avec des questions à cocher (« As-tu publié une story aujourd'hui ? »…). Les réponses, et la liste des questions (modifiable dans la section « Questions des alertes de remplissage »), sont partagées avec l'équipe grâce au document `parametres/alertes-soirees`. **Règle Firestore à ajouter une fois** (à côté de `confra-achats`, puis Publier) :

```
    // Suivi des alertes de remplissage : réservé à l'équipe
    match /parametres/alertes-soirees {
      allow read, write: if admin();
    }
```

Sans cette règle, les coches restent seulement sur l'appareil où elles sont faites.

`admin.html` rassemble toutes les pages : Stock, Réservations (gestion du portail `bossa-nova-reservations`), Prix de la Festa, Achats des soirées, et les pages à partager aux clients. Chaque page d'administration affiche en haut la même barre de navigation (`nav-admin.js`) pour passer de l'une à l'autre. Pour ajouter une page, l'ajouter dans la liste `PAGES` de `nav-admin.js` et une carte dans `admin.html`.

## Équipe : qui a accès à l'administration

Dans `admin.html`, section **Équipe** : la liste des e-mails autorisés (document Firestore `parametres/equipe`).

- **Ajouter quelqu'un** : 1. créer son compte dans la console Firebase, Authentication → Users → Ajouter un utilisateur ; 2. ajouter le même e-mail dans la section Équipe.
- **Retirer quelqu'un** : bouton « Retirer » ; son accès est coupé sur toutes les pages.
- **Lien mot de passe** : envoie l'e-mail Firebase pour choisir un nouveau mot de passe.
- Tant que la liste n'est pas activée (bouton « Activer la liste de l'équipe »), tout compte connecté a accès.
- Sécurité : dans la console Firebase, Authentication → Paramètres → Actions des utilisateurs, garder **« Activer la création (inscription) » décoché**.

Les règles Firestore complètes sont dans `firestore.rules` du dépôt `bossa-nova-reservations`.

## Caisse

`caisse.html` remplace la fermeture de caisse FileMaker. Le fond de caisse est fixe : 185 CHF (constante `FOND` en haut du script de la page).

1. **Ma fermeture** (le serveur) : date, prénom, service ou livraison, fond de caisse ; total des billets et total de la monnaie donné par la machine à compter ; ventes espèces du rapport Lightspeed ; achats payés depuis la caisse (ticket reçu ou non) ; pourboires cash, Lightspeed et remis ; motif si la caisse n'est pas juste. Tout s'enregistre au fur et à mesure. « Valider ma fermeture » l'envoie au manager.
2. **À valider** (le manager) : coche les tickets reçus, choisit le suivi, écrit l'observation manager (obligatoire en cas d'écart de caisse ou de pourboires, ou de ticket manquant), puis « Clôturer ». Une fermeture clôturée est verrouillée. « Renvoyer au serveur » remet une fermeture à valider en saisie.
4. **Corriger une fermeture clôturée** : bouton « Corriger (manager) ». On modifie les champs, on indique la raison, et un manager saisit son e-mail et son mot de passe au moment d'enregistrer (la tablette reste connectée avec son propre compte). Chaque correction s'inscrit au **journal** de la fermeture : date, manager, raison et détail des changements (avant → après). L'historique marque les fermetures « corrigées » et liste les corrections du mois. Les règles Firestore refusent toute modification d'une fermeture clôturée qui ne vient pas d'un manager ou qui n'ajoute pas cette entrée au journal.
3. **Historique** : les fermetures du mois, avec totaux, et l'export CSV pour la comptabilité (s'ouvre dans Excel).

Calculs : caisse théorique = fond + ventes espèces − achats − pourboires Lightspeed ; écart = bourse comptée − caisse théorique ; à verser au bureau = bourse − fond ; écart pourboires = cash + Lightspeed − remis.

Les managers se choisissent dans l'accueil, section Équipe (bouton « Manager »). Seuls les managers clôturent les fermetures et modifient l'équipe.

## Visites (GoatCounter)

Les pages clients envoient leurs visites à https://bossanova.goatcounter.com. L'accueil de l'administration affiche les visites du jour, sur 7 et sur 30 jours (total et par page), grâce au compteur public de GoatCounter : dans GoatCounter, Settings → cocher « Allow adding visitor counts on your website ».

Les appareils de l'équipe ne sont pas comptés : chaque page d'administration (via `nav-admin.js`) inscrit `skipgc` dans le navigateur, et GoatCounter ignore alors ses visites sur tout le site.

## Statistiques

`statistiques.html` (barre de navigation → Statistiques) présente les visites des pages clients de façon simple : chiffres clés, visites par jour, pages, provenance, heures, jours de la semaine, appareils et pays, sur 7 jours, 30 jours ou 3 mois. Les données viennent de l'API GoatCounter, avec une clé en lecture seule (« Read statistics ») enregistrée une fois par un manager sur la page (document Firestore `parametres/goatcounter`, lisible par l'équipe, modifiable par les managers).
