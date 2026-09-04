import { useState, useEffect, useMemo, useCallback } from "react";
import { api } from "../api.js";

const ROLE_CONFIG = {
  ADMINISTRATEUR: {
    label: "Administrateur",
    badge: "badge-primary",
    icon: "shield",
    color: "from-primary to-primary/70",
  },
  ENCADREUR: {
    label: "Encadreur",
    badge: "badge-secondary",
    icon: "supervisor",
    color: "from-secondary to-secondary/70",
  },
  STAGIAIRE: {
    label: "Stagiaire",
    badge: "badge-info",
    icon: "student",
    color: "from-info to-info/70",
  },
};

const ICONS = {
  user: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  group: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  shield: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  supervisor: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  student: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  ),
  search: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  plus: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  ),
  close: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
};

function RoleBadge({ role }) {
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.STAGIAIRE;
  return <span className={`badge ${config.badge} badge-sm gap-1`}>{ICONS[config.icon]}{config.label}</span>;
}

function Field({ label, name, value, onChange, type = "text", required, placeholder }) {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text text-xs font-medium">
          {label} {required && <span className="text-error">*</span>}
        </span>
      </label>
      <input
        type={type}
        name={name}
        className="input input-bordered input-sm"
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

function CreateUserModal({ open, onClose, onCreated }) {
  const [role, setRole] = useState("STAGIAIRE");
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    mot_de_passe: "",
    matricule: "",
    filiere: "",
    periode_stage: "",
    telephone: "",
    adresse: "",
    departement: "",
    specialite: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const switchRole = (next) => {
    setRole(next);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = {
        role,
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        mot_de_passe: form.mot_de_passe,
      };
      if (role === "STAGIAIRE" || role === "ADMINISTRATEUR") {
        if (form.matricule) payload.matricule = form.matricule;
        if (form.filiere) payload.filiere = form.filiere;
        if (form.periode_stage) payload.periode_stage = form.periode_stage;
        if (form.telephone) payload.telephone = form.telephone;
        if (form.adresse) payload.adresse = form.adresse;
      }
      if (role === "ENCADREUR") {
        if (form.departement) payload.departement = form.departement;
        if (form.specialite) payload.specialite = form.specialite;
      }
      await api.createCompte(payload);
      setForm({
        nom: "",
        prenom: "",
        email: "",
        mot_de_passe: "",
        matricule: "",
        filiere: "",
        periode_stage: "",
        telephone: "",
        adresse: "",
        departement: "",
        specialite: "",
      });
      onCreated();
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const roleOptions = [
    {
      key: "STAGIAIRE",
      label: "Stagiaire",
      desc: "Étudiant en stage",
      icon: "student",
      active: "border-info text-info",
      color: "from-info to-info/70",
    },
    {
      key: "ENCADREUR",
      label: "Encadreur",
      desc: "Superviseur de stage",
      icon: "supervisor",
      active: "border-secondary text-secondary",
      color: "from-secondary to-secondary/70",
    },
    {
      key: "ADMINISTRATEUR",
      label: "Administrateur",
      desc: "Gestion du système",
      icon: "shield",
      active: "border-primary text-primary",
      color: "from-primary to-primary/70",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-base-content/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-base-100 rounded-2xl shadow-2xl border border-base-300 w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="card-body p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="text-primary">{ICONS.group}</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-base-content">Créer un compte</h2>
                <p className="text-xs text-base-content/50">
                  Choisissez le type de compte à créer.
                </p>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm btn-square" onClick={onClose}>
              {ICONS.close}
            </button>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {roleOptions.map((opt) => {
              const selected = role === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => switchRole(opt.key)}
                  className={`rounded-2xl border-2 p-4 text-center transition-all ${
                    selected
                      ? `${opt.active} bg-base-200/50 shadow-sm`
                      : "border-base-300 hover:border-base-content/30"
                  }`}
                >
                  <div
                    className={`mx-auto w-10 h-10 rounded-xl bg-gradient-to-br ${opt.color} flex items-center justify-center text-white mb-2`}
                  >
                    {ICONS[opt.icon]}
                  </div>
                  <p className={`text-sm font-bold ${selected ? "" : "text-base-content/70"}`}>
                    {opt.label}
                  </p>
                  <p className="text-[10px] text-base-content/40 mt-0.5">{opt.desc}</p>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nom" name="nom" value={form.nom} onChange={onChange} required placeholder="Dupont" />
              <Field label="Prénom" name="prenom" value={form.prenom} onChange={onChange} required placeholder="Jean" />
            </div>

            <Field label="Email" name="email" type="email" value={form.email} onChange={onChange} required placeholder="jean.dupont@exemple.com" />
            <Field label="Mot de passe" name="mot_de_passe" type="password" value={form.mot_de_passe} onChange={onChange} required placeholder="Min. 8 caractères" />

            {role === "STAGIAIRE" && (
              <>
                <div className="divider text-xs text-base-content/40 my-1">
                  Informations du stagiaire
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Matricule" name="matricule" value={form.matricule} onChange={onChange} required placeholder="STG-2026-001" />
                  <Field label="Filière" name="filiere" value={form.filiere} onChange={onChange} placeholder="Informatique" />
                  <Field label="Période de stage" name="periode_stage" value={form.periode_stage} onChange={onChange} placeholder="Août - Sept. 2026" />
                  <Field label="Téléphone" name="telephone" type="tel" value={form.telephone} onChange={onChange} placeholder="+243 ..." />
                </div>
                <Field label="Adresse" name="adresse" value={form.adresse} onChange={onChange} placeholder="Kinshasa, RDC" />
              </>
            )}

            {role === "ENCADREUR" && (
              <>
                <div className="divider text-xs text-base-content/40 my-1">
                  Informations de l'encadreur
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Département" name="departement" value={form.departement} onChange={onChange} placeholder="Informatique" />
                  <Field label="Spécialité" name="specialite" value={form.specialite} onChange={onChange} placeholder="Génie logiciel" />
                </div>
              </>
            )}

            {role === "ADMINISTRATEUR" && (
              <p className="text-xs text-base-content/40 italic">
                Aucune information supplémentaire requise pour un administrateur.
              </p>
            )}

            {error && (
              <div className="alert alert-error py-2 text-xs">
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm gap-2 text-white"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  ICONS.plus
                )}
                Créer le compte
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function UserDetailModal({ user, onClose }) {
  if (!user) return null;
  const config = ROLE_CONFIG[user.role] || ROLE_CONFIG.STAGIAIRE;
  const initials = `${(user.prenom || "?")[0]}${(user.nom || "?")[0]}`.toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-base-content/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-base-100 rounded-2xl shadow-2xl border border-base-300 w-full max-w-md mx-4">
        <div className="card-body p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${config.color} flex items-center justify-center text-white text-xl font-bold shadow-md`}>
                {initials}
              </div>
              <div>
                <h2 className="text-lg font-bold text-base-content">
                  {user.prenom} {user.nom}
                </h2>
                <RoleBadge role={user.role} />
              </div>
            </div>
            <button className="btn btn-ghost btn-sm btn-square" onClick={onClose}>
              {ICONS.close}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="p-3 rounded-xl bg-base-200/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-base-300/50 flex items-center justify-center text-base-content/40">
                {ICONS.user}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-base-content/40 font-medium uppercase tracking-wider">Email</p>
                <p className="text-sm font-semibold text-base-content truncate">{user.email}</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-base-200/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-base-300/50 flex items-center justify-center text-base-content/40">
                {config.icon === "shield" ? ICONS.shield : config.icon === "supervisor" ? ICONS.supervisor : ICONS.student}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-base-content/40 font-medium uppercase tracking-wider">Rôle</p>
                <p className="text-sm font-semibold text-base-content">{config.label}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const DOC_BADGE_COLOR = {
  VALIDE: "badge-success",
  SOUMIS: "badge-info",
  EN_ATTENTE: "badge-warning",
  REJETE: "badge-error",
};

function UserDocBadge({ doc }) {
  const base = doc.nom_doc || doc.type_doc || "Document";
  const short =
    base.length > 14 ? `${base.slice(0, 13)}…` : base;
  const color = DOC_BADGE_COLOR[doc.statut_doc] || "badge-ghost";
  return (
    <span className={`badge badge-sm gap-1 ${color}`} title={base}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
      {short}
    </span>
  );
}

function CategoryIcon({ kind }) {
  if (kind === "encadreur") {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3l1.5 3.5L17 8l-3.5 1.5L12 13l-1.5-3.5L7 8l3.5-1.5L12 3z" />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  );
}

function CompactUserCard({ user, docs, onOpen }) {
  const config = ROLE_CONFIG[user.role] || ROLE_CONFIG.STAGIAIRE;
  const initials = `${(user.prenom || "?")[0]}${(user.nom || "?")[0]}`.toUpperCase();
  const docsToShow = (docs || []).slice(0, 3);
  const extraDocs = (docs?.length || 0) - docsToShow.length;

  return (
    <button
      className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md hover:border-primary/40 transition-all cursor-pointer text-left p-3 flex items-center gap-3 min-w-[230px]"
      onClick={() => onOpen(user)}
    >
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0`}>
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-base-content truncate">
            {user.prenom} {user.nom}
          </p>
          <RoleBadge role={user.role} />
        </div>
        {docsToShow.length > 0 ? (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {docsToShow.map((doc, idx) => (
              <UserDocBadge
                key={doc.document_id || `${doc.type_doc}-${doc.statut_doc}-${idx}`}
                doc={doc}
              />
            ))}
            {extraDocs > 0 && (
              <span className="badge badge-sm badge-ghost">+{extraDocs}</span>
            )}
          </div>
        ) : (
          <p className="text-[11px] text-base-content/40 mt-1.5">Aucun document</p>
        )}
      </div>
    </button>
  );
}

function CategorySection({ title, icon, accentColor, users, docsByUserId, onOpen }) {
  return (
    <section className="rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm">
      <div className="flex items-center gap-2.5 mb-3">
        <div className={`w-8 h-8 rounded-lg ${accentColor} flex items-center justify-center flex-shrink-0`}>
          <CategoryIcon kind={icon} />
        </div>
        <h3 className="text-sm font-bold text-base-content">{title}</h3>
        <span className="badge badge-ghost badge-sm">{users.length}</span>
        {users.length === 0 && (
          <span className="text-xs text-base-content/40 ml-1">— aucun</span>
        )}
      </div>
      {users.length > 0 ? (
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
          {users.map((user) => (
            <div key={user.id} className="snap-start flex-shrink-0">
              <CompactUserCard user={user} docs={docsByUserId[user.id]} onOpen={onOpen} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-xs text-base-content/40 italic py-4 border border-dashed border-base-300 rounded-xl">
          Aucun utilisateur dans cette catégorie
        </div>
      )}
    </section>
  );
}

export default function UsersView() {
  const [users, setUsers] = useState([]);
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [detailUser, setDetailUser] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("TOUS");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [data, internData] = await Promise.all([
        api.listUsers(),
        api.listInternsCompact({ limit: 200 }),
      ]);
      setUsers(data);
      setInterns(internData.items || internData);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const usersById = useMemo(() => {
    const map = {};
    users.forEach((u) => (map[u.id] = u));
    return map;
  }, [users]);

  const docsByUserId = useMemo(() => {
    const map = {};
    interns.forEach((s) => {
      const uid = s.utilisateur_id;
      if (!uid) return;
      map[uid] = s.documents || [];
    });
    return map;
  }, [interns]);

  const appliedUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter((u) => {
      if (filter === "ENCADREURS" && u.role !== "ENCADREUR") return false;
      if (filter === "STAGIAIRES" && u.role !== "STAGIAIRE") return false;
      if (!term) return true;
      return (
        `${u.prenom} ${u.nom}`.toLowerCase().includes(term) ||
        (u.email || "").toLowerCase().includes(term)
      );
    });
  }, [users, search, filter]);

  const encadreurs = appliedUsers.filter((u) => u.role === "ENCADREUR");
  const stagiaires = appliedUsers.filter((u) => u.role === "STAGIAIRE");
  const administrateurs = appliedUsers.filter((u) => u.role === "ADMINISTRATEUR");

  const totalFiltered = encadreurs.length + stagiaires.length + administrateurs.length;

  const filterButtons = [
    { key: "TOUS", label: "Tous" },
    { key: "ENCADREURS", label: "Encadreurs" },
    { key: "STAGIAIRES", label: "Stagiaires" },
  ];

  return (
    <div className="w-full">
      {/* Fixed Header */}
      <div className="fixed top-0 left-64 right-0 bg-base-100 border-b border-base-300 shadow-md z-40">
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center flex-shrink-0">
              <img
                src="/images/stageflow-logo.png"
                alt="StageFlow"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-base-content tracking-tight">
                Gestion des Utilisateurs
              </h1>
              <p className="text-xs text-base-content/60 mt-0.5">
                Gérez les comptes des utilisateurs de la plateforme.
              </p>
            </div>
            <button
              className="btn btn-primary btn-sm gap-2 text-white"
              onClick={() => setShowCreate(true)}
            >
              {ICONS.plus}
              Nouvel utilisateur
            </button>
          </div>

          {/* Quick action bar */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            <div className="relative w-full max-w-sm">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40">
                {ICONS.search}
              </span>
              <input
                type="text"
                className="input input-bordered input-sm w-full pl-9"
                placeholder="Rechercher par nom..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              {filterButtons.map((btn) => (
                <button
                  key={btn.key}
                  className={`btn btn-sm ${filter === btn.key ? "btn-primary text-white" : "btn-outline"}`}
                  onClick={() => setFilter(btn.key)}
                >
                  {btn.label}
                </button>
              ))}
            </div>
            <span className="text-xs text-base-content/40">
              {totalFiltered} / {users.length} utilisateur(s)
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-40 px-4 sm:px-6 lg:px-8 space-y-5">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="skeleton h-32 w-full rounded-2xl"></div>
            ))}
          </div>
        ) : error ? (
          <div className="card bg-base-100 border border-error/20 shadow-sm">
            <div className="card-body items-center text-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-error/10 flex items-center justify-center text-error mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-base-content mb-1">Une erreur est survenue</h3>
              <p className="text-sm text-base-content/50 max-w-sm mb-6">
                {error || "Impossible de charger les utilisateurs."}
              </p>
              <button className="btn btn-primary gap-2 text-white" onClick={load}>
                Réessayer
              </button>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body items-center text-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-base-200 flex items-center justify-center text-base-content/30 mb-4">
                {ICONS.group}
              </div>
              <h3 className="text-lg font-semibold text-base-content mb-1">Aucun utilisateur</h3>
              <p className="text-sm text-base-content/50 max-w-sm mb-6">
                Aucun utilisateur n'a encore été créé dans le système.
              </p>
              <button
                className="btn btn-primary gap-2 text-white"
                onClick={() => setShowCreate(true)}
              >
                {ICONS.plus}
                Nouvel utilisateur
              </button>
            </div>
          </div>
        ) : totalFiltered === 0 ? (
          <div className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body items-center text-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-base-200 flex items-center justify-center text-base-content/30 mb-4">
                {ICONS.group}
              </div>
              <h3 className="text-lg font-semibold text-base-content mb-1">Aucun résultat</h3>
              <p className="text-sm text-base-content/50 max-w-sm mb-6">
                Aucun utilisateur ne correspond à votre recherche ou à la catégorie sélectionnée.
              </p>
            </div>
          </div>
        ) : (
          <>
            <CategorySection
              title="Encadreurs"
              icon="encadreur"
              accentColor="bg-secondary/10 text-secondary"
              users={encadreurs}
              docsByUserId={docsByUserId}
              onOpen={setDetailUser}
            />
            <CategorySection
              title="Stagiaires"
              icon="stagiaire"
              accentColor="bg-info/10 text-info"
              users={stagiaires}
              docsByUserId={docsByUserId}
              onOpen={setDetailUser}
            />
            {administrateurs.length > 0 && (
              <CategorySection
                title="Administrateurs"
                icon="stagiaire"
                accentColor="bg-primary/10 text-primary"
                users={administrateurs}
                docsByUserId={docsByUserId}
                onOpen={setDetailUser}
              />
            )}
          </>
        )}
      </div>

      <CreateUserModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={() => {
          setShowCreate(false);
          load();
        }}
      />

      <UserDetailModal user={detailUser} onClose={() => setDetailUser(null)} />
    </div>
  );
}
