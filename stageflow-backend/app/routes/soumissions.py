from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.access import verifier_acces_stage
from app.database import get_db
from app.deps import get_current_user, require_admin
from app.models.soumission import Soumission
from app.models.tache import Tache
from app.models.stage import Stage
from app.models.stagiaire import Stagiaire
from app.models.utilisateur import Utilisateur
from app.schemas.soumission import SoumissionCreate, SoumissionRead

router = APIRouter(prefix="/soumissions", tags=["soumissions"])


@router.get("/", response_model=list[SoumissionRead])
def list_soumissions(_: Utilisateur = Depends(require_admin), db: Session = Depends(get_db)):
    return db.query(Soumission).all()


@router.get("/tache/{tache_id}", response_model=list[SoumissionRead])
def list_soumissions_by_tache(tache_id: UUID, utilisateur: Utilisateur = Depends(get_current_user), db: Session = Depends(get_db)):
    tache = db.query(Tache).filter(Tache.tache_id == tache_id).first()
    if not tache:
        raise HTTPException(status_code=404, detail="Tâche non trouvée")
    verifier_acces_stage(utilisateur, tache.stage_id, db)
    return db.query(Soumission).filter(Soumission.tache_id == tache_id).order_by(Soumission.num_version).all()


@router.post("/", response_model=SoumissionRead, status_code=201)
def create_soumission(data: SoumissionCreate, utilisateur: Utilisateur = Depends(get_current_user), db: Session = Depends(get_db)):
    tache = db.query(Tache).filter(Tache.tache_id == data.tache_id).first()
    if not tache:
        raise HTTPException(status_code=404, detail="Tâche référencée non trouvée")
    is_owner = (
        db.query(Stagiaire.id)
        .join(Stage, Stage.stagiaire_id == Stagiaire.id)
        .filter(
            Stage.stage_id == tache.stage_id,
            Stagiaire.utilisateur_id == utilisateur.id,
        )
        .first()
    )
    if utilisateur.role != "ADMIN" and not is_owner:
        raise HTTPException(
            status_code=403, detail="Seul le stagiaire du stage peut soumettre un livrable"
        )
    last = (
        db.query(Soumission)
        .filter(Soumission.tache_id == data.tache_id)
        .order_by(Soumission.num_version.desc())
        .first()
    )
    next_version = (last.num_version + 1) if last else 1
    soumission = Soumission(**data.model_dump(), num_version=next_version)
    db.add(soumission)
    db.commit()
    db.refresh(soumission)
    return soumission

