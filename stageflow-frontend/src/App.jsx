import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import ResourceView from "./components/ResourceView.jsx";
import DossierDeStage from "./components/DossierDeStage.jsx";
import Login from "./components/Login.jsx";
import { api, setToken } from "./api.js";

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
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    view: <DossierDeStage />,
  },
  {
    key: "users",
    label: "Utilisateurs",
    roles: ["ADMIN"],
    icon: null,
    view: (
      <ResourceView
        idField="id"
        listFn={api.listUsers}
        createFn={api.createUser}
        columns={[
          { key: "id", label: "ID" },
          { key: "nom", label: "Nom" },
          { key: "prenom", label: "Prénom" },
          { key: "email", label: "Email" },
          { key: "role", label: "Rôle" },
        ]}
        formFields={[
          { name: "nom", label: "Nom" },
          { name: "prenom", label: "Prénom" },
          { name: "email", label: "Email" },
          { name: "mot_de_passe", label: "Mot de passe (min. 8 caractères)" },
          {
            name: "role",
            label: "Rôle",
            type: "select",
            options: ["ADMIN", "INTERN", "SUPERVISOR"],
          },
        ]}
      />
    ),
  },
  {
    key: "interns",
    label: "Stagiaires",
    roles: ["ADMIN"],
    icon: null,
    view: (
      <ResourceView
        idField="id"
        listFn={api.listInterns}
        createFn={api.createIntern}
        columns={[
          { key: "id", label: "ID" },
          { key: "utilisateur_id", label: "User ID" },
          { key: "matricule", label: "Matricule" },
          { key: "telephone", label: "Téléphone" },
          { key: "adresse", label: "Adresse" },
        ]}
        formFields={[
          { name: "utilisateur_id", label: "User ID" },
          { name: "matricule", label: "Matricule" },
          { name: "telephone", label: "Téléphone" },
          { name: "adresse", label: "Adresse" },
        ]}
      />
    ),
  },
  {
    key: "institutions",
    label: "Établissements",
    roles: ["ADMIN"],
    icon: null,
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
    icon: null,
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
    icon: null,
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
    icon: null,
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
    icon: null,
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
    icon: null,
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
    icon: null,
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