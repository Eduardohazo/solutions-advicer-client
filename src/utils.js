export function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_");
}

export function normalizePriority(value) {
  const p = normalize(value);
  if (["alta", "high", "critica"].includes(p)) return "high";
  if (["media", "medium"].includes(p)) return "medium";
  if (["baja", "low"].includes(p)) return "low";
  return "none";
}

export function advisorText(data) {
  switch (data?.estado) {
    case "inicio":
      return data.pregunta || "Dame un resumen de la empresa y de cómo opera.";
    case "objecion": {
      const parts = [];
      if (data.respuesta_sugerida) parts.push(`Puedes responder:\n${data.respuesta_sugerida}`);
      if (data.siguiente_pregunta) parts.push(`Después pregunta:\n${data.siguiente_pregunta}`);
      return parts.join("\n\n") || "Continúa con la información disponible de la empresa.";
    }
    case "descubrimiento":
      return data.pregunta || "¿Puedes contarme un poco más sobre cómo opera actualmente la empresa?";
    default:
      return (
        data?.pregunta || data?.mensaje || data?.respuesta ||
        "¿Puedes proporcionar un poco más de información?"
      );
  }
}