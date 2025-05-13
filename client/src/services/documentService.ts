const BASE = "http://localhost:4000/api";
export const docService = {
  open: (id: string) => fetch(`${BASE}/doc/open/${id}`).then((r) => r.json()),

  export: (fmt: "txt" | "pdf", id: string) =>
    window.open(`${BASE}/doc/export/${fmt}/${id}`, "_blank"),
};
