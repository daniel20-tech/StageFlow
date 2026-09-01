import { useState } from "react";
import { api } from "../api.js";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await api.login(email, motDePasse);
      onLogin(data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Échec de la connexion"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200/30 px-4">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-base-200 flex items-center justify-center shadow-md">
              <img
                src="/images/stageflow-logo.png"
                alt="StageFlow Logo"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-base-content tracking-tight">
                StageFlow
              </h1>
              <p className="text-xs text-base-content/60">
                Gestion des stages
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="prenom.nom@exemple.com"
              />
            </div>

            <div className="form-control mt-3">
              <label className="label">
                <span className="label-text">Mot de passe</span>
              </label>
              <input
                type="password"
                className="input input-bordered"
                required
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="alert alert-error mt-4 py-2 text-sm">
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full mt-5"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}