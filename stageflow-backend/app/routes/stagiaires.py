from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload, selectinload
from uuid import UUID

from app.database import get_db
from app.deps import get_current_user, require_admin
from app.enums import Role
from app.models.stagiaire import Stagiaire
from app.models.stage import Stage
from app.models.utilisateur import Utilisateur
from app.schemas.stagiaire import (
    StagiaireCreate,
    StagiaireRead,
    StagiaireReadWithStages,
    StagiaireCompact,
    StagiaireListResponse,
)

router = APIRouter(prefix="/stagiaires", tags=["stagiaires"])


@router.get("/", response_model=list[StagiaireRead])
def list_stagiaires(
    _: Utilisateur = Depends(require_admin),
    db: Session = Depends(get_db),
    limit: int = Query(200, ge=1, le=500),
):
    return db.query(Stagiaire).options(joinedload(Stagiaire.utilisateur)).limit(limit).all()


@router.get("/compact", response_model=StagiaireListResponse)
def list_stagiaires_compact(
    _: Utilisateur = Depends(require_admin),
    db: Session = Depends(get_db),
    offset: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=500),
):
    """Liste légère pour la vue principale : docs condensés, aucune jointure profonde."""
    total = db.query(Stagiaire).count()
    stagiaires = (
        db.query(Stagiaire)
        .options(
            joinedload(Stagiaire.utilisateur),
            selectinload(Stagiaire.stages).selectinload(Stage.documents),
        )
        .order_by(Stagiaire.matricule)
        .offset(offset)
        .limit(limit)
        .all()
    )
    items = []
    for s in stagiaires:
        docs = [
            {"type_doc": d.type_doc, "statut_doc": d.statut_doc}
            for st in s.stages
            for d in (st.documents or [])
        ]
        items.append(StagiaireCompact(
            id=s.id,
            utilisateur_id=s.utilisateur_id,
            matricule=s.matricule,
            filiere=s.filiere,
            utilisateur=s.utilisateur,
            documents=docs,
        ))
    return StagiaireListResponse(total=total, items=items)


@router.get("/{stagiaire_id}", response_model=StagiaireRead)
def get_stagiaire(stagiaire_id: UUID, utilisateur: Utilisateur = Depends(get_current_user), db: Session = Depends(get_db)):
    stagiaire = db.query(Stagiaire).filter(Stagiaire.id == stagiaire_id).first()
    if not stagiaire:
        raise HTTPException(status_code=404, detail="Stagiaire non trouvé")
    if utilisateur.role != Role.ADMINISTRATEUR.value and stagiaire.utilisateur_id != utilisateur.id:
        raise HTTPException(status_code=403, detail="Accès refusé : fichier d'un autre stagiaire")
    return stagiaire


@router.get("/{stagiaire_id}/with-stages", response_model=StagiaireReadWithStages)
def get_stagiaire_with_stages(stagiaire_id: UUID, utilisateur: Utilisateur = Depends(get_current_user), db: Session = Depends(get_db)):
    stagiaire = (
        db.query(Stagiaire)
        .options(
            joinedload(Stagiaire.utilisateur),
            joinedload(Stagiaire.stages).joinedload(Stage.documents),
            joinedload(Stagiaire.stages).joinedload(Stage.etablissement),
            joinedload(Stagiaire.stages).joinedload(Stage.encadreur),
        )
        .filter(Stagiaire.id == stagiaire_id)
        .first()
    )
    if not stagiaire:
        raise HTTPException(status_code=404, detail="Stagiaire non trouvé")
    if utilisateur.role != Role.ADMINISTRATEUR.value and stagiaire.utilisateur_id != utilisateur.id:
        raise HTTPException(status_code=403, detail="Accès refusé : fichier d'un autre stagiaire")
    return stagiaire


@router.post("/", response_model=StagiaireRead, status_code=201)
def create_stagiaire(data: StagiaireCreate, _: Utilisateur = Depends(require_admin), db: Session = Depends(get_db)):
    user = db.query(Utilisateur).filter(Utilisateur.id == data.utilisateur_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur référencé non trouvé")
    existing = db.query(Stagiaire).filter(Stagiaire.matricule == data.matricule).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ce matricule est déjà utilisé")
    stagiaire = Stagiaire(**data.model_dump())
    db.add(stagiaire)
    db.commit()
    db.refresh(stagiaire)
    return stagiaire

