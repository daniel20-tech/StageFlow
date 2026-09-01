import uuid
from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Soumission(Base):
    __tablename__ = "soumission"

    soumison_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tache_id = Column(UUID(as_uuid=True), ForeignKey("tache.tache_id", ondelete="CASCADE"), nullable=False)
    num_version = Column(Integer, default=1, nullable=False)
    contenu_lien = Column(String(500), nullable=True)
    commentaire_stagiaire = Column(Text, nullable=True)
    date_soumission = Column(DateTime, server_default=func.now(), nullable=False)

    tache = relationship("Tache", back_populates="soumissions")
