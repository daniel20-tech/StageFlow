import uuid
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class Utilisateur(Base):
    __tablename__ = "utilisateur"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nom = Column(String(100), nullable=False)
    prenom = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    mot_de_passe_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)

    stagiaire_profile = relationship("Stagiaire", back_populates="utilisateur", uselist=False)


class Administrateur(Base):
    __tablename__ = "administrateur"

    utilisateur_id = Column(UUID(as_uuid=True), ForeignKey("utilisateur.id", ondelete="CASCADE"), primary_key=True)


class Encadreur(Base):
    __tablename__ = "encadreur"

    utilisateur_id = Column(UUID(as_uuid=True), ForeignKey("utilisateur.id", ondelete="CASCADE"), primary_key=True)
    departement = Column(String(100), nullable=True)
    specialite = Column(String(100), nullable=True)
