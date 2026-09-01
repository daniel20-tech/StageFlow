import uuid
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class Stagiaire(Base):
    __tablename__ = "stagiaire"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    utilisateur_id = Column(UUID(as_uuid=True), ForeignKey("utilisateur.id", ondelete="CASCADE"), unique=True, nullable=False)
    telephone = Column(String(30), nullable=True)
    adresse = Column(String(255), nullable=True)
    matricule = Column(String(50), unique=True, nullable=False)

    utilisateur = relationship("Utilisateur", back_populates="stagiaire_profile")
    stages = relationship("Stage", back_populates="stagiaire")
