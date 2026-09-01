from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.access import stage_ids_visibles, verifier_acces_stage
from app.database import get_db
from app.deps import get_current_user, require_admin
from app.models.stage import Stage
from app.models.stagiaire import Stagiaire
from app.models.etablissement import Etablissement
from app.models.utilisateur import Utilisateur
from app.schemas.stage import StageAcademiqueCreate, StageCreate, StageRead, StageStatutUpdate
from app.state_machine import valider_stage
from app.enums import StatutStage, Role


def _valider_dates(date_debut: str, date_fin: str):
    from datetime import datetime
    debut = datetime.strptime(date_debut, "%Y-%m-%d").date()
    fin = datetime.strptime(date_fin, "%Y-%m-%d").date()
    if debut >= fin:
        raise HTTPException(
            status_code=400,
            detail="La date de début doit être antérieure à la date de fin",
        )


def _valider_etablissement(etablissement_id, db):
    if etablissement_id is None:
        return
    etablissement = db.query(Etablissement).filter(
        Etablissement.etablissement_id == etablissement_id
    ).first()
    if not etablissement:
        raise HTTPException(status_code=404, detail="Établissement référencé non trouvé")


def _valider_double_stage(stagiaire_id: UUID, db):
    stage_actif = db.query(Stage).filter(
        Stage.stagiaire_id == stagiaire_id,
        Stage.statut.in_(["EN_ATTENTE", "EN_COURS", "EVALUATION_EN_COURS"]),
    ).first()
    if stage_actif:
        raise HTTPException(
            status_code=409,
            detail="Ce stagiaire a déjà un stage en cours ou en attente",
        )

router = APIRouter(prefix="/stages", tags=["stages"])


@router.get("/", response_model=list[StageRead])
def list_stages(utilisateur: Utilisateur = Depends(get_current_user), db: Session = Depends(get_db)):
    ids = stage_ids_visibles(utilisateur, db)
    query = db.query(Stage)
    if ids is not None:
        query = query.filter(Stage.stage_id.in_(ids))
    return query.all()


@router.get("/{stage_id}", response_model=StageRead)
def get_stage(stage_id: UUID, utilisateur: Utilisateur = Depends(get_current_user), db: Session = Depends(get_db)):
    stage = db.query(Stage).filter(Stage.stage_id == stage_id).first()
    if not stage:
        raise HTTPException(status_code=404, detail="Stage non trouvé")
    verifier_acces_stage(utilisateur, stage_id, db)
    return stage


def _valider_encadreur(encadreur_id, db):
    if encadreur_id is None:
        return
    utilisateur = db.query(Utilisateur).filter(Utilisateur.id == encadreur_id).first()
    if not utilisateur:
        raise HTTPException(status_code=404, detail="Encadreur référencé non trouvé")
    if utilisateur.role != Role.SUPERVISOR.value:
        raise HTTPException(
            status_code=400,
            detail="L'utilisateur ciblé n'est pas un encadreur (rôle attendu: SUPERVISOR)",
        )


@router.post("/", response_model=StageRead, status_code=201)
def create_stage(data: StageCreate, _: Utilisateur = Depends(require_admin), db: Session = Depends(get_db)):
    stagiaire = db.query(Stagiaire).filter(Stagiaire.id == data.stagiaire_id).first()
    if not stagiaire:
        raise HTTPException(status_code=404, detail="Stagiaire référencé non trouvé")
    _valider_etablissement(data.etablissement_id, db)
    _valider_encadreur(data.encadreur_id, db)
    _valider_dates(data.date_debut, data.date_fin)
    _valider_double_stage(data.stagiaire_id, db)
    stage = Stage(**data.model_dump())
    db.add(stage)
    db.commit()
    db.refresh(stage)
    return stage


@router.post("/academique", response_model=StageRead, status_code=201)
def create_stage_academique(data: StageAcademiqueCreate, _: Utilisateur = Depends(require_admin), db: Session = Depends(get_db)):
    stagiaire = db.query(Stagiaire).filter(Stagiaire.id == data.stagiaire_id).first()
    if not stagiaire:
        raise HTTPException(status_code=404, detail="Stagiaire référencé non trouvé")
    etablissement = db.query(Etablissement).filter(
        Etablissement.etablissement_id == data.etablissement_id
    ).first()
    if not etablissement:
        raise HTTPException(status_code=404, detail="Établissement référencé non trouvé")
    _valider_encadreur(data.encadreur_id, db)
    _valider_dates(data.date_debut, data.date_fin)
    _valider_double_stage(data.stagiaire_id, db)
    stage = Stage(**data.model_dump())
    db.add(stage)
    db.commit()
    db.refresh(stage)
    return stage


@router.patch("/{stage_id}/encadreur", response_model=StageRead)
def assigner_encadreur(stage_id: UUID, encadreur_id: UUID, _: Utilisateur = Depends(require_admin), db: Session = Depends(get_db)):
    stage = db.query(Stage).filter(Stage.stage_id == stage_id).first()
    if not stage:
        raise HTTPException(status_code=404, detail="Stage non trouvé")
    _valider_encadreur(encadreur_id, db)
    stage.encadreur_id = encadreur_id
    db.commit()
    db.refresh(stage)
    return stage


@router.patch("/{stage_id}/statut", response_model=StageRead)
def update_stage_status(stage_id: UUID, data: StageStatutUpdate, _: Utilisateur = Depends(require_admin), db: Session = Depends(get_db)):
    stage = db.query(Stage).filter(Stage.stage_id == stage_id).first()
    if not stage:
        raise HTTPException(status_code=404, detail="Stage non trouvé")
    try:
        statut_actuel = StatutStage(stage.statut)
        statut_cible = StatutStage(data.statut)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Statut invalide: {e}")
    if not valider_stage(statut_actuel, statut_cible):
        raise HTTPException(
            status_code=400,
            detail=f"Transition de '{stage.statut}' vers '{data.statut}' non autorisée",
        )
    stage.statut = data.statut
    db.commit()
    db.refresh(stage)
    return stage

