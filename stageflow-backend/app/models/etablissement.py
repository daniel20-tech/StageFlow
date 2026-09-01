import uuid
from sqlalchemy import Column, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class Etablissement(Base):
    __tablename__ = "etablissement"

    etablissement_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nom = Column(String(255), nullable=False)
    ville = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)

    stages = relationship("Stage", back_populates="etablissement")
