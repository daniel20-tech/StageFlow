"""Aide à l'accès par rôle sur les objets de métier (règle par rangée).

Modèle d'accès :
- ADMIN : toutes les opérations, tous les stages ;
- SUPERVISOR : lecture des stages dont il est encadreur (+ sous-ressources) ;
- INTERN : lecture des stages de son dossier de stagiaire (+ sous-ressources).
"""

from typing import List
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.stage import Stage
from app.models.stagiaire import Stagiaire
from app.models.utilisateur import Utilisateur
from app.models.tache import Tache


def stage_ids_visibles(utilisateur: Utilisateur, db: Session) -> List | None:
    """Liste des stage_id qu'un utilisateur peut voir. None = tous (ADMIN)."""
    if utilisateur.role == "ADMIN":
        return None
    query = db.query(Stage.stage_id)
    if utilisateur.role == "SUPERVISOR":
        return [r[0] for r in query.filter(Stage.encadreur_id == utilisateur.id).all()]
    ids = db.query(Stagiaire.id).filter(Stagiaire.utilisateur_id == utilisateur.id)
    return [r[0] for r in query.filter(Stage.stagiaire_id.in_(ids)).all()]


def verifier_acces_stage(utilisateur: Utilisateur, stage_id, db: Session) -> None:
    ids = stage_ids_visibles(utilisateur, db)
    if ids is None or stage_id in ids:
        return
    raise HTTPException(
        status_code=403, detail="Accès refusé : ce stage ne vous concerne pas"
    )


def verifier_acces_tache(utilisateur: Utilisateur, tache_id, db: Session) -> None:
    tache = db.query(Tache).filter(Tache.tache_id == tache_id).first()
    if not tache:
        raise HTTPException(status_code=404, detail="Tâche non trouvée")
    verifier_acces_stage(utilisateur, tache.stage_id, db)
    return tache