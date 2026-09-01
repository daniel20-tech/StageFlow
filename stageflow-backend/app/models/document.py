import uuid
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class DocumentStage(Base):
    __tablename__ = "document_stage"

    document_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    stage_id = Column(UUID(as_uuid=True), ForeignKey("stage.stage_id", ondelete="CASCADE"), nullable=False)
    nom_doc = Column(String(255), nullable=False)
    type_doc = Column(String(100), nullable=False)
    chemin_fichier = Column(String(500), nullable=False)
    a_retourner = Column(Boolean, default=False, nullable=False)
    statut_doc = Column(String(50), default="EN_ATTENTE", nullable=False)
    date_reception = Column(DateTime, nullable=True)
    date_retour = Column(DateTime, nullable=True)

    stage = relationship("Stage", back_populates="documents")
