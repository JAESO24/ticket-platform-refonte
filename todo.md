# Project TODO

## Refonte React et backend

- [x] Reproduire l’interface publique React avec découverte, recherche et cartes détaillées d’événements.
- [x] Appliquer la charte graphique fournie aux tokens globaux, composants, layouts et états interactifs.
- [x] Mettre en place le modèle de données utilisateurs, événements, types de billets, commandes, billets numériques, contrôles et réclamations.
- [x] Mettre en place les contrats tRPC et les helpers de persistance côté serveur.
- [ ] Implémenter le parcours de commande complet : sélection des billets, panier/récapitulatif, validation et accès aux billets numériques.
- [x] Implémenter les contrôles d’accès backend adaptés aux rôles client, promoteur, agent et administrateur ; l’authentification frontend réelle reste à brancher sur OAuth dans les parcours finaux.
- [ ] Finaliser les écrans fonctionnels de l’espace client : commandes, billets, profil, réclamations et parcours de paiement associés.
- [x] Créer le shell responsive de l’espace promoteur : soumission/suivi d’événements, types de billets, ventes, retraits et éligibilité.
- [x] Créer le shell responsive de l’espace agent : vérification des billets et historique des contrôles.
- [x] Créer le shell responsive du back-office administrateur : utilisateurs, événements, tickets, demandes, réclamations et supervision.
- [ ] Exposer dans l’interface les modules métier votes, cotisations/campagnes, demandes de retrait et éligibilité promoteur.
- [ ] Intégrer un paiement sécurisé pour les commandes de billets et les parcours de paiement associés.
- [ ] Ajouter les notifications persistées après commande, validation d’événement ou réclamation ; des toasts UI sont déjà présents sur les actions simulées.
- [ ] Couvrir complètement les états loading/error/empty/success sur les flux tRPC réels ; la base UI succès/recherche vide/notifications est en place.
- [x] Vérifier le responsive mobile de l’accueil et des quatre shells privés, ainsi que le desktop de l’accueil, de la connexion et de l’espace client.
- [x] Écrire et exécuter les tests Vitest backend sur logout, catalogue public et contrôle d’accès par rôle.
- [x] Vérifier visuellement les écrans et parcours principaux dans le navigateur.
- [ ] Créer le checkpoint final après validation de tous les items.
