const db = require("../data/data.json");

module.exports = (req, res) => {
  const { email, username } = req.body;

  const user = db.usuarios.find(
    (u) => u.email === email && u.username === username
  );

  if (!user) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  // Podrías generar un token aquí si lo necesitas
  res.json({ user, token: user.id }); // como ejemplo, usar ID como token
};