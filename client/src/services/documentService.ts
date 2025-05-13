const BASE = "http://localhost:4000/api";
export const docService = {
  open: (id: string) => fetch(`${BASE}/doc/open/${id}`).then((r) => r.json()),
  list: () => fetch(`${BASE}/doc`).then((r) => r.json()),
  create: (titulo: string) =>
    fetch(`${BASE}/doc`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo }),
    }),
   export: (fmt: "txt" | "pdf", id: string) =>
    window.open(`${BASE}/doc/export/${fmt}/${id}`, "_blank"),
};
