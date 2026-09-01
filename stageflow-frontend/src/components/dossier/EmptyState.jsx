export function EmptyState({ type = "no_stage" }) {
  const configs = {
    no_stage: {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      title: "Aucun dossier de stage",
      description: "Vous n'avez encore aucun stage enregistré.",
      action: "+ Ajouter un stage",
    },
    no_documents: {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Aucun document",
      description: "Aucun document n'a encore été ajouté à ce dossier.",
      action: "+ Ajouter un document",
    },
    incomplete: {
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      title: "Informations incomplètes",
      description: "3 informations doivent être complétées.",
      action: "Compléter mon dossier",
    },
    complete: {
      icon: (
        <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Dossier complet",
      description: "Tous les documents requis ont été déposés et validés.",
      action: null,
    },
  };

  const config = configs[type];

  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body items-center text-center py-16">
        <div className="w-20 h-20 rounded-2xl bg-base-200 flex items-center justify-center text-base-content/30 mb-4">
          {config.icon}
        </div>
        <h3 className="text-lg font-semibold text-base-content mb-1">
          {config.title}
        </h3>
        <p className="text-sm text-base-content/50 max-w-sm mb-6">
          {config.description}
        </p>
        {config.action && (
          <button className="btn btn-primary gap-2 text-white">
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            {config.action}
          </button>
        )}
      </div>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-20 w-full rounded-xl"></div>
      <div className="skeleton h-48 w-full rounded-xl"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="skeleton h-64 w-full rounded-xl"></div>
        <div className="skeleton h-64 w-full rounded-xl"></div>
      </div>
      <div className="skeleton h-48 w-full rounded-xl"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="skeleton h-40 w-full rounded-xl"></div>
        <div className="skeleton h-40 w-full rounded-xl"></div>
        <div className="skeleton h-40 w-full rounded-xl"></div>
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="card bg-base-100 border border-error/20 shadow-sm">
      <div className="card-body items-center text-center py-16">
        <div className="w-20 h-20 rounded-2xl bg-error/10 flex items-center justify-center text-error mb-4">
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-base-content mb-1">
          Une erreur est survenue
        </h3>
        <p className="text-sm text-base-content/50 max-w-sm mb-6">
          {message || "Impossible de charger les données. Veuillez réessayer."}
        </p>
        {onRetry && (
          <button className="btn btn-primary gap-2 text-white" onClick={onRetry}>
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Réessayer
          </button>
        )}
      </div>
    </div>
  );
}
