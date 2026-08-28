from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import Base, engine, get_db
from typing import List
from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from uuid import UUID
from app.models import Stage, Etablissement, Stagiaire, Utilisateur

# Crée automatiquement toutes les tables définies dans models.py dans PostgreSQL
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="StageFlow API",
    description="API de gestion des stages académiques",
    version="1.0.0"
)

# Configuration CORS pour autoriser React (qui tournera sur le port 5173 ou 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En dev, on autorise toutes les origines
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Endpoint de test (Healthcheck)
@app.get("/api/v1/healthcheck")
def healthcheck():
    return {"status": "ok", "message": "Backend FastAPI StageFlow fonctionnel !"}

# 2. Endpoint pour les stages SANS établissement (Stages simples)
@app.get("/api/v1/stages")
def get_stages_sans_etablissement(db: Session = Depends(get_db)):
    """
    Retourne uniquement les stages simples sans établissement.
    """
    stages = db.query(Stage).filter(Stage.etablissement_id.is_(None)).all()
    return stages


# 2. Endpoint pour les stages AVEC établissement
@app.get("/api/v1/stages/{etablissement_id}")
def get_stages_avec_etablissement(etablissement_id: UUID, db: Session = Depends(get_db)):
    """
    Retourne uniquement les stages rattachés à une structure / établissement.
    """
    stages = db.query(Stage).filter(Stage.etablissement_id.isnot(None)).all()
    return stages


