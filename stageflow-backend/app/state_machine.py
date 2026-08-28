"""Machine à états du projet StageFlow (statuts en français, alignés sur les modèles).

Chaque entité expose une table de transitions explicite. La validation est déléguée
à une fonction simple ``est_transition_valide`` (pas de boucle imbriquée, SRP).
"""

from typing import Dict, Set

from app.enums import StatutStage, StatutTache, StatutPermission, StatutDocument

_TRANSITIONS_STAGE: Dict[StatutStage, Set[StatutStage]] = {
    StatutStage.BROUILLON: {StatutStage.EN_ATTENTE},
    StatutStage.EN_ATTENTE: {StatutStage.EN_COURS, StatutStage.ANNULE},
    StatutStage.EN_COURS: {StatutStage.EVALUATION_EN_COURS, StatutStage.ANNULE},
    StatutStage.EVALUATION_EN_COURS: {StatutStage.TERMINE, StatutStage.ANNULE},
    StatutStage.TERMINE: set(),
    StatutStage.ANNULE: set(),
}

_TRANSITIONS_TACHE: Dict[StatutTache, Set[StatutTache]] = {
    StatutTache.A_FAIRE: {StatutTache.EN_COURS},
    StatutTache.EN_COURS: {StatutTache.A_REVISER},
    StatutTache.A_REVISER: {StatutTache.CHANGEMENTS_DEMANDES, StatutTache.APPROUVE},
    StatutTache.CHANGEMENTS_DEMANDES: {StatutTache.EN_COURS, StatutTache.A_REVISER},
    StatutTache.APPROUVE: set(),
}

_TRANSITIONS_PERMISSION: Dict[StatutPermission, Set[StatutPermission]] = {
    StatutPermission.EN_ATTENTE: {StatutPermission.APPROUVE, StatutPermission.REJETE},
    StatutPermission.APPROUVE: set(),
    StatutPermission.REJETE: set(),
}

_TRANSITIONS_DOCUMENT: Dict[StatutDocument, Set[StatutDocument]] = {
    StatutDocument.EN_ATTENTE: {StatutDocument.SOUMIS},
    StatutDocument.SOUMIS: {StatutDocument.VALIDE, StatutDocument.REJETE},
    StatutDocument.VALIDE: set(),
    StatutDocument.REJETE: set(),
}


def est_transition_valide(actuel, cible, transitions) -> bool:
    return cible in transitions.get(actuel, set())


def valider_stage(actuel: StatutStage, cible: StatutStage) -> bool:
    return est_transition_valide(actuel, cible, _TRANSITIONS_STAGE)


def valider_tache(actuel: StatutTache, cible: StatutTache) -> bool:
    return est_transition_valide(actuel, cible, _TRANSITIONS_TACHE)


def valider_permission(actuel: StatutPermission, cible: StatutPermission) -> bool:
    return est_transition_valide(actuel, cible, _TRANSITIONS_PERMISSION)


def valider_document(actuel: StatutDocument, cible: StatutDocument) -> bool:
    return est_transition_valide(actuel, cible, _TRANSITIONS_DOCUMENT)
