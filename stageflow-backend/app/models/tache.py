import uuid
from sqlalchemy import Column, String, Text, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class Tache(Base):
    __tablename__ = "tache"

    tache_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    stage_id = Column(UUID(as_uuid=True), ForeignKey("stage.stage_id", ondelete="CASCADE"), nullable=False)
    titre = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    date_limite = Column(Date, nullable=True)
    priorite = Column(String(50), default="MOYENNE", nullable=False)
    statut_tache = Column(String(50), default="A_FAIRE", nullable=False)

    stage = relationship("Stage", back_populates="taches")
    soumissions = relationship("Soumission", back_populates="tache", cascade="all, delete-orphan")
