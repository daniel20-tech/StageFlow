from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.access import stage_ids_visibles, verifier_acces_stage
from app.database import get_db
from app.deps import get_current_user, require_staff
from app.models.evaluation import Evaluation
from app.models.stage import Stage
from app.models.utilisateur import Utilisateur
from app.schemas.evaluation import EvaluationCreate, EvaluationRead, EvaluationStatutUpdate
from app.state_machine import valider_evaluation
from app.enums import StatutEvaluation

router = APIRouter(prefix="/evaluations", tags=["evaluations"])


@router.get("/", response_model=list[EvaluationRead])
def list_evaluations(utilisateur: Utilisateur = Depends(get_current_user), db: Session = Depends(get_db)):
    ids = stage_ids_visibles(utilisateur, db)
    query = db.query(Evaluation)
    if ids is not None:
        query = query.filter(Evaluation.stage_id.in_(ids))
    return query.all()


@router.get("/{evaluation_id}", response_model=EvaluationRead)
def get_evaluation(evaluation_id: UUID, utilisateur: Utilisateur = Depends(get_current_user), db: Session = Depends(get_db)):
    ev = db.query(Evaluation).filter(Evaluation.evaluation_id == evaluation_id).first()
    if not ev:
        raise HTTPException(status_code=404, detail="Évaluation non trouvée")
    verifier_acces_stage(utilisateur, ev.stage_id, db)
    return ev


@router.post("/", response_model=EvaluationRead, status_code=201)
def create_evaluation(data: EvaluationCreate, utilisateur: Utilisateur = Depends(require_staff), db: Session = Depends(get_db)):
    stage = db.query(Stage).filter(Stage.stage_id == data.stage_id).first()
    if not stage:
        raise HTTPException(status_code=404, detail="Stage référencé non trouvé")
    if utilisateur.role != "ADMIN" and stage.encadreur_id != utilisateur.id:
        raise HTTPException(
            status_code=403,
            detail="Seul l'encadreur du stage peut créer une évaluation",
        )
    ev = Evaluation(**data.model_dump())
    db.add(ev)
    db.commit()
    db.refresh(ev)
    return ev


@router.patch("/{evaluation_id}/statut", response_model=EvaluationRead)
def update_evaluation_status(evaluation_id: UUID, data: EvaluationStatutUpdate, utilisateur: Utilisateur = Depends(require_staff), db: Session = Depends(get_db)):
    ev = db.query(Evaluation).filter(Evaluation.evaluation_id == evaluation_id).first()
    if not ev:
        raise HTTPException(status_code=404, detail="Évaluation non trouvée")
    stage = db.query(Stage).filter(Stage.stage_id == ev.stage_id).first()
    if utilisateur.role != "ADMIN" and stage and stage.encadreur_id != utilisateur.id:
        raise HTTPException(
            status_code=403,
            detail="Seul l'encadreur du stage peut faire évoluer le statut de l'évaluation",
        )
    try:
        statut_actuel = StatutEvaluation(ev.statut)
        statut_cible = StatutEvaluation(data.statut)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Statut invalide: {e}")
    if not valider_evaluation(statut_actuel, statut_cible):
        raise HTTPException(
            status_code=400,
            detail=f"Transition de '{ev.statut}' vers '{data.statut}' non autorisée",
        )
    ev.statut = data.statut
    db.commit()
    db.refresh(ev)
    return ev



