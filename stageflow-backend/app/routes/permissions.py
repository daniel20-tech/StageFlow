from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.access import stage_ids_visibles, verifier_acces_stage
from app.database import get_db
from app.deps import get_current_user, require_staff
from app.models.permission import Permission
from app.models.stage import Stage
from app.models.stagiaire import Stagiaire
from app.models.utilisateur import Utilisateur
from app.schemas.permission import PermissionCreate, PermissionRead, PermissionDecision
from app.state_machine import valider_permission
from app.enums import StatutPermission

router = APIRouter(prefix="/permissions", tags=["permissions"])


@router.get("/", response_model=list[PermissionRead])
def list_permissions(utilisateur: Utilisateur = Depends(get_current_user), db: Session = Depends(get_db)):
    ids = stage_ids_visibles(utilisateur, db)
    query = db.query(Permission)
    if ids is not None:
        query = query.filter(Permission.stage_id.in_(ids))
    return query.all()


@router.get("/{permission_id}", response_model=PermissionRead)
def get_permission(permission_id: UUID, utilisateur: Utilisateur = Depends(get_current_user), db: Session = Depends(get_db)):
    perm = db.query(Permission).filter(Permission.permission_id == permission_id).first()
    if not perm:
        raise HTTPException(status_code=404, detail="Permission non trouvée")
    verifier_acces_stage(utilisateur, perm.stage_id, db)
    return perm


@router.post("/", response_model=PermissionRead, status_code=201)
def create_permission(data: PermissionCreate, utilisateur: Utilisateur = Depends(get_current_user), db: Session = Depends(get_db)):
    stage = db.query(Stage).filter(Stage.stage_id == data.stage_id).first()
    if not stage:
        raise HTTPException(status_code=404, detail="Stage référencé non trouvé")
    is_owner = (
        db.query(Stagiaire.id)
        .join(Stage, Stage.stagiaire_id == Stagiaire.id)
        .filter(
            Stage.stage_id == data.stage_id,
            Stagiaire.utilisateur_id == utilisateur.id,
        )
        .first()
    )
    if utilisateur.role != "ADMIN" and not is_owner:
        raise HTTPException(
            status_code=403, detail="Seul le stagiaire du stage peut demander une permission"
        )
    perm = Permission(**data.model_dump())
    db.add(perm)
    db.commit()
    db.refresh(perm)
    return perm


@router.patch("/{permission_id}/decision", response_model=PermissionRead)
def decide_permission(permission_id: UUID, data: PermissionDecision, utilisateur: Utilisateur = Depends(require_staff), db: Session = Depends(get_db)):
    perm = db.query(Permission).filter(Permission.permission_id == permission_id).first()
    if not perm:
        raise HTTPException(status_code=404, detail="Permission non trouvée")
    stage = db.query(Stage).filter(Stage.stage_id == perm.stage_id).first()
    if utilisateur.role != "ADMIN" and stage and stage.encadreur_id != utilisateur.id:
        raise HTTPException(
            status_code=403,
            detail="Seul l'encadreur du stage peut statuer sur cette permission",
        )
    try:
        statut_actuel = StatutPermission(perm.statut_perm)
        statut_cible = StatutPermission(data.statut_perm)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Statut invalide: {e}")
    if not valider_permission(statut_actuel, statut_cible):
        raise HTTPException(
            status_code=400,
            detail=f"Transition de '{perm.statut_perm}' vers '{data.statut_perm}' non autorisée",
        )
    if statut_cible == StatutPermission.REJETE and not data.commentaire_decision:
        raise HTTPException(
            status_code=400,
            detail="Un commentaire est obligatoire lors du rejet",
        )
    perm.statut_perm = data.statut_perm
    perm.commentaire_decision = data.commentaire_decision
    perm.date_decision = datetime.now()
    db.commit()
    db.refresh(perm)
    return perm

