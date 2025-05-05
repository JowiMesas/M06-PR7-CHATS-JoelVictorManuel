const BASE ='http://localhost:4000/api';

export const authService = {
  login: async (username: string, email: string) =>
    fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email })
    }).then(res => res.json()),

  getRooms: async () =>
    fetch(`${BASE}/auth/salas`).then(res => res.json()),
};