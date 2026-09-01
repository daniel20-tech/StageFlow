from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class _ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class EtablissementCreate(BaseModel):
    nom: str = Field(..., max_length=255)
    ville: Optional[str] = Field(default=None, max_length=100)
    notes: Optional[str] = None


class EtablissementRead(_ORMModel):
    etablissement_id: UUID
    nom: str
    ville: Optional[str] = None
    notes: Optional[str] = None
