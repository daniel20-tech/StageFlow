import os
import uuid
from datetime import datetime
from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse
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

UPLOAD_DIR = Path(__file__).resolve().parent.parent / "uploads"

ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg", ".xls", ".xlsx"}
MAX_SIZE = 10 * 1024 * 1024  # 10 MB


def _sauvegarder_fichier(upload: UploadFile) -> str:
    suffix = Path(upload.filename or "").suffix.lower() if upload.filename else ""
    if suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Format de fichier non autorisé : {suffix or 'inconnu'} (PDF/DOCX/images uniquement)",
        )
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    unique = f"{uuid.uuid4().hex}{suffix}"
    chemin = UPLOAD_DIR / unique
    try:
        with chemin.open("wb") as buffer:
            while chunk := upload.file.read(1024 * 1024):
                buffer.write(chunk)
    except OSError as e:
        raise HTTPException(status_code=500, detail=f"Erreur d'écriture du fichier : {e}")
    if chemin.stat().st_size > MAX_SIZE:
        chemin.unlink(missing_ok=True)
        raise HTTPException(status_code=400, detail="Le fichier dépasse la taille maximale de 10 Mo")
    return unique


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


@router.get("/{document_id}/fichier")
def telecharger_fichier(document_id: UUID, utilisateur: Utilisateur = Depends(get_current_user), db: Session = Depends(get_db)):
    doc = db.query(DocumentStage).filter(DocumentStage.document_id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document non trouvé")
    verifier_acces_stage(utilisateur, doc.stage_id, db)
    chemin = UPLOAD_DIR / doc.chemin_fichier
    if not chemin.exists():
        raise HTTPException(status_code=404, detail="Fichier introuvable sur le serveur")
    return FileResponse(chemin, filename=doc.nom_doc)


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


@router.post("/upload", response_model=DocumentStageRead, status_code=201)
def upload_document(
    stage_id: UUID = Form(...),
    type_doc: str = Form(...),
    nom_doc: str | None = Form(None),
    statut_doc: str = Form("EN_ATTENTE"),
    a_retourner: bool = Form(False),
    file: UploadFile = File(...),
    _: Utilisateur = Depends(require_admin),
    db: Session = Depends(get_db),
):
    stage = db.query(Stage).filter(Stage.stage_id == stage_id).first()
    if not stage:
        raise HTTPException(status_code=404, detail="Stage référencé non trouvé")

    try:
        statut = StatutDocument(statut_doc)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Statut invalide : {statut_doc}")

    nom = nom_doc or (file.filename or "document")
    stored_name = _sauvegarder_fichier(file)
    taille = (UPLOAD_DIR / stored_name).stat().st_size

    doc = DocumentStage(
        stage_id=stage_id,
        nom_doc=nom,
        type_doc=type_doc,
        chemin_fichier=stored_name,
        taille_fichier=taille,
        a_retourner=a_retourner,
        statut_doc=statut.value,
        date_reception=datetime.utcnow(),
    )
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


@router.delete("/{document_id}", status_code=204)
def delete_document(document_id: UUID, _: Utilisateur = Depends(require_admin), db: Session = Depends(get_db)):
    doc = db.query(DocumentStage).filter(DocumentStage.document_id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document non trouvé")
    chemin = UPLOAD_DIR / doc.chemin_fichier
    chemin.unlink(missing_ok=True)
    db.delete(doc)
    db.commit()
