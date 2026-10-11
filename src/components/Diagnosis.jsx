import { useSelector } from "react-redux";
import { selectCatalog } from "../store/catalogSlice";
import { normalize, normalizePriority } from "../utils";

const LEGEND = [
  ["priority-high", "Alta"],
  ["priority-medium", "Media"],
  ["priority-low", "Baja"],
  ["priority-none", "Sin oportunidad"],
];

function Legend() {
  return (
    <div className="diagnosis-legend">
      <span className="diagnosis-legend__title">Prioridad:</span>
      {LEGEND.map(([cls, label]) => (
        <div className="diagnosis-legend__item" key={cls}>
          <span className={`diagnosis-legend__color ${cls}`} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function deriveAxis(diagnostico, idKey, altKey, nameKey) {
  const seen = new Map();
  for (const item of diagnostico) {
    const id = item?.[idKey] || item?.[altKey];
    if (id && !seen.has(id)) {
      seen.set(id, { id, nombre: item?.[nameKey] || id });
    }
  }
  return [...seen.values()];
}

function Matrix({ diagnostico }) {
  const catalog = useSelector(selectCatalog);

  const map = new Map();
  for (const item of diagnostico) {
    const areaId = item?.area_id || item?.area;
    const capaId = item?.capa_id || item?.capa;
    if (areaId && capaId) map.set(`${normalize(areaId)}.${normalize(capaId)}`, item);
  }

  const areas = catalog.areas.length
    ? catalog.areas
    : deriveAxis(diagnostico, "area_id", "area", "area_nombre");
  const capas = catalog.capas.length
    ? catalog.capas
    : deriveAxis(diagnostico, "capa_id", "capa", "capa_nombre");

  return (
    <div className="diagnosis-matrix-wrapper">
      <table className="diagnosis-matrix">
        <thead>
          <tr>
            <th className="diagnosis-matrix__corner">Capa \ Área</th>
            {areas.map((a) => (
              <th key={a.id} className="diagnosis-matrix__area">{a.nombre}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {capas.map((capa) => (
            <tr key={capa.id}>
              <th className="diagnosis-matrix__layer">{capa.nombre}</th>
              {areas.map((area) => {
                const item = map.get(`${normalize(area.id)}.${normalize(capa.id)}`);
                if (!item) {
                  return <td key={area.id} className="diagnosis-matrix__cell priority-none">—</td>;
                }
                const solutions = Array.isArray(item.soluciones) ? item.soluciones : [];
                return (
                  <td
                    key={area.id}
                    className={`diagnosis-matrix__cell priority-${normalizePriority(item.prioridad)}`}
                  >
                    {solutions.length === 0 ? (
                      <div className="diagnosis-matrix__opportunity">Oportunidad a validar</div>
                    ) : (
                      solutions.map((s, i) => (
                        <div key={s.id ?? i} className="diagnosis-matrix__solution">
                          {s.nombre || s.id || ""}
                        </div>
                      ))
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Field({ title, titleClass, textClass, children }) {
  if (!children) return null;
  return (
    <>
      <strong className={titleClass}>{title}</strong>
      <p className={textClass}>{children}</p>
    </>
  );
}

function Solution({ s }) {
  return (
    <div className="diagnosis-solution">
      <h6 className="diagnosis-solution__name">{s.nombre || s.id || ""}</h6>
      {s.categoria && <div className="diagnosis-solution__category">{s.categoria}</div>}
      <Field title="Descripción">{s.descripcion}</Field>
      <Field title="Necesidad que atiende">{s.necesidad_que_atiende}</Field>
      <Field
        title="Por qué aplica a esta empresa"
        titleClass="diagnosis-solution__why-title"
        textClass="diagnosis-solution__why"
      >
        {s.por_que_aplica}
      </Field>
      {Array.isArray(s.que_validar) && s.que_validar.length > 0 && (
        <>
          <strong>Qué validar</strong>
          <ul className="diagnosis-solution__validation">
            {s.que_validar.map((q, i) => <li key={i}>{q}</li>)}
          </ul>
        </>
      )}
      {s.url && (
        <a className="diagnosis-solution__link" href={s.url} target="_blank" rel="noopener noreferrer">
          Ver solución
        </a>
      )}
    </div>
  );
}

function Details({ diagnostico }) {
  return (
    <section className="diagnosis-details">
      <h3 className="diagnosis-details__title">Detalle de oportunidades y soluciones</h3>

      {diagnostico.length === 0 && (
        <p className="diagnosis-details__empty">
          No se identificaron oportunidades suficientes para mostrar soluciones.
        </p>
      )}

      {diagnostico.map((item, i) => {
        const solutions = Array.isArray(item.soluciones) ? item.soluciones : [];
        return (
          <article className="diagnosis-detail" key={i}>
            <h4 className="diagnosis-detail__title">
              {`${item.area_nombre || item.area || ""} / ${item.capa_nombre || item.capa || ""}`}
            </h4>
            {item.prioridad && (
              <div className={`diagnosis-detail__priority priority-${normalizePriority(item.prioridad)}`}>
                Prioridad: {item.prioridad}
              </div>
            )}
            <Field title="Motivo">{item.motivo}</Field>
            <Field title="Contexto identificado">{item.evidencia}</Field>

            {solutions.length > 0 && (
              <>
                <h5 className="diagnosis-detail__solutions-title">Soluciones</h5>
                {solutions.map((s, j) => <Solution key={s.id ?? j} s={s} />)}
              </>
            )}
          </article>
        );
      })}
    </section>
  );
}

export default function Diagnosis({ data }) {
  const diagnostico = Array.isArray(data.diagnostico) ? data.diagnostico : [];

  return (
    <div className="diagnosis">
      <h2 className="diagnosis__title">Diagnóstico de oportunidades</h2>

      {data.conclusion?.resumen && (
        <p className="diagnosis__summary">{data.conclusion.resumen}</p>
      )}

      <h3 className="diagnosis__section-title">Mapa de oportunidades</h3>
      <Legend />
      <Matrix diagnostico={diagnostico} />
      <Details diagnostico={diagnostico} />

      {data.conclusion?.siguiente_paso && (
        <section className="diagnosis-next-step">
          <h3>Siguiente paso</h3>
          <p>{data.conclusion.siguiente_paso}</p>
        </section>
      )}
    </div>
  );
}