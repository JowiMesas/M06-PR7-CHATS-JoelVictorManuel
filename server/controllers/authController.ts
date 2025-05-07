import { request, response } from "express";
import db from "../data/data.json";

export default (req: request, res: response) => {
  const { email, username } = req.body as { email: string; username: string };

  const user = db.usuarios.find(
    (u) => u.email === email && u.username === username
  );

  if (!user) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  // Podrías generar un token aquí si lo necesitas
  res.json({ user, token: user.id }); // como ejemplo, usar ID como token
};
