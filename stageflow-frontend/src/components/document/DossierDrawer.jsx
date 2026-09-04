import { useState } from "react";
import { api } from "../../api.js";
import {
  ACTION_ICONS,
  DOC_STATUS_META,
  fileIconFor,
  formatDateLong,
  formatSize,
} from "../icons.jsx";
import AddDocumentModal from "./AddDocumentModal.jsx";

function DocStatusBadge({ statut }) {
  const meta = DOC_STATUS_META[statut] || DOC_STATUS_META.EN_ATTENTE;
  return <span className={`badge badge-sm ${meta.badge}`}>{meta.label}</span>;
}

function DocumentRow({ doc, stageId, onChanged }) {
  const [busy, setBusy] = useState(false);

  const changeStatus = async (statut) => {
    setBusy(true);
    try {
      await api.updateDocumentStatus(doc.document_id, statut);
      onChanged && onChanged();
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Supprimer le document « ${doc.nom_doc} » ?`)) return;
    setBusy(true);
    try {
      await api.deleteDocument(doc.document_id);
      onChanged && onChanged();
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  const download = () => {
    const tab = window.open("", "_blank");
    if (tab) tab.location.href = api.documentUrl(doc.document_id);
  };

  return (
    <div className="p-3 rounded-xl bg-base-200/50 hover:bg-base-200/70 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-base-100 flex items-center justify-center flex-shrink-0 shadow-sm">
          {fileIconFor(doc.type_doc)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-base-content truncate">{doc.nom_doc}</p>
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-base-content/50 mt-0.5">
            <span className="badge badge-ghost badge-xs">{doc.type_doc}</span>
            <span>{formatSize(doc.taille_fichier)}</span>
            {doc.date_reception && <span>· {formatDateLong(doc.date_reception)}</span>}
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center gap-1">
          <button className="btn btn-ghost btn-xs" title="Prévisualiser" onClick={download}>
            {ACTION_ICONS.eye}
          </button>
          <button className="btn btn-ghost btn-xs" title="Télécharger" onClick={download}>
            {ACTION_ICONS.download}
          </button>
          <button className="btn btn-ghost btn-xs text-error" title="Supprimer" onClick={remove} disabled={busy}>
            {ACTION_ICONS.trash}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-base-300/60">
        <DocStatusBadge statut={doc.statut_doc} />
        {doc.statut_doc !== "VALIDE" && (
          <button
            className="btn btn-xs btn-outline btn-success gap-1"
            onClick={() => changeStatus("VALIDE")}
            disabled={busy}
          >
            {ACTION_ICONS.check}
            Valider
          </button>
        )}
        {doc.statut_doc !== "REJETE" && (
          <button
            className="btn btn-xs btn-outline btn-error gap-1"
            onClick={() => changeStatus("REJETE")}
            disabled={busy}
          >
            {ACTION_ICONS.x}
            Rejeter
          </button>
        )}
      </div>
    </div>
  );
}

export default function DossierDrawer({ stagiaire, onClose, onChanged }) {
  const [activeStageId, setActiveStageId] = useState(
    stagiaire?.stages?.[0]?.stage_id || null
  );
  const [showAdd, setShowAdd] = useState(false);

  if (!stagiaire) return null;

  const user = stagiaire.utilisateur || {};
  const stages = stagiaire.stages || [];
  const activeStage =
    stages.find((s) => s.stage_id === activeStageId) || stages[0] || null;
  const docs = activeStage?.documents || [];

  const handleUploaded = () => {
    setShowAdd(false);
    onChanged && onChanged();
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-base-content/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-xl bg-base-100 shadow-2xl border-l border-base-300 flex flex-col">
        {/* Drawer header */}
        <div className="p-6 border-b border-base-300 bg-base-200/40">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold shadow-md flex-shrink-0">
                {(user.prenom || "?")[0]}
                {(user.nom || "?")[0]}
              </div>
              <div>
                <h2 className="text-lg font-bold text-base-content">
                  Dossier de {user.prenom} {user.nom}
                </h2>
                <p className="text-xs text-base-content/50 mt-0.5">{user.email}</p>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm btn-square" onClick={onClose}>
              {ACTION_ICONS.close}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            <DrawerInfo label="Matricule" value={stagiaire.matricule || "—"} />
            <DrawerInfo label="Filière" value={stagiaire.filiere || "—"} />
            <DrawerInfo
              label="Encadreur"
              value={
                activeStage?.encadreur
                  ? `${activeStage.encadreur.prenom} ${activeStage.encadreur.nom}`
                  : "—"
              }
            />
            <DrawerInfo
              label="Période"
              value={
                activeStage
                  ? `${formatDateLong(activeStage.date_debut)} → ${formatDateLong(activeStage.date_fin)}`
                  : "—"
              }
            />
          </div>
        </div>

        {/* Stage selector */}
        {stages.length > 1 && (
          <div className="px-6 pt-4">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {stages.map((s) => (
                <button
                  key={s.stage_id}
                  className={`btn btn-xs ${s.stage_id === activeStage?.stage_id ? "btn-primary text-white" : "btn-ghost"}`}
                  onClick={() => setActiveStageId(s.stage_id)}
                >
                  {s.type_stage}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Toolbar + Documents list */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-info/10 flex items-center justify-center text-info">
                {ACTION_ICONS.folder}
              </div>
              <h3 className="text-sm font-bold text-base-content">
                Documents ({docs.length})
              </h3>
            </div>
            <button
              className="btn btn-primary btn-sm gap-2 text-white"
              onClick={() => setShowAdd(true)}
              disabled={!activeStage}
            >
              {ACTION_ICONS.upload}
              Ajouter
            </button>
          </div>

          {docs.length === 0 ? (
            <div className="text-center py-14 text-base-content/40">
              <p className="text-sm">Aucun document déposé pour ce stage.</p>
              <p className="text-xs mt-1">Utilisez « Ajouter » pour déposer un fichier.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {docs.map((doc) => (
                <DocumentRow
                  key={doc.document_id}
                  doc={doc}
                  stageId={activeStage?.stage_id}
                  onChanged={onChanged}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AddDocumentModal
        open={showAdd}
        stage={activeStage}
        onClose={() => setShowAdd(false)}
        onUploaded={handleUploaded}
      />
    </>
  );
}

function DrawerInfo({ label, value }) {
  return (
    <div className="p-2.5 rounded-lg bg-base-100 border border-base-300">
      <p className="text-[10px] text-base-content/40 font-medium uppercase tracking-wider">
        {label}
      </p>
      <p className="text-xs font-semibold text-base-content mt-0.5 truncate">{value}</p>
    </div>
  );
}
