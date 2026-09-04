"""Dépendances d'authentification et d'autorisation (FastAPI Depends)."""

from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.enums import Role
from app.models.utilisateur import Utilisateur
from app.security import decoder_access_token

_security = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_security),
    db: Session = Depends(get_db),
) -> Utilisateur:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentification requise",
            headers={"WWW-Authenticate": "Bearer"},
        )
    utilisateur_id = decoder_access_token(credentials.credentials)
    if utilisateur_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide ou expiré",
            headers={"WWW-Authenticate": "Bearer"},
        )
    utilisateur = db.query(Utilisateur).filter(
        Utilisateur.id == UUID(utilisateur_id)
    ).first()
    if not utilisateur:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Utilisateur introuvable",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return utilisateur


def require_roles(*roles: Role):
    """Retourne une dépendance autorisant uniquement les rôles passés."""

    def _guard(
        utilisateur: Utilisateur = Depends(get_current_user),
    ) -> Utilisateur:
        if utilisateur.role not in [r.value for r in roles]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Accès refusé : rôle insuffisant",
            )
        return utilisateur

    return _guard


require_admin = require_roles(Role.ADMINISTRATEUR)
require_staff = require_roles(Role.ADMINISTRATEUR, Role.ENCADREUR)