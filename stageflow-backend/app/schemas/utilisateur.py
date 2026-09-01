from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field
from app.enums import Role


class _ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class UtilisateurCreate(BaseModel):
    nom: str = Field(..., max_length=100)
    prenom: str = Field(..., max_length=100)
    email: str = Field(..., max_length=255)
    mot_de_passe: str = Field(..., min_length=8, max_length=128)
    role: Role


class MotDePasseUpdate(BaseModel):
    mot_de_passe: str = Field(..., min_length=8, max_length=128)


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
