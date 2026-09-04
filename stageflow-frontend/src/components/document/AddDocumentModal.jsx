import { useState, useRef } from "react";
import { api } from "../../api.js";
import {
  ACTION_ICONS,
  DOC_TYPE_OPTIONS,
  DOC_STATUS_OPTIONS,
  fileIconFor,
} from "../icons.jsx";

const ACCEPTED_EXT = [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg", ".xls", ".xlsx"];
const MAX_SIZE = 10 * 1024 * 1024;

export default function AddDocumentModal({ open, stage, onClose, onUploaded }) {
  const [typeDoc, setTypeDoc] = useState(DOC_TYPE_OPTIONS[0]);
  const [status, setStatus] = useState("EN_ATTENTE");
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  if (!open) return null;

  const validateFile = (f) => {
    if (!f) return true;
    const ext = (f.name.split(".").pop() || "").toLowerCase();
    if (!ACCEPTED_EXT.includes(`.${ext}`)) {
      setError("Format non autorisé. Utilisez un PDF, DOCX ou une image.");
      return false;
    }
    if (f.size > MAX_SIZE) {
      setError("Le fichier dépasse la taille maximale de 10 Mo.");
      return false;
    }
    setError(null);
    return true;
  };

  const onFileSelect = (f) => {
    if (validateFile(f)) setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) onFileSelect(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Veuillez sélectionner un fichier.");
      return;
    }
    if (!stage) {
      setError("Aucun stage sélectionné.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await api.uploadDocument({
        stage_id: stage.stage_id,
        type_doc: typeDoc,
        nom_doc: `${typeDoc} - ${file.name}`,
        statut_doc: status,
        file,
      });
      setFile(null);
      setStatus("EN_ATTENTE");
      setTypeDoc(DOC_TYPE_OPTIONS[0]);
      onUploaded();
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Échec de l'upload");
    } finally {
      setLoading(false);
    }
  };

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
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                {ACTION_ICONS.upload}
              </div>
              <div>
                <h2 className="text-lg font-bold text-base-content">Ajouter un document</h2>
                <p className="text-xs text-base-content/50">
                  {stage ? `Stage : ${stage.theme || stage.type_stage}` : ""}
                </p>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm btn-square" onClick={onClose}>
              {ACTION_ICONS.close}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-xs font-medium">Type de document</span>
              </label>
              <select
                className="select select-bordered select-sm"
                value={typeDoc}
                onChange={(e) => setTypeDoc(e.target.value)}
              >
                {DOC_TYPE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-xs font-medium">Statut initial</span>
              </label>
              <select
                className="select select-bordered select-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {DOC_STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Drag & drop zone */}
            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
                dragOver ? "border-primary bg-primary/5" : "border-base-300 hover:border-primary/40"
              }`}
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <span>{fileIconFor(file.name)}</span>
                  <div className="min-w-0 text-left">
                    <p className="text-sm font-semibold text-base-content truncate">{file.name}</p>
                    <p className="text-xs text-base-content/40">{(file.size / 1024).toFixed(1)} Ko</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                  >
                    {ACTION_ICONS.trash}
                  </button>
                </div>
              ) : (
                <>
                  <div className="mx-auto w-12 h-12 rounded-xl bg-base-200 flex items-center justify-center text-base-content/40 mb-2">
                    {ACTION_ICONS.upload}
                  </div>
                  <p className="text-sm font-medium text-base-content/70">
                    Glissez-déposez votre fichier ici
                  </p>
                  <p className="text-xs text-base-content/40 mt-1">
                    ou cliquez pour parcourir · PDF, DOCX, images (max 10 Mo)
                  </p>
                </>
              )}
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept={ACCEPTED_EXT.join(",")}
                onChange={(e) => onFileSelect(e.target.files?.[0])}
              />
            </div>

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
                  ACTION_ICONS.upload
                )}
                Déposer le document
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
