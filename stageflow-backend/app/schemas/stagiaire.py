from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class _ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


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
