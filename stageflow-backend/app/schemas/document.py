from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class _ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


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
