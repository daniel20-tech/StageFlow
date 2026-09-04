import { useState, useEffect, useCallback } from "react";
import Header from "./dossier/Header";
import StageSummary from "./dossier/StageSummary";
import StudentIdentity from "./dossier/StudentIdentity";
import StageInformation from "./dossier/StageInformation";
import ThemeSection from "./dossier/ThemeSection";
import DocumentList from "./dossier/DocumentList";
import DocumentsToReturn from "./dossier/DocumentsToReturn";
import GlobalStatus from "./dossier/GlobalStatus";
import { EmptyState, LoadingState, ErrorState } from "./dossier/EmptyState";
import { api } from "../api.js";

export default function DossierDeStage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stagiaires, setStagiaires] = useState([]);
  const [selectedStagiaireId, setSelectedStagiaireId] = useState(null);
  const [currentStagiaire, setCurrentStagiaire] = useState(null);
  const [stages, setStages] = useState([]);
  const [selectedStageId, setSelectedStageId] = useState(null);
  const [student, setStudent] = useState(null);
  const [stage, setStage] = useState(null);
  const [documents, setDocuments] = useState([]);

  const loadStagiaires = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.listInternsCompact({ limit: 200 });
      const list = res.items || res;
      setStagiaires(list);
      if (list.length > 0) {
        setSelectedStagiaireId(list[0].id);
      } else {
        setStages([]);
        setStage(null);
        setStudent(null);
        setDocuments([]);
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Erreur de chargement des stagiaires"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDossier = useCallback(async (stagiaireId) => {
    if (!stagiaireId) {
      setStages([]);
      setCurrentStagiaire(null);
      setSelectedStageId(null);
      setStage(null);
      setStudent(null);
      setDocuments([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const full = await api.getInternWithStages(stagiaireId);
      setCurrentStagiaire(full);
      const filtered = full?.stages || [];
      setStages(filtered);
      if (filtered.length > 0) {
        setSelectedStageId(filtered[0].stage_id);
      } else {
        setSelectedStageId(null);
        setStage(null);
        setStudent(null);
        setDocuments([]);
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Erreur de chargement du dossier"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStagiaires();
  }, [loadStagiaires]);

  useEffect(() => {
    loadDossier(selectedStagiaireId);
  }, [selectedStagiaireId, loadDossier]);

  useEffect(() => {
    if (!currentStagiaire || !selectedStageId) return;
    const stageData = currentStagiaire.stages?.find(
      (st) => st.stage_id === selectedStageId
    );
    if (!stageData) return;

    const studentData = {
      nom: currentStagiaire?.utilisateur?.nom || "—",
      prenom: currentStagiaire?.utilisateur?.prenom || "—",
      matricule: currentStagiaire?.matricule || "—",
      filiere: currentStagiaire?.filiere || "—",
      niveau: "—",
      universite: "—",
      telephone: currentStagiaire?.telephone || "—",
      email: currentStagiaire?.utilisateur?.email || "—",
    };

    const docsView = (stageData.documents || []).map((doc) => ({
      id: doc.document_id,
      nom: doc.nom_doc,
      type: doc.type_doc,
      date_ajout: doc.date_reception,
      statut: doc.statut_doc,
      a_retourner: doc.a_retourner,
      date_limite: null,
      description: "",
    }));

    const stageView = {
      type_stage: stageData.type_stage,
      etablissement: stageData.etablissement?.nom || "—",
      encadreur_professionnel:
        stageData.encadreur
          ? `${stageData.encadreur.prenom} ${stageData.encadreur.nom}`.trim()
          : "—",
      encadreur_academique: "—",
      service: "—",
      date_debut: stageData.date_debut,
      date_fin: stageData.date_fin,
      statut: stageData.statut,
      theme: stageData.theme,
      objectif_general: stageData.objectif_general,
    };
    setStudent(studentData);
    setDocuments(docsView);
    setStage(stageView);
  }, [currentStagiaire, selectedStageId]);

  if (loading) {
    return (
      <div className="w-full pt-32">
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <Header />
        <div className="pt-32">
          <ErrorState message={error} onRetry={loadStagiaires} />
        </div>
      </div>
    );
  }

  if (stagiaires.length === 0) {
    return (
      <div className="w-full">
        <Header />
        <div className="pt-32">
          <EmptyState type="no_stage" />
        </div>
      </div>
    );
  }

  const selectedStagiaire = stagiaires.find((s) => s.id === selectedStagiaireId);
  const selectedStagiaireName = selectedStagiaire
    ? `${selectedStagiaire.utilisateur?.prenom || ""} ${selectedStagiaire.utilisateur?.nom || ""}`.trim()
    : "—";

  return (
    <div className="w-full">
      <Header />
      <div className="pt-32 space-y-6">
        {/* Stagiaire Selector */}
        <div className="flex items-center justify-end gap-3">
          <label className="text-sm font-medium text-base-content/70">
            Stagiaire :
          </label>
          <select
            className="select select-sm select-bordered w-full max-w-xs"
            value={selectedStagiaireId || ""}
            onChange={(e) => setSelectedStagiaireId(e.target.value)}
          >
            <option value="">— Sélectionner un stagiaire —</option>
            {stagiaires.map((s) => {
              const user = s.utilisateur || {};
              return (
                <option key={s.id} value={s.id}>
                  {user.prenom} {user.nom} ({s.matricule})
                </option>
              );
            })}
          </select>
        </div>

        {/* Stage Selector */}
        {stages.length > 0 && (
          <div className="flex items-center justify-end gap-3">
            <label className="text-sm font-medium text-base-content/70">
              Stage :
            </label>
            <select
              className="select select-sm select-bordered w-full max-w-xs"
              value={selectedStageId || ""}
              onChange={(e) => setSelectedStageId(e.target.value)}
            >
              <option value="">— Sélectionner un stage —</option>
              {stages.map((s) => (
                <option key={s.stage_id} value={s.stage_id}>
                  {s.theme} ({s.type_stage}) - {s.statut}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedStageId && stage && student ? (
          <>
            {/* Stage Summary Card - Main Summary Section */}
            <StageSummary stage={stage} student={student} documents={documents} />

            {/* Main Content Area - Three Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Student & Stage Info */}
              <div className="lg:col-span-2 space-y-6">
                <StudentIdentity student={student} />
                <StageInformation stage={stage} />
                <ThemeSection stage={stage} />
              </div>

              {/* Right Column - Status & Documents */}
              <div className="space-y-6">
                <GlobalStatus stage={stage} documents={documents} />
                <DocumentsToReturn documents={documents} />
              </div>
            </div>

            {/* Documents Section - Full Width */}
            <div>
              <DocumentList documents={documents} />
            </div>
          </>
        ) : selectedStageId ? (
          <div className="flex justify-center py-16">
            <LoadingState />
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-base-content/60">
              Sélectionnez un stagiaire puis un stage pour consulter le dossier.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}