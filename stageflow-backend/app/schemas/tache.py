from datetime import date
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class _ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


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
