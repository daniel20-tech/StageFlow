import { useState } from "react";
import ResourceView from "./components/ResourceView.jsx";
import { api } from "./api.js";

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

const RESOURCES = [
  {
    key: "users",
    label: "Utilisateurs",
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
          { name: "mot_de_passe_hash", label: "Mot de passe (hash)" },
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
    view: (
      <ResourceView
        idField="id"
        listFn={api.listInterns}
        createFn={api.createIntern}
        columns={[
          { key: "id", label: "ID" },
          { key: "user_id", label: "User ID" },
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
    view: (
      <ResourceView
        idField="evaluation_id"
        listFn={api.listEvaluations}
        createFn={api.createEvaluation}
        columns={[
          { key: "evaluation_id", label: "ID" },
          { key: "stage_id", label: "Stage" },
          { key: "type_eval", label: "Type" },
          { key: "note_globale", label: "Note" },
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

export default function App() {
  const [activeTab, setActiveTab] = useState(RESOURCES[0].key);
  const active = RESOURCES.find((resource) => resource.key === activeTab);

  return (
    <>
      <header>
        <h1>StageFlow</h1>
      </header>
      <nav className="tabs">
        {RESOURCES.map((resource) => (
          <button
            key={resource.key}
            className={`tab ${resource.key === activeTab ? "active" : ""}`}
            onClick={() => setActiveTab(resource.key)}
          >
            {resource.label}
          </button>
        ))}
      </nav>
      <main>{active.view}</main>
    </>
  );
}
