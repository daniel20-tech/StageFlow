export const demoStudent = {
  nom: "Mvondo",
  prenom: "Daniel",
  matricule: "STG-2026-0142",
  filiere: "G\u00e9osciences et Environnement",
  niveau: "Licence 3",
  universite: "Universit\u00e9 de Yaound\u00e9 I",
  telephone: "+237 699 123 456",
  email: "daniel.mvondo@univ-yaounde1.cm",
  photo: null,
};

export const demoStage = {
  type_stage: "Stage acad\u00e9mique",
  etablissement: "Entreprise Exemple SARL",
  service: "D\u00e9partement Informatique",
  encadreur_professionnel: "Jean Dupont",
  encadreur_academique: "Dr. Martin",
  date_debut: "2026-08-01",
  date_fin: "2026-09-30",
  statut: "EN_COURS",
  theme:
    "Analyse et optimisation du syst\u00e8me de gestion des stages universitaires",
  objectif_general:
    "Concevoir et d\u00e9velopper une application web moderne permettant d'automatiser le suivi des stages, de g\u00e9rer les documents et d'am\u00e9lorier la communication entre les stagiaires, les encadreurs et les \u00e9tablissements.",
};

export const demoDocuments = [
  {
    id: "doc-001",
    nom: "Convention de stage",
    type: "PDF",
    date_ajout: "2026-08-12",
    statut: "VALIDE",
    a_retourner: false,
    date_limite: null,
    description: "Convention sign\u00e9e par les trois parties",
  },
  {
    id: "doc-002",
    nom: "Attestation d'accueil",
    type: "PDF",
    date_ajout: "2026-08-12",
    statut: "VALIDE",
    a_retourner: false,
    date_limite: null,
    description: "Attestation de l'entreprise d'accueil",
  },
  {
    id: "doc-003",
    nom: "Rapport de stage - Version 1",
    type: "PDF",
    date_ajout: "2026-08-25",
    statut: "VALIDE",
    a_retourner: false,
    date_limite: null,
    description: "Premi\u00e8re version du rapport",
  },
  {
    id: "doc-004",
    nom: "Plan de travail",
    type: "DOCX",
    date_ajout: "2026-08-10",
    statut: "VALIDE",
    a_retourner: false,
    date_limite: null,
    description: "D\u00e9tail des objectifs et planning",
  },
  {
    id: "doc-005",
    nom: "Journal de bord",
    type: "PDF",
    date_ajout: "2026-09-01",
    statut: "VALIDE",
    a_retourner: false,
    date_limite: null,
    description: "Suivi hebdomadaire des activit\u00e9s",
  },
  {
    id: "doc-006",
    nom: "Rapport de stage - Version 2",
    type: "PDF",
    date_ajout: "2026-09-01",
    statut: "SOUMIS",
    a_retourner: false,
    date_limite: null,
    description: "Version r\u00e9vis\u00e9e du rapport",
  },
  {
    id: "doc-007",
    nom: "Fiche d'\u00e9valuation interm\u00e9diaire",
    type: "PDF",
    date_ajout: "2026-08-28",
    statut: "REJETE",
    a_retourner: false,
    date_limite: null,
    description: "Fiche \u00e0 corriger suite aux remarques de l'encadreur",
  },
  {
    id: "doc-008",
    nom: "Rapport de stage final",
    type: "PDF",
    date_ajout: null,
    statut: "EN_ATTENTE",
    a_retourner: true,
    date_limite: "2026-09-15",
    description: "\u00c0 retourner avant le 15 septembre 2026",
  },
  {
    id: "doc-009",
    nom: "Fiche d'\u00e9valuation finale",
    type: "PDF",
    date_ajout: null,
    statut: "EN_ATTENTE",
    a_retourner: true,
    date_limite: null,
    description: "\u00c0 compl\u00e9ter par l'encadreur",
  },
  {
    id: "doc-010",
    nom: "Attestation de r\u00e9ussite",
    type: "PDF",
    date_ajout: null,
    statut: "EN_ATTENTE",
    a_retourner: false,
    date_limite: null,
    description: "D\u00e9livr\u00e9e apr\u00e8s validation",
  },
];

export const DOCUMENT_STATUSES = {
  VALIDE: { label: "Valid\u00e9", color: "success", icon: "\u2705" },
  SOUMIS: { label: "Soumis", color: "info", icon: "\ud83d\udce4" },
  EN_ATTENTE: { label: "En attente", color: "warning", icon: "\u23f3" },
  REJETE: { label: "Refus\u00e9", color: "error", icon: "\u274c" },
};

export const STAGE_STATUSES = {
  EN_COURS: { label: "En cours", color: "success" },
  A_VENIR: { label: "\u00c0 venir", color: "info" },
  TERMINE: { label: "Termin\u00e9", color: "neutral" },
  EN_ATTENTE: { label: "En attente", color: "warning" },
  VALIDE: { label: "Valid\u00e9", color: "accent" },
};

export function getProgressStats(documents) {
  const total = documents.length;
  const deposes = documents.filter((d) => d.date_ajout !== null).length;
  const valides = documents.filter((d) => d.statut === "VALIDE").length;
  const aRetourner = documents.filter((d) => d.a_retourner).length;
  const pourcentage = total > 0 ? Math.round((deposes / total) * 100) : 0;

  return { total, deposes, valides, aRetourner, pourcentage };
}

export function formatDate(dateStr) {
  if (!dateStr) return "\u2014";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function calculateDuration(dateDebut, dateFin) {
  if (!dateDebut || !dateFin) return "\u2014";
  const debut = new Date(dateDebut);
  const fin = new Date(dateFin);
  const diffMs = fin - debut;
  const semaines = Math.round(diffMs / (7 * 24 * 60 * 60 * 1000));
  return `${semaines} semaines`;
}
