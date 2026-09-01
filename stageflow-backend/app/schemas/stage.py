from datetime import date
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class _ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class StageCreate(BaseModel):
    stagiaire_id: UUID
    etablissement_id: Optional[UUID] = None
    encadreur_id: Optional[UUID] = None
    type_stage: str = Field(..., max_length=100)
    theme: str = Field(..., max_length=255)
    objectif_general: Optional[str] = None
    date_debut: str
    date_fin: str


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


class StageAcademiqueCreate(BaseModel):
    stagiaire_id: UUID
    etablissement_id: UUID
    encadreur_id: Optional[UUID] = None
    type_stage: str = Field(..., max_length=100)
    theme: str = Field(..., max_length=255)
    objectif_general: Optional[str] = None
    date_debut: str
    date_fin: str


class StageStatutUpdate(BaseModel):
    statut: str
