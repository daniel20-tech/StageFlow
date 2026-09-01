export default function ThemeSection({ stage }) {
  const hasTheme = stage.theme && stage.theme.trim() !== "";
  const hasObjective = stage.objectif_general && stage.objectif_general.trim() !== "";

  if (!hasTheme && !hasObjective) {
    return (
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body p-6">
          <div className="flex items-center gap-2 mb-4">
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <h2 className="card-title text-lg font-semibold">
              Thème et objectif
            </h2>
          </div>

          <div className="text-center py-10 px-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-base-200 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-base-content/30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-base-content mb-1">
              Thème et objectif non renseignés
            </h3>
            <p className="text-sm text-base-content/50 max-w-md mx-auto mb-4">
              Les informations relatives au thème et à l'objectif général ne
              sont pas encore renseignées.
            </p>
            <button className="btn btn-primary btn-sm gap-2 text-white">
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
              Compléter les informations
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h2 className="card-title text-lg font-semibold">
            Thème et objectif
          </h2>
        </div>

        {hasTheme && (
          <div className="mb-5">
            <p className="text-xs text-base-content/50 font-medium uppercase tracking-wider mb-2">
              Thème du stage
            </p>
            <div className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10">
              <p className="text-sm font-semibold text-base-content leading-relaxed">
                {stage.theme}
              </p>
            </div>
          </div>
        )}

        {hasObjective && (
          <div>
            <p className="text-xs text-base-content/50 font-medium uppercase tracking-wider mb-2">
              Objectif général
            </p>
            <div className="p-4 rounded-xl bg-base-200/50">
              <p className="text-sm text-base-content/80 leading-relaxed">
                {stage.objectif_general}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
