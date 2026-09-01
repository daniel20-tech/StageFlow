from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.deps import get_current_user, require_admin
from app.models.etablissement import Etablissement
from app.models.utilisateur import Utilisateur
from app.schemas.etablissement import EtablissementCreate, EtablissementRead

router = APIRouter(prefix="/etablissements", tags=["etablissements"])


@router.get("/", response_model=list[EtablissementRead])
def list_etablissements(_: Utilisateur = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Etablissement).all()


@router.get("/{etablissement_id}", response_model=EtablissementRead)
def get_etablissement(etablissement_id: UUID, _: Utilisateur = Depends(get_current_user), db: Session = Depends(get_db)):
    etab = db.query(Etablissement).filter(Etablissement.etablissement_id == etablissement_id).first()
    if not etab:
        raise HTTPException(status_code=404, detail="Établissement non trouvé")
    return etab


@router.post("/", response_model=EtablissementRead, status_code=201)
def create_etablissement(data: EtablissementCreate, _: Utilisateur = Depends(require_admin), db: Session = Depends(get_db)):
    etab = Etablissement(**data.model_dump())
    db.add(etab)
    db.commit()
    db.refresh(etab)
    return etab

