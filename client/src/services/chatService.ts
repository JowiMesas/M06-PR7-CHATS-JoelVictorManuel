const BASE = "http://localhost:4000/api";
export const chatService = {
  /**
   * Obtiene el historial de mensajes del chat
   * @returns El método devuelve una Promise que, cuando se resuelve, contiene los datos del historial de chat
   */
  getHistory: () => fetch(`${BASE}/chat/view_hist`).then((res) => res.json()),
  /**
   * Envía u nuevo mensaje al chat
   * @param emisorId - El identificador único del usuario que envía el mensaje
   * @param contenido - El texto del mensaje a enviar
   * @returns El método devuelve una Promise que, cuando se resuelve, contiene la respuesta del servidor
   */
  sendMessage: (emisorId: string, contenido: string) =>
    fetch(`${BASE}/chat/send_message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emisorId, contenido }),
    }).then((res) => res.json()),
  /**
   * Exporta la conversación del chat en el formato especificado
   * @param format - El formato de exportación ("json" o "txt")
   * @description Abre una nueva ventana del navegador para descargar el chat exportado
   */
  exportChat: (format: "json" | "txt") => {
    window.open(`${BASE}/chat/export/${format}`, "_blank");
  },
};
