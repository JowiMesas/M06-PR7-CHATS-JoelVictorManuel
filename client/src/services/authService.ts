const BASE = "http://localhost:4000/api";

export const authService = {
    /**
   * Inicia sesión en la aplicación
   * @param username - Nombre de usuario para el inicio de sesión
   * @param email - Correo electrónico del usuario
   * @returns Devuelve una Promise que, cuando se resuelve, contiene los datos del usuario autenticado
   * @throws Error si la autenticación falla
   */
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

};

