from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.deps import get_current_user, require_admin
from app.models.stagiaire import Stagiaire
from app.models.utilisateur import Utilisateur
from app.schemas.stagiaire import StagiaireCreate, StagiaireRead

router = APIRouter(prefix="/stagiaires", tags=["stagiaires"])


@router.get("/", response_model=list[StagiaireRead])
def list_stagiaires(_: Utilisateur = Depends(require_admin), db: Session = Depends(get_db)):
    return db.query(Stagiaire).all()


@router.get("/{stagiaire_id}", response_model=StagiaireRead)
def get_stagiaire(stagiaire_id: UUID, utilisateur: Utilisateur = Depends(get_current_user), db: Session = Depends(get_db)):
    stagiaire = db.query(Stagiaire).filter(Stagiaire.id == stagiaire_id).first()
    if not stagiaire:
        raise HTTPException(status_code=404, detail="Stagiaire non trouvé")
    if utilisateur.role != "ADMIN" and stagiaire.utilisateur_id != utilisateur.id:
        raise HTTPException(status_code=403, detail="Accès refusé : fichier d'un autre stagiaire")
    return stagiaire


@router.post("/", response_model=StagiaireRead, status_code=201)
def create_stagiaire(data: StagiaireCreate, _: Utilisateur = Depends(require_admin), db: Session = Depends(get_db)):
    user = db.query(Utilisateur).filter(Utilisateur.id == data.utilisateur_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur référencé non trouvé")
    existing = db.query(Stagiaire).filter(Stagiaire.matricule == data.matricule).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ce matricule est déjà utilisé")
    stagiaire = Stagiaire(**data.model_dump())
    db.add(stagiaire)
    db.commit()
    db.refresh(stagiaire)
    return stagiaire

