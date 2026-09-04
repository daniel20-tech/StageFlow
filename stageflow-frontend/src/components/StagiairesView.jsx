import { useState, useEffect, useCallback } from "react";
import { api } from "../api.js";
import {
  ACTION_ICONS,
  DOC_STATUS_META,
  fileIconFor,
} from "./icons.jsx";
import DossierDrawer from "./document/DossierDrawer.jsx";
import AddDocumentModal from "./document/AddDocumentModal.jsx";

function Badge({ children, color = "ghost" }) {
  return (
    <span className={`badge badge-${color} badge-sm`}>{children}</span>
  );
}

function StageStatutBadge({ statut }) {
  const colors = {
    BROUILLON: "ghost",
    EN_ATTENTE: "warning",
    EN_COURS: "info",
    EVALUATION_EN_COURS: "primary",
    TERMINE: "success",
    ANNULE: "error",
  };
  return <Badge color={colors[statut] || "ghost"}>{statut}</Badge>;
}

function DocStatutBadge({ statut }) {
  const colors = {
    EN_ATTENTE: "ghost",
    SOUMIS: "info",
    VALIDE: "success",
    REJETE: "error",
  };
  return <Badge color={colors[statut] || "ghost"}>{statut}</Badge>;
}

function StagiaireCard({ stagiaire, onOpenDetail, onOpenDossier, onAddDocument }) {
  const user = stagiaire.utilisateur || {};
  const initials = `${(user.prenom || "?")[0]}${(user.nom || "?")[0]}`.toUpperCase();
  const docs = stagiaire.documents || [];
  const totalDocs = docs.length;
  const validated = docs.filter((d) => d.statut_doc === "VALIDE").length;

  return (
    <div
      className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onOpenDetail(stagiaire)}
    >
      <div className="card-body p-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-lg font-bold shadow-md flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-base-content truncate">
              {user.prenom} {user.nom}
            </h3>
            <p className="text-xs text-base-content/50 truncate mt-0.5">
              {user.email}
            </p>
          </div>
        </div>

        <div className="divider my-1"></div>

        <div className="space-y-2">
          <InfoRow
            label="Matricule"
            value={stagiaire.matricule || "—"}
            icon={
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
              </svg>
            }
          />
          <InfoRow
            label="Filière"
            value={stagiaire.filiere || "—"}
            icon={
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
          />
        </div>

        {/* Mini document summary */}
        <div className="mt-3 pt-3 border-t border-base-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-medium text-base-content/50 uppercase tracking-wider">
              Documents
            </span>
            <span className="text-[10px] font-bold text-primary">
              {validated}/{totalDocs} validés
            </span>
          </div>
          {totalDocs === 0 ? (
            <p className="text-[10px] text-base-content/40 italic">
              Aucun document déposé
            </p>
          ) : (
            <div className="flex flex-wrap gap-1">
              {docs.map((doc, idx) => {
                const meta = DOC_STATUS_META[doc.statut_doc] || DOC_STATUS_META.EN_ATTENTE;
                return (
                  <span
                    key={`${doc.type_doc}-${doc.statut_doc}-${idx}`}
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-semibold ${meta.badge} tooltip`}
                    data-tip={`${doc.type_doc} · ${meta.label}`}
                    title={`${doc.type_doc} · ${meta.label}`}
                  >
                    {fileIconFor(doc.type_doc)}
                    {doc.type_doc}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-base-300 gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[10px] text-base-content/50">
              <div className="w-1.5 h-1.5 rounded-full bg-info"></div>
              {totalDocs} doc(s)
            </div>
          </div>
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              className="btn btn-outline btn-xs gap-1"
              title="Ajouter un document"
              onClick={() => onAddDocument(stagiaire)}
            >
              {ACTION_ICONS.upload}
              Document
            </button>
            <button
              className="btn btn-primary btn-xs gap-1 text-white"
              title="Consulter le dossier"
              onClick={() => onOpenDossier(stagiaire)}
            >
              {ACTION_ICONS.eye}
              Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, icon }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-6 h-6 rounded-md bg-base-200 flex items-center justify-center text-base-content/30 flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-base-content/40 font-medium uppercase tracking-wider">
          {label}
        </p>
        <p className="text-xs font-semibold text-base-content truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

function CreateStagiaireModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    mot_de_passe: "",
    telephone: "",
    adresse: "",
    matricule: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const userPayload = {
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        mot_de_passe: form.mot_de_passe,
        role: "STAGIAIRE",
      };
      const user = await api.createUser(userPayload);

      const stagiairePayload = {
        utilisateur_id: user.id,
        matricule: form.matricule,
      };
      if (form.telephone) stagiairePayload.telephone = form.telephone;
      if (form.adresse) stagiairePayload.adresse = form.adresse;

      await api.createIntern(stagiairePayload);

      setForm({
        nom: "",
        prenom: "",
        email: "",
        mot_de_passe: "",
        telephone: "",
        adresse: "",
        matricule: "",
      });
      onCreated();
    } catch (err) {
      setError(
        err.response?.data?.detail || err.message || "Erreur lors de la création"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-base-content/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-base-100 rounded-2xl shadow-2xl border border-base-300 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="card-body p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
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
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-base-content">
                  Ajouter un stagiaire
                </h2>
                <p className="text-xs text-base-content/50">
                  Créer un compte utilisateur et associer le profil stagiaire.
                </p>
              </div>
            </div>
            <button
              className="btn btn-ghost btn-sm btn-square"
              onClick={onClose}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-xs font-medium">
                    Nom <span className="text-error">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="nom"
                  className="input input-bordered input-sm"
                  required
                  value={form.nom}
                  onChange={onChange}
                  placeholder="Dupont"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-xs font-medium">
                    Prénom <span className="text-error">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="prenom"
                  className="input input-bordered input-sm"
                  required
                  value={form.prenom}
                  onChange={onChange}
                  placeholder="Jean"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-xs font-medium">
                  Email <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="email"
                name="email"
                className="input input-bordered input-sm"
                required
                value={form.email}
                onChange={onChange}
                placeholder="jean.dupont@exemple.com"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-xs font-medium">
                  Mot de passe <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="password"
                name="mot_de_passe"
                className="input input-bordered input-sm"
                required
                minLength={8}
                value={form.mot_de_passe}
                onChange={onChange}
                placeholder="Min. 8 caractères"
              />
            </div>

            <div className="divider text-xs text-base-content/40 my-1">
              Informations du profil stagiaire
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-xs font-medium">
                  Matricule <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                name="matricule"
                className="input input-bordered input-sm"
                required
                value={form.matricule}
                onChange={onChange}
                placeholder="STG-2026-001"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-xs font-medium">
                    Téléphone
                  </span>
                </label>
                <input
                  type="tel"
                  name="telephone"
                  className="input input-bordered input-sm"
                  value={form.telephone}
                  onChange={onChange}
                  placeholder="+243 ..."
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-xs font-medium">
                    Adresse
                  </span>
                </label>
                <input
                  type="text"
                  name="adresse"
                  className="input input-bordered input-sm"
                  value={form.adresse}
                  onChange={onChange}
                  placeholder="Kinshasa, RDC"
                />
              </div>
            </div>

            {error && (
              <div className="alert alert-error py-2 text-xs">
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={onClose}
              >
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
                )}
                Créer le stagiaire
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function StageEncadreurPicker({ stage, supervisors, onAssigned }) {
  const [encadreurId, setEncadreurId] = useState(stage.encadreur_id || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  const currentName = stage.encadreur
    ? `${stage.encadreur.prenom} ${stage.encadreur.nom}`
    : null;

  const handleSave = async () => {
    if (!encadreurId) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await api.assignSupervisor(stage.stage_id, encadreurId);
      setSaved(true);
      onAssigned && onAssigned();
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl p-3 bg-base-100 border border-base-300">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-base-content truncate">
            {stage.theme}
          </p>
          <p className="text-[10px] text-base-content/40 mt-0.5 truncate">
            {stage.type_stage}
            {stage.etablissement ? ` · ${stage.etablissement.nom}` : ""}
          </p>

          {currentName ? (
            <p className="text-xs text-base-content/60 mt-1.5 flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5 text-success"
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
              Encadreur : <span className="font-semibold">{currentName}</span>
            </p>
          ) : (
            <p className="text-xs text-base-content/40 italic mt-1.5">
              Aucun encadreur assigné
            </p>
          )}
        </div>
        <div className="flex-shrink-0">
          <StageStatutBadge statut={stage.statut} />
        </div>
      </div>

      <div className="divider my-2.5"></div>

      <div className="flex items-center gap-2">
        <select
          className="select select-bordered select-sm flex-1"
          value={encadreurId}
          onChange={(e) => {
            setEncadreurId(e.target.value);
            setError(null);
            setSaved(false);
          }}
        >
          <option value="">— Sélectionner un encadreur —</option>
          {supervisors.map((sup) => (
            <option key={sup.id} value={sup.id}>
              {sup.prenom} {sup.nom}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn btn-outline btn-sm gap-1.5"
          onClick={handleSave}
          disabled={saving || !encadreurId}
        >
          {saving ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          )}
          Assigner
        </button>
      </div>

      {saved && (
        <p className="text-xs text-success mt-2 flex items-center gap-1">
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Encadreur assigné avec succès.
        </p>
      )}

      {error && <p className="text-xs text-error mt-2">{error}</p>}
    </div>
  );
}

function StagiaireDetailModal({ stagiaire, onClose, onAssigned }) {
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!stagiaire) return;
    setLoading(true);
    setError(null);
    api
      .listSupervisors()
      .then(setSupervisors)
      .catch((err) =>
        setError(err.response?.data?.detail || err.message)
      )
      .finally(() => setLoading(false));
  }, [stagiaire]);

  if (!stagiaire) return null;
  const user = stagiaire.utilisateur || {};
  const stages = stagiaire.stages || [];
  const initials = `${(user.prenom || "?")[0]}${(user.nom || "?")[0]}`.toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-base-content/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-base-100 rounded-2xl shadow-2xl border border-base-300 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="card-body p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold shadow-md">
                {initials}
              </div>
              <div>
                <h2 className="text-lg font-bold text-base-content">
                  {user.prenom} {user.nom}
                </h2>
                <p className="text-xs text-base-content/50">{user.email}</p>
              </div>
            </div>
            <button
              className="btn btn-ghost btn-sm btn-square"
              onClick={onClose}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="p-3 rounded-xl bg-base-200/50">
              <p className="text-[10px] text-base-content/40 font-medium uppercase tracking-wider">
                Matricule
              </p>
              <p className="text-sm font-semibold text-base-content mt-0.5">
                {stagiaire.matricule}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-base-200/50">
              <p className="text-[10px] text-base-content/40 font-medium uppercase tracking-wider">
                Téléphone
              </p>
              <p className="text-sm font-semibold text-base-content mt-0.5">
                {stagiaire.telephone || "—"}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-base-200/50 sm:col-span-2">
              <p className="text-[10px] text-base-content/40 font-medium uppercase tracking-wider">
                Adresse
              </p>
              <p className="text-sm font-semibold text-base-content mt-0.5">
                {stagiaire.adresse || "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-base-content">
              Stages ({stages.length})
            </h3>
          </div>

          {stages.length > 0 ? (
            <div className="space-y-2">
              {stages.map((stage) => (
                <StageEncadreurPicker
                  key={stage.stage_id}
                  stage={stage}
                  supervisors={supervisors}
                  onAssigned={onAssigned}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-base-content/40 italic">
              Aucun stage associé
            </div>
          )}

          {loading && (
            <p className="text-xs text-base-content/40 mt-3 text-center">
              Chargement des encadreurs...
            </p>
          )}
          {error && (
            <p className="text-xs text-warning mt-3 text-center">
              Encadreurs indisponibles : {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StagiairesView() {
  const [stagiaires, setStagiaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [addDocStage, setAddDocStage] = useState(null);
  const [detailStagiaire, setDetailStagiaire] = useState(null);
  const [dossierStagiaire, setDossierStagiaire] = useState(null);
  const [loadingFull, setLoadingFull] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listInternsCompact({ limit: 200 });
      setStagiaires(data.items || data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openDossier = async (stagiaire) => {
    setLoadingFull(true);
    try {
      const full = await api.getInternWithStages(stagiaire.id);
      setDossierStagiaire(full);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoadingFull(false);
    }
  };

  const openDetail = async (stagiaire) => {
    setLoadingFull(true);
    try {
      const full = await api.getInternWithStages(stagiaire.id);
      setDetailStagiaire(full);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoadingFull(false);
    }
  };

  const openAddDocument = async (stagiaire) => {
    setLoadingFull(true);
    try {
      const full = await api.getInternWithStages(stagiaire.id);
      const stage = full?.stages?.[0] || null;
      if (!stage) {
        setError("Aucun stage associé : impossible d'ajouter un document pour le moment.");
        return;
      }
      setAddDocStage(stage);
      setShowAddDoc(true);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoadingFull(false);
    }
  };

  const refreshFull = useCallback(async (id) => {
    if (id) {
      const full = await api.getInternWithStages(id);
      return full;
    }
    return null;
  }, []);

  const handleChanged = async (id) => {
    await load();
    if (id) {
      try {
        const full = await refreshFull(id);
        setDossierStagiaire((current) =>
          current && current.id === full.id ? full : current
        );
      } catch (err) {
        /* ignore refresh error, list already reloaded */
      }
    }
  };

  return (
    <div className="w-full">
      {/* Fixed Header */}
      <div className="fixed top-0 left-64 right-0 bg-base-100 border-b border-base-300 shadow-md z-40">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
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
                Stagiaires
              </h1>
              <p className="text-xs text-base-content/60 mt-0.5">
                Gérez les comptes stagiaires et visualisez leurs stages.
              </p>
            </div>
            <button
              className="btn btn-primary btn-sm gap-2 text-white"
              onClick={() => setShowCreateModal(true)}
            >
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
              Ajouter un stagiaire
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-32">
        {loading ? (
          <div className="space-y-6">
            <div className="skeleton h-20 w-full rounded-xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-64 w-full rounded-xl"></div>
              ))}
            </div>
          </div>
        ) : error ? (
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
                {error || "Impossible de charger les stagiaires."}
              </p>
              <button
                className="btn btn-primary gap-2 text-white"
                onClick={load}
              >
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
            </div>
          </div>
        ) : stagiaires.length === 0 ? (
          <div className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body items-center text-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-base-200 flex items-center justify-center text-base-content/30 mb-4">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-base-content mb-1">
                Aucun stagiaire
              </h3>
              <p className="text-sm text-base-content/50 max-w-sm mb-6">
                Aucun stagiaire n'a encore été enregistré dans le système.
              </p>
              <button
                className="btn btn-primary gap-2 text-white"
                onClick={() => setShowCreateModal(true)}
              >
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
                Ajouter un stagiaire
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {stagiaires.map((s) => (
              <StagiaireCard
                key={s.id}
                stagiaire={s}
                onOpenDetail={openDetail}
                onOpenDossier={openDossier}
                onAddDocument={openAddDocument}
              />
            ))}
          </div>
        )}
      </div>

      {loadingFull && (
        <div className="fixed top-4 right-4 z-[60]">
          <span className="loading loading-spinner loading-sm text-primary"></span>
        </div>
      )}

      <CreateStagiaireModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={() => {
          setShowCreateModal(false);
          load();
        }}
      />

      <StagiaireDetailModal
        stagiaire={detailStagiaire}
        onClose={() => setDetailStagiaire(null)}
        onAssigned={load}
      />

      <DossierDrawer
        stagiaire={dossierStagiaire}
        onClose={() => setDossierStagiaire(null)}
        onChanged={(id) => handleChanged(id)}
      />

      <AddDocumentModal
        open={showAddDoc}
        stage={addDocStage}
        onClose={() => {
          setShowAddDoc(false);
          setAddDocStage(null);
        }}
        onUploaded={() => {
          setShowAddDoc(false);
          setAddDocStage(null);
          handleChanged(dossierStagiaire?.id);
        }}
      />
    </div>
  );
}
