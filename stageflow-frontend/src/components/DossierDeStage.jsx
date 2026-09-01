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

const EMPTY_STUDENT = {
  nom: "—",
  prenom: "—",
  matricule: "—",
  filiere: "—",
  niveau: "—",
  universite: "—",
  telephone: "—",
  email: "—",
};

export default function DossierDeStage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stages, setStages] = useState([]);
  const [selectedStageId, setSelectedStageId] = useState(null);
  const [student, setStudent] = useState(null);
  const [stage, setStage] = useState(null);
  const [documents, setDocuments] = useState([]);

  const loadStages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const stageList = await api.listStages();
      setStages(stageList);
      if (stageList.length > 0) {
        setSelectedStageId(stageList[0].stage_id);
      } else {
        setStage(null);
        setStudent(null);
        setDocuments([]);
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Erreur de chargement des stages"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStage = useCallback(async (stageId) => {
    setLoading(true);
    setError(null);
    try {
      const [stageData, docs] = await Promise.all([
        api.getStage(stageId),
        api.listDocumentsByStage(stageId),
      ]);

      let studentData = { ...EMPTY_STUDENT };
      try {
        const stagiaire = await api.getIntern(stageData.stagiaire_id);
        const user = await api.getUser(stagiaire.utilisateur_id);
        studentData = {
          nom: user.nom,
          prenom: user.prenom,
          matricule: stagiaire.matricule || "—",
          filiere: "—",
          niveau: "—",
          universite: "—",
          telephone: stagiaire.telephone || "—",
          email: user.email || "—",
        };
      } catch {
        // keep placeholder identity
      }

      let etablissement = "—";
      if (stageData.etablissement_id) {
        try {
          const inst = await api.getInstitution(stageData.etablissement_id);
          etablissement = inst.nom;
        } catch {
          // keep placeholder
        }
      }

      let encadreur = "—";
      if (stageData.encadreur_id) {
        try {
          const sup = await api.getUser(stageData.encadreur_id);
          encadreur = `${sup.prenom} ${sup.nom}`.trim();
        } catch {
          // keep placeholder
        }
      }

      const stageView = {
        type_stage: stageData.type_stage,
        etablissement,
        encadreur_professionnel: encadreur,
        encadreur_academique: "—",
        service: "—",
        date_debut: stageData.date_debut,
        date_fin: stageData.date_fin,
        statut: stageData.statut,
        theme: stageData.theme,
        objectif_general: stageData.objectif_general,
      };

      const docsView = docs.map((doc) => ({
        id: doc.document_id,
        nom: doc.nom_doc,
        type: doc.type_doc,
        date_ajout: doc.date_reception,
        statut: doc.statut_doc,
        a_retourner: doc.a_retourner,
        date_limite: null,
        description: "",
      }));

      setStage(stageView);
      setStudent(studentData);
      setDocuments(docsView);
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
    loadStages();
  }, [loadStages]);

  useEffect(() => {
    if (selectedStageId) {
      loadStage(selectedStageId);
    }
  }, [selectedStageId, loadStage]);

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
          <ErrorState message={error} onRetry={loadStages} />
        </div>
      </div>
    );
  }

  if (!stage) {
    return (
      <div className="w-full">
        <Header />
        <div className="pt-32">
          <EmptyState type="no_stage" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Header />
      <div className="pt-32 space-y-6">
        {/* Stage Selector */}
        {stages.length > 1 && (
          <div className="flex items-center justify-end">
            <label className="text-sm font-medium text-base-content/70 mr-3">
              Stage :
            </label>
            <select
              className="select select-sm select-bordered w-full max-w-xs"
              value={selectedStageId}
              onChange={(e) => setSelectedStageId(e.target.value)}
            >
              {stages.map((s) => (
                <option key={s.stage_id} value={s.stage_id}>
                  {s.theme} ({s.type_stage})
                </option>
              ))}
            </select>
          </div>
        )}

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
      </div>
    </div>
  );
}