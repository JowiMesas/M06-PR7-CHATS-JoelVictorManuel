const BASE = 'http://localhost:4000/api';
export const chatService = {
  getHistory: async (roomId: string) =>
    (await fetch(`${BASE}/chat/${roomId}/history`)).json(),
  sendMessage: async (msg: any) =>
    fetch(`${BASE}/chat/${msg.salaId}/send`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(msg)
    }),
};