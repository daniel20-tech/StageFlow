export default function Sidebar({ resources, activeTab, onTabChange, user, onLogout }) {
  const initials = user
    ? `${(user.prenom || "S")[0]}${(user.nom || "F")[0]}`.toUpperCase()
    : "SF";
  const roleLabel =
    user?.role === "ADMIN"
      ? "Administrateur"
      : user?.role === "SUPERVISOR"
      ? "Encadreur"
      : user?.role === "INTERN"
      ? "Stagiaire"
      : "Utilisateur";

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-base-100 border-r border-base-300 flex flex-col shadow-sm z-50">
      {/* Sidebar Header - Logo + Name */}
      <div className="p-6 border-b border-base-300 flex items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-base-200 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow flex-shrink-0">
          <img 
            src="/images/stageflow-logo.png" 
            alt="StageFlow Logo" 
            className="w-full h-full object-contain rounded-lg"
          />
        </div>
        <span className="text-lg font-bold text-base-content tracking-tight">StageFlow</span>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="menu menu-compact w-full">
          {resources.map((resource) => (
            <li key={resource.key}>
              <button
                className={`rounded-lg transition-all ${
                  resource.key === activeTab
                    ? "active bg-primary text-primary-content font-semibold shadow-md"
                    : "text-base-content hover:bg-base-200"
                }`}
                onClick={() => onTabChange(resource.key)}
              >
                {resource.icon && (
                  <span className="flex-shrink-0">{resource.icon}</span>
                )}
                <span className="flex-1 text-left text-sm">{resource.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-base-300">
        <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-base-200/50">
          <div className="avatar placeholder flex-shrink-0">
            <div className="bg-primary text-primary-content w-8 rounded-full text-xs font-bold">
              <span>{initials}</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-base-content truncate">
              {user ? `${user.prenom} ${user.nom}` : "Admin"}
            </p>
            <p className="text-xs text-base-content/60 truncate">
              {user ? user.email : "admin@stageflow"} · {roleLabel}
            </p>
          </div>
          {onLogout && (
            <button
              className="btn btn-ghost btn-xs btn-square"
              title="Se déconnecter"
              onClick={onLogout}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
