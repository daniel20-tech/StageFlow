from typing import Optional
from pydantic import BaseModel


class LoginRequest(BaseModel):
    email: str
    mot_de_passe: str


class TokenRead(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginResponse(TokenRead):
    utilisateur_id: str
    nom: str
    prenom: str
    email: str
    role: str