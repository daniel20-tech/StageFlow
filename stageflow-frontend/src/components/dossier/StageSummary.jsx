import { getProgressStats, formatDate } from "../../data/demoData";

const STAGE_STATUS_BADGES = {
  BROUILLON: { label: "Brouillon", badge: "badge-ghost" },
  EN_ATTENTE: { label: "En attente", badge: "badge-warning" },
  EN_COURS: { label: "En cours", badge: "badge-info" },
  EVALUATION_EN_COURS: { label: "\u00c9valuation en cours", badge: "badge-accent" },
  TERMINE: { label: "Termin\u00e9", badge: "badge-success" },
  ANNULE: { label: "Annul\u00e9", badge: "badge-error" },
};

export default function StageSummary({ stage, student, documents }) {
  const stats = getProgressStats(documents);

  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm mb-6">
      <div className="card-body p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-primary"
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
          <h2 className="card-title text-lg font-semibold">Synthèse du stage</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <InfoItem
            label="Stagiaire"
            value={`${student.prenom} ${student.nom}`}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />
          <InfoItem
            label="Type de stage"
            value={stage.type_stage}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />
          <InfoItem
            label="Établissement d'accueil"
            value={stage.etablissement}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />
          <InfoItem
            label="Encadreur"
            value={stage.encadreur_professionnel}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
          <InfoItem
            label="Période"
            value={`${formatDate(stage.date_debut)} \u2192 ${formatDate(stage.date_fin)}`}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
          <InfoItem
            label="Statut"
            value={(() => {
              const conf = STAGE_STATUS_BADGES[stage.statut] || STAGE_STATUS_BADGES.EN_COURS;
              return (
                <span className={`badge badge-lg font-semibold ${conf.badge}`}>
                  {conf.label}
                </span>
              );
            })()}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-base-content/70">
              Progression
            </span>
            <span className="text-sm font-bold text-primary">
              {stats.pourcentage}%
            </span>
          </div>
          <progress
            className="progress progress-primary w-full h-3"
            value={stats.deposes}
            max={stats.total}
          ></progress>
          <div className="flex flex-wrap items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-base-content/60">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              {stats.deposes} documents déposés
            </div>
            <div className="flex items-center gap-1.5 text-xs text-base-content/60">
              <div className="w-2 h-2 rounded-full bg-success"></div>
              {stats.valides} documents validés
            </div>
            <div className="flex items-center gap-1.5 text-xs text-base-content/60">
              <div className="w-2 h-2 rounded-full bg-warning"></div>
              {stats.aRetourner} à retourner
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value, icon }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-base-200/50">
      <div className="w-8 h-8 rounded-lg bg-base-300/50 flex items-center justify-center text-base-content/40 flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-base-content/50 font-medium uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm font-semibold text-base-content mt-0.5 truncate">
          {value}
        </p>
      </div>
    </div>
  );
}
