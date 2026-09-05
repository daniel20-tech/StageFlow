# StageFlow

StageFlow est une plateforme web de gestion, de suivi et d'évaluation des stages. Elle centralise les informations administratives et pédagogiques d'un stage, depuis la création du dossier jusqu'à son évaluation finale.

## Fonctionnalités principales

- Gestion des comptes utilisateurs : administrateurs, encadreurs et stagiaires.
- Création et suivi des dossiers de stage : stagiaire, établissement d'accueil, encadreur, thème, objectifs et période.
- Suivi du cycle de vie d'un stage : brouillon, en attente, en cours, évaluation, terminé ou annulé.
- Attribution de tâches avec consignes, priorité, échéance et ressource associée.
- Soumission de livrables par le stagiaire, avec gestion automatique des versions et commentaires.
- Gestion documentaire : ajout, consultation, téléchargement, validation ou rejet de documents.
- Demandes de permission par les stagiaires et décision motivée par l'encadreur.
- Évaluations de stage avec note, appréciations et circuit de validation.
- Tableaux de bord et listes optimisées pour les encadreurs et les administrateurs.

## Rôles et droits

| Rôle | Responsabilités principales |
| --- | --- |
| Administrateur | Gère les utilisateurs, stagiaires, établissements, stages et l'ensemble des données. |
| Encadreur | Consulte les dossiers qui lui sont attribués, crée et suit les tâches, traite les permissions, documents et évaluations de ses stagiaires. |
| Stagiaire | Consulte son dossier, ses tâches et ses documents ; soumet ses livrables et formule des demandes de permission. |

Les accès sont contrôlés à la fois par rôle et par dossier de stage : un encadreur ne peut consulter que ses stagiaires et un stagiaire ne peut accéder qu'à son propre dossier.

## Règles métier

StageFlow applique des transitions de statut contrôlées afin d'éviter des changements incohérents :

- Un stage passe de `BROUILLON` à `EN_ATTENTE`, puis à `EN_COURS`, `EVALUATION_EN_COURS` et enfin `TERMINE`.
- Une tâche suit le parcours `A_FAIRE` → `EN_COURS` → `SOUMIS` → `VALIDE` ; elle peut être renvoyée en cours après soumission.
- Un document et une permission ne peuvent être validés ou rejetés qu'après leur soumission ou création.
- Un stagiaire ne peut pas avoir plusieurs stages actifs simultanément.

## Architecture

| Couche | Technologies |
| --- | --- |
| Interface web | React, Vite, Tailwind CSS, DaisyUI, Axios |
| API | Python, FastAPI, SQLAlchemy, Pydantic |
| Données | PostgreSQL, Alembic pour les migrations |
| Sécurité | JWT et hachage BCrypt des mots de passe |

Le dépôt est organisé en deux applications :

```text
stageflow-frontend/  # Application React
stageflow-backend/   # API FastAPI, modèles et migrations Alembic
```

## Prérequis

- Node.js 18 ou version supérieure
- Python 3.10 ou version supérieure
- PostgreSQL

## Lancement local

1. Créer une base PostgreSQL nommée `stageflow_db`.
2. Configurer l'accès à la base et la clé JWT :

   ```powershell
   $env:STAGEFLOW_DB_URL = "postgresql://utilisateur:mot_de_passe@localhost:5432/stageflow_db"
   $env:STAGEFLOW_SECRET_KEY = "une-cle-secrete-longue-et-aleatoire"
   ```

   `STAGEFLOW_DB_URL` est utilisée par Alembic. Pour l'API, renseigner actuellement la même URL dans `stageflow-backend/app/database.py` ; l'externalisation complète de cette valeur est recommandée avant un déploiement.

3. Installer les dépendances du backend puis appliquer les migrations :

   ```powershell
   cd stageflow-backend
   pip install -r requirements.txt
   alembic upgrade head
   uvicorn app.main:app --reload
   ```

4. Dans un second terminal, installer et démarrer le frontend :

   ```powershell
   cd stageflow-frontend
   npm install
   npm run dev
   ```

L'interface est accessible sur `http://localhost:5173` et l'API sur `http://localhost:8000`.

## API

L'API est préfixée par `/api/v1`. Une fois le backend démarré, la documentation interactive est disponible sur :

- `http://localhost:8000/docs`
- `http://localhost:8000/redoc`

## Migrations de base de données

Les changements de schéma sont gérés avec Alembic. Pour créer puis appliquer une migration :

```powershell
cd stageflow-backend
alembic revision --autogenerate -m "description_du_changement"
alembic upgrade head
```

---

By Daniel Officiel
