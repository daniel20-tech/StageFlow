from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.access import verifier_acces_stage
from app.database import get_db
from app.deps import get_current_user, require_admin
from app.models.document import DocumentStage
from app.models.stage import Stage
from app.models.utilisateur import Utilisateur
from app.schemas.document import DocumentStageCreate, DocumentStageRead, DocumentStageStatutUpdate
from app.state_machine import valider_document
from app.enums import StatutDocument

router = APIRouter(prefix="/documents", tags=["documents"])


@router.get("/", response_model=list[DocumentStageRead])
def list_documents(stage_id: UUID | None = None, utilisateur: Utilisateur = Depends(get_current_user), db: Session = Depends(get_db)):
    query = db.query(DocumentStage)
    if stage_id is not None:
        verifier_acces_stage(utilisateur, stage_id, db)
        query = query.filter(DocumentStage.stage_id == stage_id)
    return query.all()


@router.get("/{document_id}", response_model=DocumentStageRead)
def get_document(document_id: UUID, utilisateur: Utilisateur = Depends(get_current_user), db: Session = Depends(get_db)):
    doc = db.query(DocumentStage).filter(DocumentStage.document_id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document non trouvé")
    verifier_acces_stage(utilisateur, doc.stage_id, db)
    return doc


@router.post("/", response_model=DocumentStageRead, status_code=201)
def create_document(data: DocumentStageCreate, _: Utilisateur = Depends(require_admin), db: Session = Depends(get_db)):
    stage = db.query(Stage).filter(Stage.stage_id == data.stage_id).first()
    if not stage:
        raise HTTPException(status_code=404, detail="Stage référencé non trouvé")
    doc = DocumentStage(**data.model_dump())
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


@router.patch("/{document_id}/statut", response_model=DocumentStageRead)
def update_document_status(document_id: UUID, data: DocumentStageStatutUpdate, _: Utilisateur = Depends(require_admin), db: Session = Depends(get_db)):
    doc = db.query(DocumentStage).filter(DocumentStage.document_id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document non trouvé")
    try:
        statut_actuel = StatutDocument(doc.statut_doc)
        statut_cible = StatutDocument(data.statut_doc)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Statut invalide: {e}")
    if not valider_document(statut_actuel, statut_cible):
        raise HTTPException(
            status_code=400,
            detail=f"Transition de '{doc.statut_doc}' vers '{data.statut_doc}' non autorisée",
        )
    doc.statut_doc = data.statut_doc
    db.commit()
    db.refresh(doc)
    return doc

