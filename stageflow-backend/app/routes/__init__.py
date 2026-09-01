from app.routes.auth import router as auth_router
from app.routes.utilisateurs import router as utilisateurs_router
from app.routes.stagiaires import router as stagiaires_router
from app.routes.etablissements import router as etablissements_router
from app.routes.stages import router as stages_router
from app.routes.taches import router as taches_router
from app.routes.documents import router as documents_router
from app.routes.soumissions import router as soumissions_router
from app.routes.permissions import router as permissions_router
from app.routes.evaluations import router as evaluations_router

__all__ = [
    "auth_router",
    "utilisateurs_router",
    "stagiaires_router",
    "etablissements_router",
    "stages_router",
    "taches_router",
    "documents_router",
    "soumissions_router",
    "permissions_router",
    "evaluations_router",
]
