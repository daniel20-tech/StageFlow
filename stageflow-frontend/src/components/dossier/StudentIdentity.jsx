export default function StudentIdentity({ student }) {
  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="card-title text-lg font-semibold">
            Identité du stagiaire
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {student.prenom[0]}
              {student.nom[0]}
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            <DetailRow label="Nom" value={`${student.nom} ${student.prenom}`} />
            <DetailRow label="Matricule" value={student.matricule} />
            <DetailRow label="Filière" value={student.filiere} />
            <DetailRow label="Niveau" value={student.niveau} />
            <DetailRow label="Université" value={student.universite} />
            <DetailRow label="Téléphone" value={student.telephone} />
            <div className="sm:col-span-2">
              <DetailRow label="Email" value={student.email} />
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-base-300">
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
            Modifier mes informations
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div>
      <p className="text-xs text-base-content/50 font-medium uppercase tracking-wider">
        {label}
      </p>
      <p className="text-sm font-semibold text-base-content mt-0.5">{value}</p>
    </div>
  );
}
