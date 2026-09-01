from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.deps import get_current_user, require_admin
from app.models.utilisateur import Utilisateur
from app.schemas.utilisateur import UtilisateurCreate, UtilisateurRead, MotDePasseUpdate
from app.security import hash_mot_de_passe

router = APIRouter(prefix="/utilisateurs", tags=["utilisateurs"])


@router.get("/", response_model=list[UtilisateurRead])
def list_utilisateurs(
    _: Utilisateur = Depends(require_admin), db: Session = Depends(get_db)
):
    return db.query(Utilisateur).all()


@router.get("/{utilisateur_id}", response_model=UtilisateurRead)
def get_utilisateur(
    utilisateur_id: UUID,
    _: Utilisateur = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Lecture du profil (sans mot_de_passe_hash) autorisée à tout utilisateur
    # connecté : les pages (dossier de stage) affichent l'encadreur/le stagiaire.
    user = db.query(Utilisateur).filter(Utilisateur.id == utilisateur_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    return user


@router.post("/", response_model=UtilisateurRead, status_code=201)
def create_utilisateur(
    data: UtilisateurCreate,
    _: Utilisateur = Depends(require_admin),
    db: Session = Depends(get_db),
):
    existing = db.query(Utilisateur).filter(Utilisateur.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Cet email est déjà utilisé")
    valeurs = data.model_dump()
    valeurs["mot_de_passe_hash"] = hash_mot_de_passe(valeurs.pop("mot_de_passe"))
    user = Utilisateur(**valeurs)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.patch("/{utilisateur_id}/mot_de_passe", response_model=UtilisateurRead)
def reinitialiser_mot_de_passe(
    utilisateur_id: UUID,
    data: MotDePasseUpdate,
    _: Utilisateur = Depends(require_admin),
    db: Session = Depends(get_db),
):
    user = db.query(Utilisateur).filter(Utilisateur.id == utilisateur_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    user.mot_de_passe_hash = hash_mot_de_passe(data.mot_de_passe)
    db.commit()
    db.refresh(user)
    return user