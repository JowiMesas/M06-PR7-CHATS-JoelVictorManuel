/**
 * Controlador de autenticación que verifica las credenciales de usuario
 * 
 * @file AuthController.js
 * @description Maneja el proceso de inicio de sesión validando las credenciales contra la base de datos
 */

// Importa los datos de usuarios desde un archivo JSON estático
const db = require("../data/data.json");

/**
 * Middleware para manejar solicitudes de autenticación
 * 
 * @param {Object} req - Objeto de solicitud HTTP Express
 * @param {Object} res - Objeto de respuesta HTTP Express
 * @returns {Object} Respuesta JSON con datos del usuario y token o mensaje de error
 */
module.exports = (req, res) => {
  // Extrae el email y username del cuerpo de la solicitud
  const { email, username } = req.body;

  // Busca un usuario en el json que coincida con ambos criterios
  const user = db.usuarios.find(
    (u) => u.email === email && u.username === username
  );

  // Si no se encuentra un usuario con esas credenciales, devuelve error 401 (No autorizado)
  if (!user) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  // Autenticación exitosa: devuelve los datos del usuario y un token
  res.json({ user, token: user.id }); // Se usa el ID como token (solo para ejemplo)
};