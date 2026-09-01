from enum import Enum


class Role(str, Enum):
    ADMIN = "ADMIN"
    INTERN = "INTERN"
    SUPERVISOR = "SUPERVISOR"


class StatutStage(str, Enum):
    BROUILLON = "BROUILLON"
    EN_ATTENTE = "EN_ATTENTE"
    EN_COURS = "EN_COURS"
    EVALUATION_EN_COURS = "EVALUATION_EN_COURS"
    TERMINE = "TERMINE"
    ANNULE = "ANNULE"


class StatutTache(str, Enum):
    A_FAIRE = "A_FAIRE"
    EN_COURS = "EN_COURS"
    A_REVISER = "A_REVISER"
    CHANGEMENTS_DEMANDES = "CHANGEMENTS_DEMANDES"
    APPROUVE = "APPROUVE"


class StatutPermission(str, Enum):
    EN_ATTENTE = "EN_ATTENTE"
    APPROUVE = "APPROUVE"
    REJETE = "REJETE"


class StatutDocument(str, Enum):
    EN_ATTENTE = "EN_ATTENTE"
    SOUMIS = "SOUMIS"
    VALIDE = "VALIDE"
    REJETE = "REJETE"


class StatutEvaluation(str, Enum):
    BROUILLON = "BROUILLON"
    SOUMISE = "SOUMISE"
    VALIDEE = "VALIDEE"
    REJETEE = "REJETEE"
