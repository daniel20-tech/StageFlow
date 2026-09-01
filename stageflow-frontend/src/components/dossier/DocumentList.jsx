import { useState } from "react";
import { formatDate, DOCUMENT_STATUSES } from "../../data/demoData";

const FILE_ICONS = {
  PDF: (
    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6M9 13h2m-2 4h6m-6 0h.01" />
    </svg>
  ),
  DOCX: (
    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6M9 13h2m-2 4h6m-6 0h.01" />
    </svg>
  ),
  default: (
    <svg className="w-5 h-5 text-base-content/40" fill="currentColor" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6" />
    </svg>
  ),
};

const FILTERS = [
  { key: "all", label: "Tous" },
  { key: "deposes", label: "Déposés" },
  { key: "en_attente", label: "En attente" },
  { key: "valides", label: "Validés" },
  { key: "a_completer", label: "À compléter" },
];

export default function DocumentList({ documents }) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = documents.filter((doc) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "deposes") return doc.date_ajout !== null;
    if (activeFilter === "en_attente") return doc.statut === "EN_ATTENTE";
    if (activeFilter === "valides") return doc.statut === "VALIDE";
    if (activeFilter === "a_completer")
      return doc.statut === "EN_ATTENTE" && !doc.a_retourner;
    return true;
  });

  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-info"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="card-title text-lg font-semibold">
              Documents du stage
            </h2>
          </div>
          <span className="text-xs text-base-content/50">
            {documents.length} document{documents.length > 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {FILTERS.map((filter) => (
            <button
              key={filter.key}
              className={`btn btn-xs ${
                activeFilter === filter.key
                  ? "btn-primary text-white"
                  : "btn-ghost"
              }`}
              onClick={() => setActiveFilter(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-base-content/40 text-sm">
              Aucun document ne correspond au filtre sélectionné.
            </div>
          ) : (
            filtered.map((doc) => (
              <DocumentRow key={doc.id} document={doc} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function DocumentRow({ document: doc }) {
  const statusConf = DOCUMENT_STATUSES[doc.statut] || DOCUMENT_STATUSES.EN_ATTENTE;
  const fileIcon = FILE_ICONS[doc.type] || FILE_ICONS.default;

  return (
    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-base-200/50 transition-colors group">
      <div className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center flex-shrink-0">
        {fileIcon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-base-content truncate">
            {doc.nom}
          </p>
          {doc.a_retourner && (
            <span className="badge badge-warning badge-xs">À retourner</span>
          )}
        </div>
        <p className="text-xs text-base-content/50 mt-0.5">
          {doc.type}
          {doc.date_ajout && ` \u00b7 Ajouté le ${formatDate(doc.date_ajout)}`}
        </p>
      </div>

      <span
        className={`badge badge-sm ${
          statusConf.color === "success"
            ? "badge-success"
            : statusConf.color === "info"
            ? "badge-info"
            : statusConf.color === "warning"
            ? "badge-warning"
            : "badge-error"
        }`}
      >
        {statusConf.label}
      </span>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="btn btn-ghost btn-xs" title="Voir">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </button>
        {doc.statut === "REJETE" && (
          <button className="btn btn-ghost btn-xs text-error" title="Corriger">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
