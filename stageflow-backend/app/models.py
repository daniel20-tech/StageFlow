import uuid
from sqlalchemy import Column, String, Text, Date, DateTime, ForeignKey, Boolean, Integer, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

# --- Modèles Utilisateurs & Rôles ---

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


class Stagiaire(Base):
    __tablename__ = "stagiaire"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    utilisateur_id = Column(UUID(as_uuid=True), ForeignKey("utilisateur.id", ondelete="CASCADE"), unique=False, nullable=False)
    telephone = Column(String(30), nullable=True)
    adresse = Column(String(255), nullable=True)
    matricule = Column(String(50), unique=True, nullable=False)

    utilisateur = relationship("Utilisateur", back_populates="stagiaire_profile")
    stages = relationship("Stage", back_populates="stagiaire")


# --- Modèle Établissement ---

class Etablissement(Base):
    __tablename__ = "etablissement"

    etablissement_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nom = Column(String(255), nullable=False)
    ville = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)

    stages = relationship("Stage", back_populates="etablissement")


# --- Modèle Stage ---

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


# --- Modèles Métiers Dérivés ---

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


class Soumission(Base):
    __tablename__ = "soumission"

    soumison_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tache_id = Column(UUID(as_uuid=True), ForeignKey("tache.tache_id", ondelete="CASCADE"), nullable=False)
    num_version = Column(Integer, default=1, nullable=False)
    contenu_lien = Column(String(500), nullable=True)
    commentaire_stagiaire = Column(Text, nullable=True)
    date_soumission = Column(DateTime, server_default=func.now(), nullable=False)

    tache = relationship("Tache", back_populates="soumissions")


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


class Evaluation(Base):
    __tablename__ = "evaluation"

    evaluation_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    stage_id = Column(UUID(as_uuid=True), ForeignKey("stage.stage_id", ondelete="CASCADE"), nullable=False)
    type_eval = Column(String(100), nullable=False)
    note_globale = Column(Numeric(4, 2), nullable=True)
    appreciations = Column(Text, nullable=True)
    date_evaluation = Column(DateTime, server_default=func.now(), nullable=False)

    stage = relationship("Stage", back_populates="evaluations")