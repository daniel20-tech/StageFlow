from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import Base, engine, get_db
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

# 2. Endpoint de lecture simple des stages
@app.get("/api/v1/stages")
def get_stages(db: Session = Depends(get_db)):
    stages = db.query(Stage).all()
    return stages
