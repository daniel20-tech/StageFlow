export default function Header() {
  return (
    <div className="fixed top-0 left-64 right-0 bg-base-100 border-b border-base-300 shadow-md z-40">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Logo and Title Row */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center flex-shrink-0">
            <img 
              src="/images/stageflow-logo.png" 
              alt="StageFlow" 
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-base-content tracking-tight">
              Dossier de stage
            </h1>
            <p className="text-xs text-base-content/60 mt-0.5">
              Centralisez toutes les informations et documents liés à votre stage.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button className="btn btn-outline btn-sm gap-2">
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
              Modifier
            </button>
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Ajouter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
