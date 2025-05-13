const BASE = "http://localhost:4000/api";
export const docService = {
  open: (id: string) => fetch(`${BASE}/doc/open/${id}`).then((r) => r.json()),
  save: (id: string, contenido: string) =>
    fetch(`${BASE}/doc/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ docId: id, contenido }),
    }).then((r) => r.json()),
  export: (fmt: "txt" | "pdf", id: string) =>
    window.open(`${BASE}/doc/export/${fmt}/${id}`, "_blank"),
};
