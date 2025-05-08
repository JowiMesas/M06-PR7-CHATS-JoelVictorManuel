const BASE = "http://localhost:4000/api";
export const chatService = {
  getHistory: () => fetch(`${BASE}/chat/view_hist`).then((res) => res.json()),
  sendMessage: (emisorId: string, contenido: string) =>
    fetch(`${BASE}/chat/send_message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emisorId, contenido }),
    }).then((res) => res.json()),
};
