const BASE = "http://localhost:4000/api";

export const authService = {
  login: async (username: string, email: string) => {
    const res = await fetch(`${BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email }),
    });

    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }

    return res.json();
  },

  getRooms: async () => fetch(`${BASE}/auth/salas`).then((res) => res.json()),
};

