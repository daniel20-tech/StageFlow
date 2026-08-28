from datetime import datetime, date
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.enums import Role


class _ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


# --- Utilisateurs & Rôles ---


class UtilisateurCreate(BaseModel):
    nom: str = Field(..., max_length=100)
    prenom: str = Field(..., max_length=100)
    email: str = Field(..., max_length=255)
    mot_de_passe_hash: str = Field(..., max_length=255)
    role: Role


class UtilisateurRead(_ORMModel):
    id: UUID
    nom: str
    prenom: str
    email: str
    role: Role


class AdministrateurCreate(BaseModel):
    utilisateur_id: UUID


class EncadreurCreate(BaseModel):
    utilisateur_id: UUID


class StagiaireCreate(BaseModel):
    utilisateur_id: UUID
    telephone: Optional[str] = Field(default=None, max_length=30)
    adresse: Optional[str] = Field(default=None, max_length=255)
    matricule: str = Field(..., max_length=50)


class StagiaireRead(_ORMModel):
    id: UUID
    utilisateur_id: UUID
    telephone: Optional[str] = None
    adresse: Optional[str] = None
    matricule: str


# --- Établissement ---


class EtablissementCreate(BaseModel):
    nom: str = Field(..., max_length=255)
    ville: Optional[str] = Field(default=None, max_length=100)
    notes: Optional[str] = None


class EtablissementRead(_ORMModel):
    etablissement_id: UUID
    nom: str
    ville: Optional[str] = None
    notes: Optional[str] = None


# --- Stage ---


class StageCreate(BaseModel):
    stagiaire_id: UUID
    etablissement_id: Optional[UUID] = None  # nullable : un stage peut exister sans établissement
    encadreur_id: Optional[UUID] = None
    type_stage: str = Field(..., max_length=100)
    theme: str = Field(..., max_length=255)
    objectif_general: Optional[str] = None
    date_debut: date
    date_fin: date


class StageRead(_ORMModel):
    stage_id: UUID
    stagiaire_id: UUID
    etablissement_id: Optional[UUID] = None
    encadreur_id: Optional[UUID] = None
    type_stage: str
    theme: str
    objectif_general: Optional[str] = None
    date_debut: date
    date_fin: date
    statut: str


class StageStatutUpdate(BaseModel):
    statut: str


# --- DocumentStage ---


class DocumentStageCreate(BaseModel):
    stage_id: UUID
    nom_doc: str = Field(..., max_length=255)
    type_doc: str = Field(..., max_length=100)
    chemin_fichier: str = Field(..., max_length=500)
    a_retourner: bool = False


class DocumentStageRead(_ORMModel):
    document_id: UUID
    stage_id: UUID
    nom_doc: str
    type_doc: str
    chemin_fichier: str
    a_retourner: bool
    statut_doc: str
    date_reception: Optional[datetime] = None
    date_retour: Optional[datetime] = None


class DocumentStageStatutUpdate(BaseModel):
    statut_doc: str


# --- Tache ---


class TacheCreate(BaseModel):
    stage_id: UUID
    titre: str = Field(..., max_length=255)
    description: Optional[str] = None
    date_limite: Optional[date] = None
    priorite: str = Field(default="MOYENNE", max_length=50)


class TacheRead(_ORMModel):
    tache_id: UUID
    stage_id: UUID
    titre: str
    description: Optional[str] = None
    date_limite: Optional[date] = None
    priorite: str
    statut_tache: str


class TacheStatutUpdate(BaseModel):
    statut_tache: str


# --- Soumission ---


class SoumissionCreate(BaseModel):
    tache_id: UUID
    contenu_lien: Optional[str] = Field(default=None, max_length=500)
    commentaire_stagiaire: Optional[str] = None


class SoumissionRead(_ORMModel):
    soumison_id: UUID
    tache_id: UUID
    num_version: int
    contenu_lien: Optional[str] = None
    commentaire_stagiaire: Optional[str] = None
    date_soumission: datetime


# --- Permission ---


class PermissionCreate(BaseModel):
    stage_id: UUID
    date_debut: datetime
    date_fin: datetime
    motif: str


class PermissionRead(_ORMModel):
    permission_id: UUID
    stage_id: UUID
    date_debut: datetime
    date_fin: datetime
    motif: str
    statut_perm: str
    commentaire_decision: Optional[str] = None
    date_decision: Optional[datetime] = None


class PermissionDecision(BaseModel):
    statut_perm: str
    commentaire_decision: Optional[str] = None


# --- Evaluation ---


class EvaluationCreate(BaseModel):
    stage_id: UUID
    type_eval: str = Field(..., max_length=100)
    note_globale: Optional[float] = Field(default=None, ge=0, le=100)
    appreciations: Optional[str] = None


class EvaluationRead(_ORMModel):
    evaluation_id: UUID
    stage_id: UUID
    type_eval: str
    note_globale: Optional[float] = None
    appreciations: Optional[str] = None
    date_evaluation: datetime
