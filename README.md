
# TIME DNA — Leave Management

Application web de gestion des congés permettant aux employés de soumettre leurs demandes et aux managers/RH de suivre, approuver ou refuser les absences.

---

##  Présentation

**TIME DNA** est une application de gestion des congés développée dans le cadre d'un projet de formation.

L'application permet de centraliser la gestion des absences et de faciliter le workflow entre :

- Employé
- Manager
- Ressources Humaines (RH)

L'objectif est de proposer une solution simple, moderne et intuitive pour gérer les demandes de congés.

---

##  Objectifs du projet

L'application permet notamment de :

- Authentifier les utilisateurs
- Consulter le profil de l'employé
- Consulter le solde de congés
- Créer une demande de congé
- Consulter l'historique des demandes
- Permettre au manager de traiter les demandes
- Accepter ou refuser une demande
- Permettre au service RH de gérer le workflow
- Suivre les absences des collaborateurs
- Gérer les différents types de congés

---

##  Rôles utilisateurs

###  Employé

L'employé peut :

- Se connecter à son espace personnel
- Consulter son profil
- Consulter ses soldes de congés
- Créer une demande de congé
- Ajouter les informations nécessaires à sa demande
- Consulter l'état de ses demandes
- Consulter son historique

###  Manager

Le manager peut :

- Consulter les demandes de son équipe
- Consulter les détails d'une demande
- Approuver une demande
- Refuser une demande
- Ajouter un motif de refus
- Suivre les absences de son équipe

### RH

Le service RH peut :

- Consulter les demandes transmises par les managers
- Valider ou refuser les demandes
- Gérer les types de congés
- Suivre les soldes
- Superviser les absences

---

#  Workflow d'une demande

Le traitement d'une demande suit le workflow suivant :
**use case//
<img width="550" height="425" alt="Screenshot 2026-08-28 223116" src="https://github.com/user-attachments/assets/8d54183f-5a9b-4f44-8500-acb0c51d0a87" />
**uml diagrame//
<img width="295" height="296" alt="Screenshot 2026-08-29 182257" src="https://github.com/user-attachments/assets/fb510d73-8ec1-4e9e-ba04-2380ce11007e" />

      RH       Rejet
      │
   ┌──┴──┐
   │     │
 Accepte Refuse
   │     │
   ▼     ▼
 Approuvé Rejet
