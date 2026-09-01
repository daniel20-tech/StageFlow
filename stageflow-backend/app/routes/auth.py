from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models.utilisateur import Utilisateur
from app.schemas.auth import LoginRequest, LoginResponse
from app.security import creer_access_token, verifier_mot_de_passe

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    utilisateur = db.query(Utilisateur).filter(
        Utilisateur.email == data.email
    ).first()
    if not utilisateur or not verifier_mot_de_passe(
        data.mot_de_passe, utilisateur.mot_de_passe_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect",
        )
    return LoginResponse(
        access_token=creer_access_token(str(utilisateur.id)),
        utilisateur_id=str(utilisateur.id),
        nom=utilisateur.nom,
        prenom=utilisateur.prenom,
        email=utilisateur.email,
        role=utilisateur.role,
    )


@router.get("/me", response_model=LoginResponse)
def me(utilisateur: Utilisateur = Depends(get_current_user)):
    return LoginResponse(
        access_token="",
        utilisateur_id=str(utilisateur.id),
        nom=utilisateur.nom,
        prenom=utilisateur.prenom,
        email=utilisateur.email,
        role=utilisateur.role,
    )