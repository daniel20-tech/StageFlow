import uuid
from sqlalchemy import Column, String, Text, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class Stage(Base):
    __tablename__ = "stage"

    stage_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    stagiaire_id = Column(UUID(as_uuid=True), ForeignKey("stagiaire.id", ondelete="CASCADE"), nullable=False)
    etablissement_id = Column(UUID(as_uuid=True), ForeignKey("etablissement.etablissement_id", ondelete="SET NULL"), nullable=True)
    encadreur_id = Column(UUID(as_uuid=True), ForeignKey("utilisateur.id", ondelete="SET NULL"), nullable=True)
    type_stage = Column(String(100), nullable=False)
    theme = Column(String(255), nullable=False)
    objectif_general = Column(Text, nullable=True)
    date_debut = Column(Date, nullable=False)
    date_fin = Column(Date, nullable=False)
    statut = Column(String(50), default="BROUILLON", nullable=False)

    stagiaire = relationship("Stagiaire", back_populates="stages")
    etablissement = relationship("Etablissement", back_populates="stages")
    documents = relationship("DocumentStage", back_populates="stage", cascade="all, delete-orphan")
    taches = relationship("Tache", back_populates="stage", cascade="all, delete-orphan")
    permissions = relationship("Permission", back_populates="stage", cascade="all, delete-orphan")
    evaluations = relationship("Evaluation", back_populates="stage", cascade="all, delete-orphan")
