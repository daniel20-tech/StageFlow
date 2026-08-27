import uuid
from sqlalchemy import Column, String, Text, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base

class Utilisateur(Base):
    __tablename__ = "utilisateur"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nom = Column(String, nullable=False)
    prenom = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    mot_de_passe_hash = Column(String, nullable=False)
    role = Column(String, nullable=False)

class Stagiaire(Base):
    __tablename__ = "stagiaire"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    utilisateur_id = Column(UUID(as_uuid=True), ForeignKey("utilisateur.id"), unique=True, nullable=False)
    telephone = Column(String, nullable=True)
    adresse = Column(String, nullable=True)
    matricule = Column(String, unique=True, nullable=False)

class Etablissement(Base):
    __tablename__ = "etablissement"

    etablissement_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nom = Column(String, nullable=False)
    ville = Column(String, nullable=True)
    notes = Column(Text, nullable=True)

class Stage(Base):
    __tablename__ = "stage"

    stage_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    stagiaire_id = Column(UUID(as_uuid=True), ForeignKey("stagiaire.id"), nullable=False)

    # nullable=True permet de créer un stage SANS établissement d'accueil !
    etablissement_id = Column(UUID(as_uuid=True), ForeignKey("etablissement.etablissement_id"), nullable=True)

    encadreur_id = Column(UUID(as_uuid=True), ForeignKey("utilisateur.id"), nullable=True)
    type_stage = Column(String, nullable=False)
    theme = Column(String, nullable=False)
    objectif_general = Column(Text, nullable=True)
    date_debut = Column(Date, nullable=False)
    date_fin = Column(Date, nullable=False)
    statut = Column(String, default="BROUILLON", nullable=False)
