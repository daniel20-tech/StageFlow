import { formatDate } from "../../data/demoData";

const STATUS_STYLES = {
  EN_ATTENTE: {
    badge: "badge-warning",
    label: "En attente",
    cardBorder: "border-warning/30",
  },
  SOUMIS: {
    badge: "badge-info",
    label: "Soumis",
    cardBorder: "border-info/30",
  },
  VALIDE: {
    badge: "badge-success",
    label: "Validé",
    cardBorder: "border-success/30",
  },
  REJETE: {
    badge: "badge-error",
    label: "À corriger",
    cardBorder: "border-error/30",
  },
};

export default function DocumentsToReturn({ documents }) {
  const toReturn = documents.filter((d) => d.a_retourner);

  if (toReturn.length === 0) {
    return (
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-success"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="card-title text-lg font-semibold">
              Documents à retourner
            </h2>
          </div>

          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-success"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-base font-semibold text-base-content mb-1">
              Tout est à jour
            </h3>
            <p className="text-sm text-base-content/50">
              Aucun document ne doit actuellement être retourné.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-warning"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div>
            <h2 className="card-title text-lg font-semibold">
              Documents à retourner
            </h2>
            <p className="text-xs text-base-content/50">
              {toReturn.length} document{toReturn.length > 1 ? "s" : ""} en
              attente
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {toReturn.map((doc) => {
            const style = STATUS_STYLES[doc.statut] || STATUS_STYLES.EN_ATTENTE;
            return (
              <div
                key={doc.id}
                className={`p-4 rounded-xl border ${style.cardBorder} bg-base-200/30`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-semibold text-base-content">
                    {doc.nom}
                  </h4>
                  <span className={`badge badge-xs ${style.badge}`}>
                    {style.label}
                  </span>
                </div>
                <p className="text-xs text-base-content/50 mb-3">
                  {doc.description}
                  {doc.date_limite &&
                    ` \u00b7 \u00c0 retourner avant le ${formatDate(
                      doc.date_limite
                    )}`}
                </p>
                <button className="btn btn-primary btn-xs gap-1 text-white w-full">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  Déposer le document
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
