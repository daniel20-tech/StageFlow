import { useState, useEffect } from "react";

/**
 * Generic, reusable view handling list + create (+ optional status transitions)
 * for a single StageFlow resource. Avoids repeating the same table/form logic
 * for every entity (separation of concerns, no duplicated nested loops).
 */
export default function ResourceView({
  idField,
  columns,
  formFields,
  listFn,
  paramConfig,
  createFn,
  statusConfig,
}) {
  const [items, setItems] = useState([]);
  const [param, setParam] = useState("");
  const [form, setForm] = useState(() =>
    Object.fromEntries(formFields.map((field) => [field.name, ""]))
  );
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      const data = paramConfig ? await paramConfig.listFn(param) : await listFn();
      setItems(data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    }
  };

  useEffect(() => {
    if (!paramConfig) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (event) =>
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const onSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      const payload = {};
      for (const field of formFields) {
        if (form[field.name] !== "") payload[field.name] = form[field.name];
      }
      await createFn(payload);
      setForm(Object.fromEntries(formFields.map((field) => [field.name, ""])));
      await load();
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    }
  };

  const onStatus = async (id, value) => {
    try {
      let comment;
      if (statusConfig?.requiresCommentOn?.includes(value)) {
        comment = window.prompt("Commentaire de décision :");
        if (comment === null) return;
      }
      await statusConfig.updateFn(id, value, comment);
      await load();
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    }
  };

  return (
    <section>
      {error && <div className="error">{error}</div>}

      {paramConfig && (
        <div className="param-bar">
          <label>
            {paramConfig.label}
            <input
              value={param}
              onChange={(event) => setParam(event.target.value)}
              placeholder={paramConfig.placeholder}
            />
          </label>
          <button className="primary" type="button" onClick={load}>
            Charger
          </button>
        </div>
      )}

      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
            {statusConfig && <th>Statut</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item[idField]}>
              {columns.map((column) => (
                <td key={column.key}>{String(item[column.key] ?? "")}</td>
              ))}
              {statusConfig && (
                <td>
                  <select
                    value={item[statusConfig.field] ?? ""}
                    onChange={(event) => onStatus(item[idField], event.target.value)}
                  >
                    {statusConfig.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={onSubmit}>
        {formFields.map((field) => (
          <label key={field.name}>
            {field.label}
            {field.type === "select" ? (
              <select name={field.name} value={form[field.name]} onChange={onChange}>
                <option value="">--</option>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                name={field.name}
                type={field.type || "text"}
                value={form[field.name]}
                onChange={onChange}
              />
            )}
          </label>
        ))}
        <button className="primary" type="submit">
          Créer
        </button>
      </form>
    </section>
  );
}
