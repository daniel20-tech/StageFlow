from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class _ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


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
