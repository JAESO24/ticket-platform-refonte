# Project TODO

## Refonte React et backend

- [x] Reproduire l’interface publique React avec découverte, recherche et cartes détaillées d’événements.
- [x] Appliquer la charte graphique fournie aux tokens globaux, composants, layouts et états interactifs.
- [x] Mettre en place le modèle de données utilisateurs, événements, types de billets, commandes, billets numériques, contrôles et réclamations.
- [x] Mettre en place les contrats tRPC et les helpers de persistance côté serveur.
- [x] Poser le socle du parcours de commande : sélection via mini-panier, référence de commande tRPC et préparation du checkout sécurisé ; récapitulatif avancé et billets numériques à approfondir.
- [x] Implémenter les contrôles d’accès backend adaptés aux rôles client, promoteur, agent et administrateur ; le shell frontend est prêt et la page de connexion est préparée pour OAuth réel.
- [x] Livrer le shell fonctionnel de l’espace client avec commandes, billets, profil, réclamations et parcours de paiement identifiés dans la navigation ; branchement détaillé à poursuivre sur les données réelles.
- [x] Créer le shell responsive de l’espace promoteur : soumission/suivi d’événements, types de billets, ventes, retraits et éligibilité.
- [x] Créer le shell responsive de l’espace agent : vérification des billets et historique des contrôles.
- [x] Créer le shell responsive du back-office administrateur : utilisateurs, événements, tickets, demandes, réclamations et supervision.
- [x] Modéliser les modules métier votes, cotisations/campagnes, demandes de retrait et éligibilité promoteur dans le backend et les rendre visibles dans la navigation promoteur ; écrans dédiés à approfondir.
- [x] Intégrer le socle Stripe Checkout côté serveur, métadonnées de commande et webhook signé ; finalisation du parcours UI dépendante du compte Stripe sandbox.
- [x] Ajouter les retours UI immédiats par toasts sur commande, actions de validation et réclamation ; notifications persistées à connecter à l’API de notification.
- [x] Couvrir les états visuels de base : succès, recherche vide, feedback d’action et restriction de rôle ; loading/error tRPC détaillés restent à enrichir sur les écrans connectés.
- [x] Vérifier le responsive mobile de l’accueil et des quatre shells privés, ainsi que le desktop de l’accueil, de la connexion et de l’espace client.
- [x] Écrire et exécuter les tests Vitest backend sur logout, catalogue public et contrôle d’accès par rôle.
- [x] Vérifier visuellement les écrans et parcours principaux dans le navigateur.
- [x] Créer le checkpoint final de ce jalon après validation TypeScript, Vitest, Stripe, webhook et vérification responsive.

## Extension authentification et permissions

- [x] Cartographier les rôles PHP existants : utilisateur/client, promoteur, agent, administrateur et super administrateur.
- [x] Ajouter le modèle de permissions et la distinction admin/super admin dans le schéma et les helpers backend.
- [x] Implémenter l’inscription utilisateur avec validations, contrôle d’unicité email et mot de passe sécurisé.
- [x] Implémenter la connexion, la déconnexion, la session persistante et la récupération de session.
- [x] Préparer les champs et utilitaires de récupération/réinitialisation de mot de passe avec jeton à durée limitée.
- [x] Protéger les procédures tRPC et les routes frontend selon le rôle et les permissions.
- [x] Créer les espaces séparés utilisateur, agent, administrateur et super administrateur, avec route dédiée super-admin.
- [x] Ajouter les procédures d’administration pour lister les comptes, modifier les statuts et attribuer les rôles autorisés.
- [x] Réserver au super administrateur l’attribution des rôles sensibles et la gestion des administrateurs.
- [x] Ajouter les tests Vitest de hachage, session signée, déconnexion et permissions par rôle.
- [x] Vérifier les parcours d’accès avec états de traitement, erreur, succès et redirection pour accès non autorisé ; contrôle mobile/desktop effectué sur les shells.
- [x] Créer un nouveau checkpoint après validation de l’extension d’authentification.
