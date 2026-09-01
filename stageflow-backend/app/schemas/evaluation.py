from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class _ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


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
    statut: str
    date_evaluation: datetime


class EvaluationStatutUpdate(BaseModel):
    statut: str
