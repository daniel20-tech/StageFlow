import { formatDate, calculateDuration, STAGE_STATUSES } from "../../data/demoData";

const STATUS_CONFIG = {
  BROUILLON: { label: "Brouillon", bg: "bg-base-300/50", text: "text-base-content", dot: "bg-base-content/40" },
  EN_ATTENTE: { label: "En attente", bg: "bg-warning/10", text: "text-warning", dot: "bg-warning" },
  EN_COURS: { label: "En cours", bg: "bg-info/10", text: "text-info", dot: "bg-info" },
  EVALUATION_EN_COURS: { label: "\u00c9valuation en cours", bg: "bg-accent/10", text: "text-accent", dot: "bg-accent" },
  TERMINE: { label: "Termin\u00e9", bg: "bg-success/10", text: "text-success", dot: "bg-success" },
  ANNULE: { label: "Annul\u00e9", bg: "bg-error/10", text: "text-error", dot: "bg-error" },
};

export default function StageInformation({ stage }) {
  const statusConf = STATUS_CONFIG[stage.statut] || STATUS_CONFIG.EN_COURS;

  const items = [
    { label: "Type de stage", value: stage.type_stage, icon: "briefcase" },
    { label: "Établissement d'accueil", value: stage.etablissement, icon: "building" },
    { label: "Service / Département", value: stage.service, icon: "department" },
    { label: "Encadreur professionnel", value: stage.encadreur_professionnel, icon: "user" },
    { label: "Encadreur académique", value: stage.encadreur_academique, icon: "academic" },
    { label: "Date de début", value: formatDate(stage.date_debut), icon: "calendar" },
    { label: "Date de fin", value: formatDate(stage.date_fin), icon: "calendar" },
    { label: "Durée", value: calculateDuration(stage.date_debut, stage.date_fin), icon: "clock" },
  ];

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
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="card-title text-lg font-semibold">
            Informations du stage
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-3 p-3 rounded-xl bg-base-200/50"
            >
              <div className="w-8 h-8 rounded-lg bg-base-300/50 flex items-center justify-center text-base-content/40 flex-shrink-0">
                <ItemIcon type={item.icon} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-base-content/50 font-medium uppercase tracking-wider">
                  {item.label}
                </p>
                <p className="text-sm font-semibold text-base-content mt-0.5">
                  {item.value}
                </p>
              </div>
            </div>
          ))}

          <div className="flex items-start gap-3 p-3 rounded-xl bg-base-200/50">
            <div className="w-8 h-8 rounded-lg bg-base-300/50 flex items-center justify-center text-base-content/40 flex-shrink-0">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-base-content/50 font-medium uppercase tracking-wider">
                Statut
              </p>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusConf.bg} ${statusConf.text}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${statusConf.dot}`}
                  ></span>
                  {statusConf.label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ItemIcon({ type }) {
  const icons = {
    briefcase: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    building: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    department: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    user: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    academic: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
    calendar: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    clock: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };
  return icons[type] || null;
}
