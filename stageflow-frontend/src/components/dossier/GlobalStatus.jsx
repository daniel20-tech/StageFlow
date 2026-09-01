import { getProgressStats } from "../../data/demoData";

const STAGE_STATUS = {
  BROUILLON: { label: "Brouillon", color: "text-base-content", dotColor: "bg-base-content/40" },
  EN_ATTENTE: { label: "En attente", color: "text-warning", dotColor: "bg-warning" },
  EN_COURS: { label: "En cours", color: "text-info", dotColor: "bg-info" },
  EVALUATION_EN_COURS: { label: "\u00c9valuation en cours", color: "text-accent", dotColor: "bg-accent" },
  TERMINE: { label: "Termin\u00e9", color: "text-success", dotColor: "bg-success" },
  ANNULE: { label: "Annul\u00e9", color: "text-error", dotColor: "bg-error" },
};

export default function GlobalStatus({ stage, documents }) {
  const stats = getProgressStats(documents);
  const enAttente = documents.filter(
    (d) =>
      (d.statut === "SOUMIS" || d.statut === "EN_ATTENTE") && !d.a_retourner
  ).length;
  const aCorriger = documents.filter((d) => d.statut === "REJETE").length;
  const stageStatus = STAGE_STATUS[stage.statut] || STAGE_STATUS.EN_COURS;

  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body p-6">
        <div className="flex items-center gap-2 mb-5">
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h2 className="card-title text-lg font-semibold">État du dossier</h2>
        </div>

        <div className="space-y-3">
          <StatusRow
            label="Stage"
            value={stageStatus.label}
            color={stageStatus.color}
            dotColor={stageStatus.dotColor}
          />
          <StatusRow
            label="Progression"
            value={`${stats.pourcentage}%`}
            color="text-primary"
          />
          <StatusRow
            label="Documents"
            value={`${stats.deposes} / ${stats.total}`}
            color="text-base-content"
          />
          <StatusRow
            label="Documents validés"
            value={String(stats.valides)}
            color="text-success"
          />
          <StatusRow
            label="Documents en attente"
            value={String(enAttente)}
            color="text-warning"
          />
          <StatusRow
            label="Documents à corriger"
            value={String(aCorriger)}
            color="text-error"
            dotColor="bg-error"
          />
          <StatusRow
            label="Documents à retourner"
            value={String(stats.aRetourner)}
            color="text-accent"
          />
        </div>
      </div>
    </div>
  );
}

function StatusRow({ label, value, color, dotColor }) {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-base-200/50">
      <span className="text-sm text-base-content/60">{label}</span>
      <div className="flex items-center gap-2">
        {dotColor && (
          <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
        )}
        <span className={`text-sm font-bold ${color}`}>{value}</span>
      </div>
    </div>
  );
}
