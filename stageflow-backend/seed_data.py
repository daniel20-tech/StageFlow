import uuid
from datetime import date
from app.database import engine, SessionLocal
from app.models import Utilisateur, Stagiaire, Stage, Etablissement, DocumentStage, Administrateur, Encadreur
from app.security import hash_mot_de_passe

db = SessionLocal()

try:
    # ========== ÉTABLISSEMENTS ==========
    etab1 = Etablissement(
        etablissement_id=uuid.uuid4(),
        nom="Faculté des Sciences, Université d'Ebolowa",
        ville='Ebolowa',
        notes='BP 171 Ebolowa, Cameroun - Tel: +237 22 23 45 67 - contact@fs.univ-ebolowa.cm'
    )
    etab2 = Etablissement(
        etablissement_id=uuid.uuid4(),
        nom='Institut Inter-États (ISSEA)',
        ville='Yaoundé',
        notes='BP 6113 Yaoundé, Cameroun - Tel: +237 22 20 12 34 - contact@issea.org'
    )
    db.add_all([etab1, etab2])
    db.flush()
    print(f'[OK] Établissements créés: {etab1.nom}, {etab2.nom}')

    # ========== ADMINISTRATEUR ==========
    admin_user = Utilisateur(
        id=uuid.uuid4(),
        nom='Mvondo',
        prenom='Daniel',
        email='danielmvondo700@gmail.com',
        mot_de_passe_hash=hash_mot_de_passe('danieladmin'),
        role='ADMINISTRATEUR'
    )
    db.add(admin_user)
    db.flush()
    admin = Administrateur(utilisateur_id=admin_user.id)
    db.add(admin)
    print(f'[OK] Administrateur créé: {admin_user.prenom} {admin_user.nom}')

    # ========== ENCADREURS ==========
    enc1_user = Utilisateur(
        id=uuid.uuid4(),
        nom='Ngono',
        prenom='Jean-Pierre',
        email='jp.ngono@univ-ebolowa.cm',
        mot_de_passe_hash=hash_mot_de_passe('encadreur1'),
        role='ENCADREUR'
    )
    enc2_user = Utilisateur(
        id=uuid.uuid4(),
        nom='Mballa',
        prenom='Marie-Claire',
        email='mc.mballa@issea.org',
        mot_de_passe_hash=hash_mot_de_passe('encadreur2'),
        role='ENCADREUR'
    )
    db.add_all([enc1_user, enc2_user])
    db.flush()
    
    enc1 = Encadreur(utilisateur_id=enc1_user.id)
    enc2 = Encadreur(utilisateur_id=enc2_user.id)
    db.add_all([enc1, enc2])
    print(f'[OK] Encadreurs créés: {enc1_user.prenom} {enc1_user.nom}, {enc2_user.prenom} {enc2_user.nom}')

    # ========== STAGIAIRES + STAGES + DOCUMENTS ==========
    # Stagiaire 1 - Stage académique, encadreur 1, établissement 1, 2 docs
    stagiaire1_user = Utilisateur(
        id=uuid.uuid4(),
        nom='Essomba',
        prenom='Alice',
        email='alice.essomba@etudiant.univ-ebolowa.cm',
        mot_de_passe_hash=hash_mot_de_passe('stagiaire1'),
        role='STAGIAIRE'
    )
    db.add(stagiaire1_user)
    db.flush()
    
    stagiaire1 = Stagiaire(
        id=uuid.uuid4(),
        utilisateur_id=stagiaire1_user.id,
        telephone='+237 677 11 22 33',
        adresse='Quartier Mvog-Mbi, Ebolowa',
        matricule='STG-2024-001'
    )
    db.add(stagiaire1)
    db.flush()
    
    stage1 = Stage(
        stage_id=uuid.uuid4(),
        stagiaire_id=stagiaire1.id,
        etablissement_id=etab1.etablissement_id,
        encadreur_id=enc1_user.id,
        type_stage='ACADEMIQUE',
        theme='Étude de la biodiversité des milieux forestiers tropicaux',
        objectif_general='Analyser la diversité floristique et faunistique dans la réserve de la Dja',
        date_debut=date(2024, 7, 1),
        date_fin=date(2024, 9, 30),
        statut='EN_COURS'
    )
    db.add(stage1)
    db.flush()
    
    docs1 = [
        DocumentStage(
            document_id=uuid.uuid4(),
            stage_id=stage1.stage_id,
            nom_doc='Demande de stage',
            type_doc='DEMANDE_STAGE',
            chemin_fichier='/documents/stg-2024-001/demande_stage.pdf',
            statut_doc='VALIDE'
        ),
        DocumentStage(
            document_id=uuid.uuid4(),
            stage_id=stage1.stage_id,
            nom_doc='Attestation de stage',
            type_doc='ATTESTATION_STAGE',
            chemin_fichier='/documents/stg-2024-001/attestation_stage.pdf',
            statut_doc='EN_ATTENTE'
        )
    ]
    db.add_all(docs1)
    print(f'[OK] Stagiaire 1: {stagiaire1_user.prenom} {stagiaire1_user.nom} - Stage: {stage1.theme} - {len(docs1)} documents')

    # Stagiaire 2 - Stage pro, établissement 1, SANS encadreur, 2 docs
    stagiaire2_user = Utilisateur(
        id=uuid.uuid4(),
        nom='Owona',
        prenom='Bruno',
        email='bruno.owona@etudiant.univ-ebolowa.cm',
        mot_de_passe_hash=hash_mot_de_passe('stagiaire2'),
        role='STAGIAIRE'
    )
    db.add(stagiaire2_user)
    db.flush()
    
    stagiaire2 = Stagiaire(
        id=uuid.uuid4(),
        utilisateur_id=stagiaire2_user.id,
        telephone='+237 699 44 55 66',
        adresse='Quartier Ngoulémakong, Ebolowa',
        matricule='STG-2024-002'
    )
    db.add(stagiaire2)
    db.flush()
    
    stage2 = Stage(
        stage_id=uuid.uuid4(),
        stagiaire_id=stagiaire2.id,
        etablissement_id=etab1.etablissement_id,
        encadreur_id=None,
        type_stage='PROFESSIONNEL',
        theme="Développement d'une application de gestion des stocks pour le laboratoire de biologie",
        objectif_general='Concevoir et implémenter une solution logicielle pour le suivi des réactifs et matériels',
        date_debut=date(2024, 6, 15),
        date_fin=date(2024, 12, 15),
        statut='EN_COURS'
    )
    db.add(stage2)
    db.flush()
    
    docs2 = [
        DocumentStage(
            document_id=uuid.uuid4(),
            stage_id=stage2.stage_id,
            nom_doc='CV Bruno Owona',
            type_doc='CV',
            chemin_fichier='/documents/stg-2024-002/cv_bruno_owona.pdf',
            statut_doc='VALIDE'
        ),
        DocumentStage(
            document_id=uuid.uuid4(),
            stage_id=stage2.stage_id,
            nom_doc='Lettre de motivation',
            type_doc='LETTRE_MOTIVATION',
            chemin_fichier='/documents/stg-2024-002/lettre_motivation.pdf',
            statut_doc='VALIDE'
        )
    ]
    db.add_all(docs2)
    print(f'[OK] Stagiaire 2: {stagiaire2_user.prenom} {stagiaire2_user.nom} - Stage: {stage2.theme} - {len(docs2)} documents (sans encadreur)')

    # Stagiaire 3 - Stage académique, encadreur 2, établissement 2, 2 docs
    stagiaire3_user = Utilisateur(
        id=uuid.uuid4(),
        nom='Fouda',
        prenom='Carine',
        email='carine.fouda@etudiant.issea.org',
        mot_de_passe_hash=hash_mot_de_passe('stagiaire3'),
        role='STAGIAIRE'
    )
    db.add(stagiaire3_user)
    db.flush()
    
    stagiaire3 = Stagiaire(
        id=uuid.uuid4(),
        utilisateur_id=stagiaire3_user.id,
        telephone='+237 655 77 88 99',
        adresse='Bastos, Yaoundé',
        matricule='STG-2024-003'
    )
    db.add(stagiaire3)
    db.flush()
    
    stage3 = Stage(
        stage_id=uuid.uuid4(),
        stagiaire_id=stagiaire3.id,
        etablissement_id=etab2.etablissement_id,
        encadreur_id=enc2_user.id,
        type_stage='ACADEMIQUE',
        theme='Modélisation statistique des séries temporelles climatiques',
        objectif_general='Appliquer les modèles ARIMA et SARIMA aux données pluviométriques de la région centre',
        date_debut=date(2024, 8, 1),
        date_fin=date(2024, 11, 30),
        statut='EN_COURS'
    )
    db.add(stage3)
    db.flush()
    
    docs3 = [
        DocumentStage(
            document_id=uuid.uuid4(),
            stage_id=stage3.stage_id,
            nom_doc='Convention de stage',
            type_doc='CONVENTION_STAGE',
            chemin_fichier='/documents/stg-2024-003/convention_stage.pdf',
            statut_doc='VALIDE'
        ),
        DocumentStage(
            document_id=uuid.uuid4(),
            stage_id=stage3.stage_id,
            nom_doc='Plan de travail',
            type_doc='PLAN_TRAVAIL',
            chemin_fichier='/documents/stg-2024-003/plan_travail.pdf',
            statut_doc='VALIDE'
        )
    ]
    db.add_all(docs3)
    print(f'[OK] Stagiaire 3: {stagiaire3_user.prenom} {stagiaire3_user.nom} - Stage: {stage3.theme} - {len(docs3)} documents')

    # Stagiaire 4 - Stage pro, SANS établissement, SANS encadreur, SANS document
    stagiaire4_user = Utilisateur(
        id=uuid.uuid4(),
        nom='Ndi',
        prenom='David',
        email='david.ndi@email.com',
        mot_de_passe_hash=hash_mot_de_passe('stagiaire4'),
        role='STAGIAIRE'
    )
    db.add(stagiaire4_user)
    db.flush()
    
    stagiaire4 = Stagiaire(
        id=uuid.uuid4(),
        utilisateur_id=stagiaire4_user.id,
        telephone='+237 688 00 11 22',
        adresse='Douala, Cameroun',
        matricule='STG-2024-004'
    )
    db.add(stagiaire4)
    db.flush()
    
    stage4 = Stage(
        stage_id=uuid.uuid4(),
        stagiaire_id=stagiaire4.id,
        etablissement_id=None,
        encadreur_id=None,
        type_stage='PROFESSIONNEL',
        theme='Audit financier et compliance dans le secteur bancaire',
        objectif_general='Réaliser un audit complet des processus de conformité réglementaire',
        date_debut=date(2025, 1, 15),
        date_fin=date(2025, 6, 15),
        statut='BROUILLON'
    )
    db.add(stage4)
    print(f'[OK] Stagiaire 4: {stagiaire4_user.prenom} {stagiaire4_user.nom} - Stage: {stage4.theme} (dossier vide)')

    db.commit()
    print('\n[SUCCES] TOUTES LES DONNÉES ONT ÉTÉ INSÉRÉES AVEC SUCCÈS !')

except Exception as e:
    db.rollback()
    print(f'[ERREUR] Erreur: {e}')
    import traceback
    traceback.print_exc()
finally:
    db.close()