"""Sécurité : hachage des mots de passe et tokens JWT.

Le secret de signature est lu depuis la variable d'environnement
``STAGEFLOW_SECRET_KEY`` et tombe sur une valeur de développement. Il doit
être surchargé en production.
"""

import os
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt

SECRET_KEY = os.environ.get("STAGEFLOW_SECRET_KEY", "stageflow-dev-secret-change-me")
ALGORITHM = "HS256"
ACCES_TOKEN_EXPIRE_MINUTES = 60 * 12


def hash_mot_de_passe(mot_de_passe: str) -> str:
    return bcrypt.hashpw(mot_de_passe.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verifier_mot_de_passe(mot_de_passe: str, hash_stocke: str) -> bool:
    try:
        return bcrypt.checkpw(
            mot_de_passe.encode("utf-8"), hash_stocke.encode("utf-8")
        )
    except ValueError:
        return False


def creer_access_token(utilisateur_id: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCES_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": utilisateur_id, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decoder_access_token(token: str) -> str | None:
    """Retourne l'identifiant utilisateur du token, ou None s'il est invalide/expiré."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except jwt.PyJWTError:
        return None