from datetime import date, datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class _ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class UtilisateurStagiaire(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    nom: str
    prenom: str
    email: str


class DocumentStageLight(_ORMModel):
    document_id: UUID
    nom_doc: str
    type_doc: str
    statut_doc: str
    a_retourner: bool
    date_reception: Optional[datetime] = None
    date_retour: Optional[datetime] = None


class EtablissementStage(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    etablissement_id: UUID
    nom: str


class EncadreurStage(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    nom: str
    prenom: str
    email: str


class StagePourStagiaire(_ORMModel):
    stage_id: UUID
    etablissement_id: Optional[UUID] = None
    encadreur_id: Optional[UUID] = None
    type_stage: str
    theme: str
    objectif_general: Optional[str] = None
    date_debut: date
    date_fin: date
    statut: str
    etablissement: Optional[EtablissementStage] = None
    encadreur: Optional[EncadreurStage] = None
    documents: list[DocumentStageLight] = []


class DocumentCompact(_ORMModel):
    type_doc: str
    statut_doc: str


class StagiaireCompact(_ORMModel):
    id: UUID
    utilisateur_id: UUID
    matricule: str
    filiere: Optional[str] = None
    utilisateur: Optional[UtilisateurStagiaire] = None
    documents: list[DocumentCompact] = []


class StagiaireListResponse(_ORMModel):
    total: int
    items: list[StagiaireCompact] = []


class StagiaireCreate(BaseModel):
    utilisateur_id: UUID
    telephone: Optional[str] = Field(default=None, max_length=30)
    adresse: Optional[str] = Field(default=None, max_length=255)
    matricule: str = Field(..., max_length=50)
    filiere: Optional[str] = Field(default=None, max_length=100)
    periode_stage: Optional[str] = Field(default=None, max_length=100)


class StagiaireRead(_ORMModel):
    id: UUID
    utilisateur_id: UUID
    telephone: Optional[str] = None
    adresse: Optional[str] = None
    matricule: str
    filiere: Optional[str] = None
    periode_stage: Optional[str] = None
    utilisateur: Optional[UtilisateurStagiaire] = None


class StagiaireReadWithStages(_ORMModel):
    id: UUID
    utilisateur_id: UUID
    telephone: Optional[str] = None
    adresse: Optional[str] = None
    matricule: str
    filiere: Optional[str] = None
    periode_stage: Optional[str] = None
    utilisateur: Optional[UtilisateurStagiaire] = None
    stages: list[StagePourStagiaire] = []
