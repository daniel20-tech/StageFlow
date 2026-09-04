import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});

const TOKEN_KEY = "stageflow_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      setToken(null);
      window.dispatchEvent(new CustomEvent("stageflow:unauthorized"));
    }
    return Promise.reject(error);
  }
);

function unwrap(promise) {
  return promise.then((response) => response.data);
}

export const api = {
  // Auth
  login: (email, motDePasse) =>
    unwrap(http.post("/auth/login", { email, mot_de_passe: motDePasse })),
  me: () => unwrap(http.get("/auth/me")),

  // Users & roles
  listUsers: () => unwrap(http.get("/utilisateurs")),
  listSupervisors: () => unwrap(http.get("/utilisateurs/encadreurs")),
  createUser: (data) => unwrap(http.post("/utilisateurs", data)),
  createCompte: (data) => unwrap(http.post("/utilisateurs/compte", data)),
  listInterns: () => unwrap(http.get("/stagiaires")),
  listInternsWithStages: () => unwrap(http.get("/stagiaires/with-stages")),
  listInternsCompact: (params) =>
    unwrap(http.get("/stagiaires/compact", { params })),
  createIntern: (data) => unwrap(http.post("/stagiaires", data)),
  listInstitutions: () => unwrap(http.get("/etablissements")),
  createInstitution: (data) => unwrap(http.post("/etablissements", data)),

  // Stages
  listStages: () => unwrap(http.get("/stages")),
  getStage: (id) => unwrap(http.get(`/stages/${id}`)),
  createStage: (data) => unwrap(http.post("/stages", data)),
  createAcademicStage: (data) => unwrap(http.post("/stages/academique", data)),
  updateStageStatus: (id, status) =>
    unwrap(http.patch(`/stages/${id}/statut`, { statut: status })),
  assignSupervisor: (id, supervisorId) =>
    unwrap(http.patch(`/stages/${id}/encadreur`, null, { params: { encadreur_id: supervisorId } })),

  // Others
  getUser: (id) => unwrap(http.get(`/utilisateurs/${id}`)),
  getIntern: (id) => unwrap(http.get(`/stagiaires/${id}`)),
  getInternWithStages: (id) => unwrap(http.get(`/stagiaires/${id}/with-stages`)),
  getInstitution: (id) => unwrap(http.get(`/etablissements/${id}`)),
  listDocumentsByStage: (stageId) =>
    unwrap(http.get("/documents", { params: { stage_id: stageId } })),

  // Tasks
  listTasks: () => unwrap(http.get("/taches")),
  createTask: (data) => unwrap(http.post("/taches", data)),
  updateTaskStatus: (id, status) =>
    unwrap(http.patch(`/taches/${id}/statut`, { statut_tache: status })),

  // Documents
  listDocuments: () => unwrap(http.get("/documents")),
  createDocument: (data) => unwrap(http.post("/documents", data)),
  updateDocumentStatus: (id, status) =>
    unwrap(http.patch(`/documents/${id}/statut`, { statut_doc: status })),
  uploadDocument: ({ stage_id, type_doc, nom_doc, statut_doc, file }) => {
    const formData = new FormData();
    formData.append("stage_id", stage_id);
    formData.append("type_doc", type_doc);
    if (nom_doc) formData.append("nom_doc", nom_doc);
    formData.append("statut_doc", statut_doc || "EN_ATTENTE");
    formData.append("file", file);
    return unwrap(http.post("/documents/upload", formData));
  },
  deleteDocument: (id) => unwrap(http.delete(`/documents/${id}`)),
  documentUrl: (id) => `http://localhost:8000/api/v1/documents/${id}/fichier`,

  // Submissions (scoped by task)
  listSubmissionsByTask: (taskId) => unwrap(http.get(`/soumissions/tache/${taskId}`)),
  createSubmission: (data) => unwrap(http.post("/soumissions", data)),

  // Permissions
  listPermissions: () => unwrap(http.get("/permissions")),
  createPermission: (data) => unwrap(http.post("/permissions", data)),
  decidePermission: (id, status, comment) =>
    unwrap(
      http.patch(`/permissions/${id}/decision`, {
        statut_perm: status,
        commentaire_decision: comment,
      })
    ),

  // Evaluations
  listEvaluations: () => unwrap(http.get("/evaluations")),
  createEvaluation: (data) => unwrap(http.post("/evaluations", data)),
  updateEvaluationStatus: (id, status) =>
    unwrap(http.patch(`/evaluations/${id}/statut`, { statut: status })),
};
