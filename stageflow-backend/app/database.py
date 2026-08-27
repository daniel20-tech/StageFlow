from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# URL de connexion : postgresql://UTILISATEUR:MOT_DE_PASSE@HOST:PORT/NOM_BASE_DE_DONNEES
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:mot_de_passe@localhost:5432/stageflow_db"

# Moteur SQLAlchemy qui gère la connexion
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Gestionnaire de sessions pour effectuer des requêtes
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Classe de base dont hériteront tous nos modèles de tables
Base = declarative_base()

# Fonction pour récupérer une session de base de données à chaque requête HTTP
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
