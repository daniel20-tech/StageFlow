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


class CompteCreate(BaseModel):
    role: Role
    nom: str = Field(..., max_length=100)
    prenom: str = Field(..., max_length=100)
    email: str = Field(..., max_length=255)
    mot_de_passe: str = Field(..., min_length=8, max_length=128)
    telephone: Optional[str] = Field(default=None, max_length=30)
    adresse: Optional[str] = Field(default=None, max_length=255)
    matricule: Optional[str] = Field(default=None, max_length=50)
    filiere: Optional[str] = Field(default=None, max_length=100)
    periode_stage: Optional[str] = Field(default=None, max_length=100)
    departement: Optional[str] = Field(default=None, max_length=100)
    specialite: Optional[str] = Field(default=None, max_length=100)


class MotDePasseUpdate(BaseModel):
    mot_de_passe: str = Field(..., min_length=8, max_length=128)


class UtilisateurRead(_ORMModel):
    id: UUID
    nom: str
    prenom: str
    email: str
    role: Role


class EncadreurRead(_ORMModel):
    utilisateur_id: UUID
    departement: Optional[str] = None
    specialite: Optional[str] = None


class AdministrateurCreate(BaseModel):
    utilisateur_id: UUID


class EncadreurCreate(BaseModel):
    utilisateur_id: UUID
