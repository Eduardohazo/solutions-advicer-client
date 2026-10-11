const API_URL = import.meta.env.VITE_API_URL;

async function post(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("El servidor devolvió una respuesta inválida.");
  }
  if (!res.ok) throw new Error(data?.error || "Error al comunicarse con el servidor.");
  return data;
}

export const sendChat = (userId, prompt) => post("/api/chat", { userId, prompt });
export const resetChat = (userId) => post("/api/reset", { userId }).catch(console.error);

export async function fetchCatalog() {
  const res = await fetch(`${API_URL}/api/catalog`);
  if (!res.ok) throw new Error("No se pudo cargar el catálogo.");
  const data = await res.json();
  return {
    areas: Array.isArray(data.areas) ? data.areas : [],
    capas: Array.isArray(data.capas) ? data.capas : [],
  };
}