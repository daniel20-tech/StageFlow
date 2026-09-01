import uuid
from sqlalchemy import Column, String, Text, Numeric, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Evaluation(Base):
    __tablename__ = "evaluation"

    evaluation_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    stage_id = Column(UUID(as_uuid=True), ForeignKey("stage.stage_id", ondelete="CASCADE"), nullable=False)
    type_eval = Column(String(100), nullable=False)
    note_globale = Column(Numeric(4, 2), nullable=True)
    appreciations = Column(Text, nullable=True)
    statut = Column(String(50), default="BROUILLON", nullable=False)
    date_evaluation = Column(DateTime, server_default=func.now(), nullable=False)

    stage = relationship("Stage", back_populates="evaluations")
