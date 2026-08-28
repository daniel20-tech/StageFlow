# AGENT.md - Engineering Guidelines for StageFlow

Ce document contient les consignes architecturales, les règles de qualité de code et la vision fonctionnelle que tout agent d'assistance de code doit respecter lors de la génération, du refactoring ou de la modification du projet.

---

## 1. 🎯 Objectif du Projet
**StageFlow** est une application web de gestion des stages académiques. Elle permet le suivi des étudiants, la gestion des conventions et documents, l'assignation de tâches, le suivi des soumissions, les demandes d'autorisation et l'évaluation des stagiaires.

---

## 2. ⚡ Directives de Propreté et de Qualité de Code (Règles d'Or)

Toute contribution de code doit respecter les contraintes suivantes :

1. **Boucles imbriquées :**
   * Éviter les boucles `for` ou `while` imbriquées lorsqu'elles rendent l'algorithme difficile à comprendre ou provoquent une complexité inutile.
   * Lorsqu'une logique nécessite une boucle imbriquée, l'extraire dans une fonction simple, nommée et réutilisable, puis appeler cette fonction depuis le flux principal.
   * Préférer lorsque c'est pertinent les dictionnaires, les indexations, les opérations d'ensembles et les requêtes SQL optimisées (`JOIN`, filtrage en base).
2. **Code propre, lisible et auto-documenté :**
   * Utiliser des noms de variables, fonctions, classes et fichiers en anglais, clairs et explicites.
   * Fonctions courtes respectant le principe de responsabilité unique (SRP).
   * Typage explicite (Type Hints en Python/FastAPI, TypeScript/PropTypes si applicable en React).
3. **Architecture et séparation des responsabilités :**
   * Séparer strictement la couche d'accès aux données (SQLAlchemy models), la validation des requêtes (Pydantic schemas) et la logique métier/routes (FastAPI endpoints).
   * Pas de requêtes SQL brutes ou complexes codées en dur dans les composants React ou dans les contrôleurs si elles peuvent être traitées via l'ORM ou la base.
4. **Gestion propre des erreurs :**
   * Renvoyer des exceptions HTTP explicites avec FastAPI (`HTTPException`) accompagnées d'un code statut adapté (`400`, `401`, `403`, `404`, `500`).
   * Toujours vérifier l'existence des ressources référencées par des clés étrangères avant traitement et utiliser des UUID valides pour les identifiants.

---

## 3. 📐 Spécifications Fonctionnelles & Règles Métier

### A. Modèle de Données & Flexibilité
* **Stage sans Établissement :** Un stage peut être créé sans structure d'accueil (`etablissement_id` nullable). L'agent ne doit jamais rendre la clé étrangère de l'établissement obligatoire lors de la création d'un stage.
* **Submission history :** Une tâche peut faire l'objet de plusieurs soumissions. Chaque soumission enregistre un numéro de version incrémenté (`version_number`).
* **Multiple documents :** Un stage peut être associé à plusieurs documents (`stage_document`), dont le suivi des retours/signatures est tracé via `requires_return`, `received_at` et `returned_at`.

### B. Machine à États Principale

L'agent doit respecter la logique de transition d'états :

* **STAGE:** `DRAFT` $\rightarrow$ `PENDING` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `EVALUATION_IN_PROGRESS` $\rightarrow$ `COMPLETED` (ou `CANCELLED`).
* **TASK:** `TODO` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `TO_REVIEW` $\rightarrow$ `CHANGES_REQUESTED` $\rightarrow$ `APPROVED`.
* **PERMISSION:** `PENDING` $\rightarrow$ `APPROVED` ou `REJECTED` (exige `decision_comment` si la demande est rejetée).
* **STAGE_DOCUMENT:** `PENDING` $\rightarrow$ `SUBMITTED` $\rightarrow$ `VALIDATED` ou `REJECTED`.

---

## 4. 🛠️ Stack Technique Officielle

* **Backend :** Python 3.10+, FastAPI, SQLAlchemy (ORM), Pydantic v2, Uvicorn.
* **Base de données :** PostgreSQL.
* **Frontend :** React.js (Vite / CRA) + Fetch/Axios.
* **Authentification :** JWT (JSON Web Tokens) avec rôles (`ADMIN`, `INTERN`, `SUPERVISOR`).
* **Password management :** la gestion des mots de passe n'est pas encore spécifiée ni implémentée. Ne pas ajouter de logique de mot de passe sans décision dédiée sur le hachage, la réinitialisation et la politique de sécurité.
* **Identifiers :** utiliser des UUID (`uuid.UUID` côté Python et `UUID` côté PostgreSQL) pour les clés primaires et étrangères. Ne pas remplacer les UUID par des entiers ou des chaînes arbitraires.

---

## 5. 📋 Modèle de Données (MLD de Référence)

Les 11 tables officielles du projet sont :
1. `user` (`id`, `last_name`, `first_name`, `email`, `password_hash`, `role`)
2. `administrator` (`user_id`)
3. `supervisor` (`user_id`)
4. `intern` (`id`, `user_id`, `phone`, `address`, `student_number`)
5. `institution` (`institution_id`, `name`, `city`, `notes`)
6. `internship` (`internship_id`, `intern_id`, `institution_id`, `supervisor_id`, `internship_type`, `theme`, `general_objective`, `start_date`, `end_date`, `status`)
7. `stage_document` (`document_id`, `internship_id`, `document_name`, `document_type`, `file_path`, `requires_return`, `document_status`, `received_at`, `returned_at`)
8. `task` (`task_id`, `internship_id`, `title`, `description`, `due_date`, `priority`, `task_status`)
9. `submission` (`submission_id`, `task_id`, `version_number`, `content_link`, `intern_comment`, `submitted_at`)
10. `permission` (`permission_id`, `internship_id`, `start_date`, `end_date`, `reason`, `permission_status`, `decision_comment`, `decided_at`)
11. `evaluation` (`evaluation_id`, `internship_id`, `evaluation_type`, `overall_score`, `feedback`, `evaluated_at`)

---

## 💡 Consigne pour OpenCode
Lors de la génération de code, vérifie systématiquement que les boucles imbriquées sont extraites dans des fonctions réutilisables lorsqu'elles sont nécessaires, que les endpoints respectent les types de données définis ci-dessus et que les identifiants utilisent des UUID.