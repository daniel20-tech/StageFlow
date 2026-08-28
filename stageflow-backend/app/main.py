from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import Base, engine, get_db
from app import models, schemas
from app.enums import StatutStage, StatutTache, StatutPermission, StatutDocument
from app.state_machine import (
    valider_stage,
    valider_tache,
    valider_permission,
    valider_document,
)

# Crée automatiquement toutes les tables définies dans models.py dans PostgreSQL
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="StageFlow API",
    description="API de gestion des stages académiques",
    version="1.0.0",
)

# Configuration CORS pour autoriser React (qui tournera sur le port 5173 ou 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _objet_ou_404(db: Session, model, identite: UUID):
    objet = db.get(model, identite)
    if objet is None:
        raise HTTPException(status_code=404, detail=f"{model.__name__} introuvable")
    return objet


def _verifier_relation(db: Session, model, identite: UUID, nom: str):
    if db.get(model, identite) is None:
        raise HTTPException(status_code=404, detail=f"{nom} référencé introuvable")


# ---------------------------------------------------------------------------
# 1. Healthcheck & lecture simple des stages (existants)
# ---------------------------------------------------------------------------


@app.get("/api/v1/healthcheck")
def healthcheck():
    return {"status": "ok", "message": "Backend FastAPI StageFlow fonctionnel !"}


@app.get("/api/v1/stages", response_model=list[schemas.StageRead])
def get_stages(db: Session = Depends(get_db)):
    return db.query(models.Stage).all()


# ---------------------------------------------------------------------------
# 2. Utilisateurs & rôles
# ---------------------------------------------------------------------------


@app.post("/api/v1/utilisateurs", response_model=schemas.UtilisateurRead, status_code=201)
def creer_utilisateur(payload: schemas.UtilisateurCreate, db: Session = Depends(get_db)):
    utilisateur = models.Utilisateur(**payload.model_dump())
    db.add(utilisateur)
    db.commit()
    db.refresh(utilisateur)
    return utilisateur


@app.get("/api/v1/utilisateurs", response_model=list[schemas.UtilisateurRead])
def lister_utilisateurs(db: Session = Depends(get_db)):
    return db.query(models.Utilisateur).all()


@app.get("/api/v1/utilisateurs/{utilisateur_id}", response_model=schemas.UtilisateurRead)
def get_utilisateur(utilisateur_id: UUID, db: Session = Depends(get_db)):
    return _objet_ou_404(db, models.Utilisateur, utilisateur_id)


@app.post("/api/v1/administrateurs", response_model=schemas.UtilisateurRead, status_code=201)
def creer_administrateur(payload: schemas.AdministrateurCreate, db: Session = Depends(get_db)):
    _verifier_relation(db, models.Utilisateur, payload.utilisateur_id, "Utilisateur")
    db.add(models.Administrateur(utilisateur_id=payload.utilisateur_id))
    db.commit()
    return _objet_ou_404(db, models.Utilisateur, payload.utilisateur_id)


@app.post("/api/v1/encadreurs", response_model=schemas.UtilisateurRead, status_code=201)
def creer_encadreur(payload: schemas.EncadreurCreate, db: Session = Depends(get_db)):
    _verifier_relation(db, models.Utilisateur, payload.utilisateur_id, "Utilisateur")
    db.add(models.Encadreur(utilisateur_id=payload.utilisateur_id))
    db.commit()
    return _objet_ou_404(db, models.Utilisateur, payload.utilisateur_id)


@app.post("/api/v1/stagiaires", response_model=schemas.StagiaireRead, status_code=201)
def creer_stagiaire(payload: schemas.StagiaireCreate, db: Session = Depends(get_db)):
    _verifier_relation(db, models.Utilisateur, payload.utilisateur_id, "Utilisateur")
    stagiaire = models.Stagiaire(**payload.model_dump())
    db.add(stagiaire)
    db.commit()
    db.refresh(stagiaire)
    return stagiaire


@app.get("/api/v1/stagiaires", response_model=list[schemas.StagiaireRead])
def lister_stagiaires(db: Session = Depends(get_db)):
    return db.query(models.Stagiaire).all()


@app.get("/api/v1/stagiaires/{stagiaire_id}", response_model=schemas.StagiaireRead)
def get_stagiaire(stagiaire_id: UUID, db: Session = Depends(get_db)):
    return _objet_ou_404(db, models.Stagiaire, stagiaire_id)


# ---------------------------------------------------------------------------
# 3. Établissement
# ---------------------------------------------------------------------------


@app.post("/api/v1/etablissements", response_model=schemas.EtablissementRead, status_code=201)
def creer_etablissement(payload: schemas.EtablissementCreate, db: Session = Depends(get_db)):
    etablissement = models.Etablissement(**payload.model_dump())
    db.add(etablissement)
    db.commit()
    db.refresh(etablissement)
    return etablissement


@app.get("/api/v1/etablissements", response_model=list[schemas.EtablissementRead])
def lister_etablissements(db: Session = Depends(get_db)):
    return db.query(models.Etablissement).all()


@app.get("/api/v1/etablissements/{etablissement_id}", response_model=schemas.EtablissementRead)
def get_etablissement(etablissement_id: UUID, db: Session = Depends(get_db)):
    return _objet_ou_404(db, models.Etablissement, etablissement_id)


# ---------------------------------------------------------------------------
# 4. Stage + machine à états
# ---------------------------------------------------------------------------


@app.post("/api/v1/stages", response_model=schemas.StageRead, status_code=201)
def creer_stage(payload: schemas.StageCreate, db: Session = Depends(get_db)):
    _verifier_relation(db, models.Stagiaire, payload.stagiaire_id, "Stagiaire")
    if payload.etablissement_id is not None:
        _verifier_relation(db, models.Etablissement, payload.etablissement_id, "Établissement")
    stage = models.Stage(**payload.model_dump())
    db.add(stage)
    db.commit()
    db.refresh(stage)
    return stage


@app.get("/api/v1/stages/{stage_id}", response_model=schemas.StageRead)
def get_stage(stage_id: UUID, db: Session = Depends(get_db)):
    return _objet_ou_404(db, models.Stage, stage_id)


@app.patch("/api/v1/stages/{stage_id}/statut", response_model=schemas.StageRead)
def maj_statut_stage(stage_id: UUID, payload: schemas.StageStatutUpdate, db: Session = Depends(get_db)):
    stage = _objet_ou_404(db, models.Stage, stage_id)
    actuel = StatutStage(stage.statut)
    cible = StatutStage(payload.statut)
    if actuel != cible and not valider_stage(actuel, cible):
        raise HTTPException(
            status_code=400,
            detail=f"Transition de stage invalide : {actuel.value} -> {cible.value}",
        )
    stage.statut = cible.value
    db.commit()
    db.refresh(stage)
    return stage


# ---------------------------------------------------------------------------
# 5. DocumentStage + machine à états
# ---------------------------------------------------------------------------


@app.post("/api/v1/documents", response_model=schemas.DocumentStageRead, status_code=201)
def creer_document(payload: schemas.DocumentStageCreate, db: Session = Depends(get_db)):
    _verifier_relation(db, models.Stage, payload.stage_id, "Stage")
    document = models.DocumentStage(**payload.model_dump())
    db.add(document)
    db.commit()
    db.refresh(document)
    return document


@app.get("/api/v1/documents", response_model=list[schemas.DocumentStageRead])
def lister_documents(db: Session = Depends(get_db)):
    return db.query(models.DocumentStage).all()


@app.patch("/api/v1/documents/{document_id}/statut", response_model=schemas.DocumentStageRead)
def maj_statut_document(
    document_id: UUID, payload: schemas.DocumentStageStatutUpdate, db: Session = Depends(get_db)
):
    document = _objet_ou_404(db, models.DocumentStage, document_id)
    actuel = StatutDocument(document.statut_doc)
    cible = StatutDocument(payload.statut_doc)
    if actuel != cible and not valider_document(actuel, cible):
        raise HTTPException(
            status_code=400,
            detail=f"Transition de document invalide : {actuel.value} -> {cible.value}",
        )
    document.statut_doc = cible.value
    db.commit()
    db.refresh(document)
    return document


# ---------------------------------------------------------------------------
# 6. Tache + machine à états
# ---------------------------------------------------------------------------


@app.post("/api/v1/taches", response_model=schemas.TacheRead, status_code=201)
def creer_tache(payload: schemas.TacheCreate, db: Session = Depends(get_db)):
    _verifier_relation(db, models.Stage, payload.stage_id, "Stage")
    tache = models.Tache(**payload.model_dump())
    db.add(tache)
    db.commit()
    db.refresh(tache)
    return tache


@app.get("/api/v1/taches", response_model=list[schemas.TacheRead])
def lister_taches(db: Session = Depends(get_db)):
    return db.query(models.Tache).all()


@app.patch("/api/v1/taches/{tache_id}/statut", response_model=schemas.TacheRead)
def maj_statut_tache(tache_id: UUID, payload: schemas.TacheStatutUpdate, db: Session = Depends(get_db)):
    tache = _objet_ou_404(db, models.Tache, tache_id)
    actuel = StatutTache(tache.statut_tache)
    cible = StatutTache(payload.statut_tache)
    if actuel != cible and not valider_tache(actuel, cible):
        raise HTTPException(
            status_code=400,
            detail=f"Transition de tâche invalide : {actuel.value} -> {cible.value}",
        )
    tache.statut_tache = cible.value
    db.commit()
    db.refresh(tache)
    return tache


# ---------------------------------------------------------------------------
# 7. Soumission (numéro de version incrémenté)
# ---------------------------------------------------------------------------


@app.post("/api/v1/soumissions", response_model=schemas.SoumissionRead, status_code=201)
def creer_soumission(payload: schemas.SoumissionCreate, db: Session = Depends(get_db)):
    _verifier_relation(db, models.Tache, payload.tache_id, "Tâche")
    derniere_version = (
        db.query(func.max(models.Soumission.num_version))
        .filter(models.Soumission.tache_id == payload.tache_id)
        .scalar()
    )
    soumission = models.Soumission(
        tache_id=payload.tache_id,
        num_version=(derniere_version or 0) + 1,
        contenu_lien=payload.contenu_lien,
        commentaire_stagiaire=payload.commentaire_stagiaire,
    )
    db.add(soumission)
    db.commit()
    db.refresh(soumission)
    return soumission


@app.get("/api/v1/soumissions/tache/{tache_id}", response_model=list[schemas.SoumissionRead])
def lister_soumissions_tache(tache_id: UUID, db: Session = Depends(get_db)):
    _verifier_relation(db, models.Tache, tache_id, "Tâche")
    return db.query(models.Soumission).filter(models.Soumission.tache_id == tache_id).all()


# ---------------------------------------------------------------------------
# 8. Permission + décision (commentaire requis si rejet)
# ---------------------------------------------------------------------------


@app.post("/api/v1/permissions", response_model=schemas.PermissionRead, status_code=201)
def creer_permission(payload: schemas.PermissionCreate, db: Session = Depends(get_db)):
    _verifier_relation(db, models.Stage, payload.stage_id, "Stage")
    permission = models.Permission(**payload.model_dump())
    db.add(permission)
    db.commit()
    db.refresh(permission)
    return permission


@app.get("/api/v1/permissions", response_model=list[schemas.PermissionRead])
def lister_permissions(db: Session = Depends(get_db)):
    return db.query(models.Permission).all()


@app.patch("/api/v1/permissions/{permission_id}/decision", response_model=schemas.PermissionRead)
def decisision_permission(
    permission_id: UUID, payload: schemas.PermissionDecision, db: Session = Depends(get_db)
):
    permission = _objet_ou_404(db, models.Permission, permission_id)
    cible = StatutPermission(payload.statut_perm)
    actuel = StatutPermission(permission.statut_perm)
    if actuel != cible and not valider_permission(actuel, cible):
        raise HTTPException(
            status_code=400,
            detail=f"Transition de permission invalide : {actuel.value} -> {cible.value}",
        )
    if cible == StatutPermission.REJETE and not payload.commentaire_decision:
        raise HTTPException(
            status_code=400,
            detail="Un commentaire de décision est requis lors d'un rejet",
        )
    permission.statut_perm = cible.value
    permission.commentaire_decision = payload.commentaire_decision
    db.commit()
    db.refresh(permission)
    return permission


# ---------------------------------------------------------------------------
# 9. Evaluation
# ---------------------------------------------------------------------------


@app.post("/api/v1/evaluations", response_model=schemas.EvaluationRead, status_code=201)
def creer_evaluation(payload: schemas.EvaluationCreate, db: Session = Depends(get_db)):
    _verifier_relation(db, models.Stage, payload.stage_id, "Stage")
    evaluation = models.Evaluation(**payload.model_dump())
    db.add(evaluation)
    db.commit()
    db.refresh(evaluation)
    return evaluation


@app.get("/api/v1/evaluations", response_model=list[schemas.EvaluationRead])
def lister_evaluations(db: Session = Depends(get_db)):
    return db.query(models.Evaluation).all()
