import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import ResourceView from "./components/ResourceView.jsx";
import StagiairesView from "./components/StagiairesView.jsx";
import UsersView from "./components/UsersView.jsx";
import DossierDeStage from "./components/DossierDeStage.jsx";
import Login from "./components/Login.jsx";
import { api, setToken } from "./api.js";

const SIDEBAR_ICONS = {
  dossier: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  users: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  intern: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  ),
  institution: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  stages: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  task: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  document: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  submission: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
    </svg>
  ),
  permission: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  evaluation: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
};

const STAGE_STATUSES = [
  "BROUILLON",
  "EN_ATTENTE",
  "EN_COURS",
  "EVALUATION_EN_COURS",
  "TERMINE",
  "ANNULE",
];
const TASK_STATUSES = [
  "A_FAIRE",
  "EN_COURS",
  "A_REVISER",
  "CHANGEMENTS_DEMANDES",
  "APPROUVE",
];
const DOCUMENT_STATUSES = ["EN_ATTENTE", "SOUMIS", "VALIDE", "REJETE"];
const PERMISSION_STATUSES = ["EN_ATTENTE", "APPROUVE", "REJETE"];
const EVALUATION_STATUSES = ["BROUILLON", "SOUMISE", "VALIDEE", "REJETEE"];

const RESOURCES = [
  {
    key: "dossier",
    label: "Dossier de stage",
    roles: ["ADMIN", "INTERN"],
    icon: SIDEBAR_ICONS.dossier,
    view: <DossierDeStage />,
  },
  {
    key: "users",
    label: "Utilisateurs",
    roles: ["ADMIN"],
    icon: SIDEBAR_ICONS.users,
    view: <UsersView />,
  },
  {
    key: "interns",
    label: "Stagiaires",
    roles: ["ADMIN"],
    icon: SIDEBAR_ICONS.intern,
    view: <StagiairesView />,
  },
  {
    key: "institutions",
    label: "Établissements",
    roles: ["ADMIN"],
    icon: SIDEBAR_ICONS.institution,
    view: (
      <ResourceView
        idField="etablissement_id"
        listFn={api.listInstitutions}
        createFn={api.createInstitution}
        columns={[
          { key: "etablissement_id", label: "ID" },
          { key: "nom", label: "Nom" },
          { key: "ville", label: "Ville" },
          { key: "notes", label: "Notes" },
        ]}
        formFields={[
          { name: "nom", label: "Nom" },
          { name: "ville", label: "Ville" },
          { name: "notes", label: "Notes" },
        ]}
      />
    ),
  },
  {
    key: "stages",
    label: "Stages",
    roles: ["ADMIN", "SUPERVISOR"],
    icon: SIDEBAR_ICONS.stages,
    view: (
      <ResourceView
        idField="stage_id"
        listFn={api.listStages}
        createFn={api.createStage}
        statusConfig={{
          field: "statut",
          options: STAGE_STATUSES,
          updateFn: api.updateStageStatus,
        }}
        columns={[
          { key: "stage_id", label: "ID" },
          { key: "stagiaire_id", label: "Stagiaire" },
          { key: "etablissement_id", label: "Établissement" },
          { key: "type_stage", label: "Type" },
          { key: "theme", label: "Thème" },
          { key: "statut", label: "Statut" },
        ]}
        formFields={[
          { name: "stagiaire_id", label: "Stagiaire ID" },
          { name: "etablissement_id", label: "Établissement ID (optionnel)" },
          { name: "encadreur_id", label: "Encadreur ID (optionnel)" },
          { name: "type_stage", label: "Type de stage" },
          { name: "theme", label: "Thème" },
          { name: "objectif_general", label: "Objectif général" },
          { name: "date_debut", label: "Date début", type: "date" },
          { name: "date_fin", label: "Date fin", type: "date" },
        ]}
      />
    ),
  },
  {
    key: "tasks",
    label: "Tâches",
    roles: ["ADMIN", "SUPERVISOR"],
    icon: SIDEBAR_ICONS.task,
    view: (
      <ResourceView
        idField="tache_id"
        listFn={api.listTasks}
        createFn={api.createTask}
        statusConfig={{
          field: "statut_tache",
          options: TASK_STATUSES,
          updateFn: api.updateTaskStatus,
        }}
        columns={[
          { key: "tache_id", label: "ID" },
          { key: "stage_id", label: "Stage" },
          { key: "titre", label: "Titre" },
          { key: "statut_tache", label: "Statut" },
        ]}
        formFields={[
          { name: "stage_id", label: "Stage ID" },
          { name: "titre", label: "Titre" },
          { name: "description", label: "Description" },
          { name: "date_limite", label: "Date limite", type: "date" },
          { name: "priorite", label: "Priorité" },
        ]}
      />
    ),
  },
  {
    key: "documents",
    label: "Documents",
    roles: ["ADMIN", "SUPERVISOR"],
    icon: SIDEBAR_ICONS.document,
    view: (
      <ResourceView
        idField="document_id"
        listFn={api.listDocuments}
        createFn={api.createDocument}
        statusConfig={{
          field: "statut_doc",
          options: DOCUMENT_STATUSES,
          updateFn: api.updateDocumentStatus,
        }}
        columns={[
          { key: "document_id", label: "ID" },
          { key: "stage_id", label: "Stage" },
          { key: "nom_doc", label: "Nom" },
          { key: "statut_doc", label: "Statut" },
        ]}
        formFields={[
          { name: "stage_id", label: "Stage ID" },
          { name: "nom_doc", label: "Nom du document" },
          { name: "type_doc", label: "Type" },
          { name: "chemin_fichier", label: "Chemin fichier" },
          {
            name: "a_retourner",
            label: "À retourner",
            type: "select",
            options: ["true", "false"],
          },
        ]}
      />
    ),
  },
  {
    key: "submissions",
    label: "Soumissions",
    roles: ["ADMIN", "SUPERVISOR"],
    icon: SIDEBAR_ICONS.submission,
    view: (
      <ResourceView
        idField="soumison_id"
        paramConfig={{
          label: "ID Tâche",
          placeholder: "UUID de la tâche",
          listFn: api.listSubmissionsByTask,
        }}
        createFn={api.createSubmission}
        columns={[
          { key: "soumison_id", label: "ID" },
          { key: "tache_id", label: "Tâche" },
          { key: "num_version", label: "Version" },
          { key: "contenu_lien", label: "Lien" },
        ]}
        formFields={[
          { name: "tache_id", label: "Tâche ID" },
          { name: "contenu_lien", label: "Lien contenu" },
          { name: "commentaire_stagiaire", label: "Commentaire" },
        ]}
      />
    ),
  },
  {
    key: "permissions",
    label: "Permissions",
    roles: ["ADMIN", "SUPERVISOR"],
    icon: SIDEBAR_ICONS.permission,
    view: (
      <ResourceView
        idField="permission_id"
        listFn={api.listPermissions}
        createFn={api.createPermission}
        statusConfig={{
          field: "statut_perm",
          options: PERMISSION_STATUSES,
          requiresCommentOn: ["REJETE"],
          updateFn: api.decidePermission,
        }}
        columns={[
          { key: "permission_id", label: "ID" },
          { key: "stage_id", label: "Stage" },
          { key: "motif", label: "Motif" },
          { key: "statut_perm", label: "Statut" },
        ]}
        formFields={[
          { name: "stage_id", label: "Stage ID" },
          { name: "date_debut", label: "Date début", type: "datetime-local" },
          { name: "date_fin", label: "Date fin", type: "datetime-local" },
          { name: "motif", label: "Motif" },
        ]}
      />
    ),
  },
  {
    key: "evaluations",
    label: "Évaluations",
    roles: ["ADMIN", "SUPERVISOR"],
    icon: SIDEBAR_ICONS.evaluation,
    view: (
      <ResourceView
        idField="evaluation_id"
        listFn={api.listEvaluations}
        createFn={api.createEvaluation}
        statusConfig={{
          field: "statut",
          options: EVALUATION_STATUSES,
          updateFn: api.updateEvaluationStatus,
        }}
        columns={[
          { key: "evaluation_id", label: "ID" },
          { key: "stage_id", label: "Stage" },
          { key: "type_eval", label: "Type" },
          { key: "note_globale", label: "Note" },
          { key: "statut", label: "Statut" },
        ]}
        formFields={[
          { name: "stage_id", label: "Stage ID" },
          { name: "type_eval", label: "Type d'évaluation" },
          { name: "note_globale", label: "Note globale" },
          { name: "appreciations", label: "Appréciations" },
        ]}
      />
    ),
  },
];

const SESSION_KEY = "stageflow_session";

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    const roleMap = {
      ADMINISTRATEUR: "ADMIN",
      ENCADREUR: "SUPERVISOR",
      STAGIAIRE: "INTERN",
    };
    return {
      ...session,
      role: roleMap[session.role] || session.role,
    };
  } catch {
    return null;
  }
}

function saveSession(session) {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(SESSION_KEY);
}

export default function App() {
  const [session, setSession] = useState(loadSession);
  const [activeTab, setActiveTab] = useState(RESOURCES[0].key);

  const resources = session
    ? RESOURCES.filter((r) => r.roles.includes(session.role))
    : [];

  const handleLogin = (data) => {
    setToken(data.access_token);
    const roleMap = {
      ADMINISTRATEUR: "ADMIN",
      ENCADREUR: "SUPERVISOR",
      STAGIAIRE: "INTERN",
    };
    const sessionData = {
      access_token: data.access_token,
      utilisateur_id: data.utilisateur_id,
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      role: roleMap[data.role] || data.role,
    };
    setSession(sessionData);
    saveSession(sessionData);
    setActiveTab(RESOURCES[0].key);
  };

  const handleLogout = () => {
    setToken(null);
    setSession(null);
    saveSession(null);
  };

  useEffect(() => {
    const onUnauthorized = () => {
      setSession(null);
      saveSession(null);
    };
    window.addEventListener("stageflow:unauthorized", onUnauthorized);
    return () => window.removeEventListener("stageflow:unauthorized", onUnauthorized);
  }, []);

  if (!session) {
    return <Login onLogin={handleLogin} />;
  }

  const active = resources.find((resource) => resource.key === activeTab) || resources[0];

  return (
    <div className="min-h-screen bg-base-200/30 flex">
      {/* Sidebar Fixed */}
      <Sidebar
        resources={resources}
        activeTab={active.key}
        onTabChange={setActiveTab}
        user={session}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen">
        {/* Page Content with Padding */}
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          {active.view}
        </div>
      </main>
    </div>
  );
}