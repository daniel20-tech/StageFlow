from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict


class _ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


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
