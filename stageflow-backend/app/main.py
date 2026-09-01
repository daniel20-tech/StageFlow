from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import (
    auth_router,
    utilisateurs_router,
    stagiaires_router,
    etablissements_router,
    stages_router,
    taches_router,
    documents_router,
    soumissions_router,
    permissions_router,
    evaluations_router,
)

# Le schéma est géré par Alembic (alembic upgrade head).
# Ne pas réintroduire Base.metadata.create_all ici : il n'altère pas
# les tables existantes et désynchronise le suivi des migrations.

app = FastAPI(title="StageFlow API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1")
app.include_router(utilisateurs_router, prefix="/api/v1")
app.include_router(stagiaires_router, prefix="/api/v1")
app.include_router(etablissements_router, prefix="/api/v1")
app.include_router(stages_router, prefix="/api/v1")
app.include_router(taches_router, prefix="/api/v1")
app.include_router(documents_router, prefix="/api/v1")
app.include_router(soumissions_router, prefix="/api/v1")
app.include_router(permissions_router, prefix="/api/v1")
app.include_router(evaluations_router, prefix="/api/v1")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/")
def root():
    return {"message": "StageFlow API is running"}
