import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});

function unwrap(promise) {
  return promise.then((response) => response.data);
}

export const api = {
  // Users & roles
  listUsers: () => unwrap(http.get("/utilisateurs")),
  createUser: (data) => unwrap(http.post("/utilisateurs", data)),
  listInterns: () => unwrap(http.get("/stagiaires")),
  createIntern: (data) => unwrap(http.post("/stagiaires", data)),
  listInstitutions: () => unwrap(http.get("/etablissements")),
  createInstitution: (data) => unwrap(http.post("/etablissements", data)),

  // Stages
  listStages: () => unwrap(http.get("/stages")),
  createStage: (data) => unwrap(http.post("/stages", data)),
  updateStageStatus: (id, status) =>
    unwrap(http.patch(`/stages/${id}/statut`, { statut: status })),

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
};
