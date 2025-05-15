const BASE = "http://localhost:4000/api";

// Exporta un objeto con métodos para interactuar con el servicio de documentos
export const docService = {
   /**
   * Abre un documento específico por su ID
   * @param id - El identificador único del documento
   * @returns Devuelve una Promise que, cuando se resuelve, contiene el documento solicitado con sus datos
   */
  open: (id: string) => fetch(`${BASE}/doc/open/${id}`).then((r) => r.json()),
    /**
   * Obtiene la lista de todos los documentos disponibles
   * @returns Devuelve una Promise que, cuando se resuelve, contiene un array con la lista de documentos
   */
  list: () => fetch(`${BASE}/doc`).then((r) => r.json()),
   /**
   * Crea un nuevo documento con el título especificado
   * @param titulo - El título del nuevo documento
   * @returns Devuelve una Promise que representa la petición de creación
   */
  create: (titulo: string) =>
    fetch(`${BASE}/doc`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo }),
    }),
 /**
   * Exporta un documento en el formato especificado
   * @param fmt - El formato de exportación ("txt" o "pdf")
   * @param id - El identificador único del documento a exportar
   * @description Abre una nueva ventana del navegador para descargar el documento exportado
   */
  export: (fmt: "txt" | "pdf", id: string) =>
    window.open(`${BASE}/doc/export/${fmt}/${id}`, "_blank"),
};
