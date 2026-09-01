from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.access import stage_ids_visibles, verifier_acces_stage, verifier_acces_tache
from app.database import get_db
from app.deps import get_current_user, require_admin
from app.models.tache import Tache
from app.models.stage import Stage
from app.models.utilisateur import Utilisateur
from app.schemas.tache import TacheCreate, TacheRead, TacheStatutUpdate
from app.state_machine import valider_tache
from app.enums import StatutTache

router = APIRouter(prefix="/taches", tags=["taches"])


@router.get("/", response_model=list[TacheRead])
def list_taches(utilisateur: Utilisateur = Depends(get_current_user), db: Session = Depends(get_db)):
    ids = stage_ids_visibles(utilisateur, db)
    query = db.query(Tache)
    if ids is not None:
        query = query.filter(Tache.stage_id.in_(ids))
    return query.all()


@router.get("/{tache_id}", response_model=TacheRead)
def get_tache(tache_id: UUID, utilisateur: Utilisateur = Depends(get_current_user), db: Session = Depends(get_db)):
    tache = verifier_acces_tache(utilisateur, tache_id, db)
    return tache


@router.post("/", response_model=TacheRead, status_code=201)
def create_tache(data: TacheCreate, _: Utilisateur = Depends(require_admin), db: Session = Depends(get_db)):
    stage = db.query(Stage).filter(Stage.stage_id == data.stage_id).first()
    if not stage:
        raise HTTPException(status_code=404, detail="Stage référencé non trouvé")
    tache = Tache(**data.model_dump())
    db.add(tache)
    db.commit()
    db.refresh(tache)
    return tache


@router.patch("/{tache_id}/statut", response_model=TacheRead)
def update_tache_status(tache_id: UUID, data: TacheStatutUpdate, _: Utilisateur = Depends(require_admin), db: Session = Depends(get_db)):
    tache = db.query(Tache).filter(Tache.tache_id == tache_id).first()
    if not tache:
        raise HTTPException(status_code=404, detail="Tâche non trouvée")
    try:
        statut_actuel = StatutTache(tache.statut_tache)
        statut_cible = StatutTache(data.statut_tache)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Statut invalide: {e}")
    if not valider_tache(statut_actuel, statut_cible):
        raise HTTPException(
            status_code=400,
            detail=f"Transition de '{tache.statut_tache}' vers '{data.statut_tache}' non autorisée",
        )
    tache.statut_tache = data.statut_tache
    db.commit()
    db.refresh(tache)
    return tache

