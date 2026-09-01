import uuid
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class Permission(Base):
    __tablename__ = "permission"

    permission_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    stage_id = Column(UUID(as_uuid=True), ForeignKey("stage.stage_id", ondelete="CASCADE"), nullable=False)
    date_debut = Column(DateTime, nullable=False)
    date_fin = Column(DateTime, nullable=False)
    motif = Column(Text, nullable=False)
    statut_perm = Column(String(50), default="EN_ATTENTE", nullable=False)
    commentaire_decision = Column(Text, nullable=True)
    date_decision = Column(DateTime, nullable=True)

    stage = relationship("Stage", back_populates="permissions")
