/**
 * Controlador para gestionar las operaciones del chat
 * 
 * @file ChatController.js
 * @description Maneja las operaciones relacionadas con el chat: visualizar historial, enviar mensajes y exportar conversaciones
 */

const fs = require("fs");
const path = require("path");
const dbFile = path.join(__dirname, "../data/data.json");

/**
 * Lee la base de datos desde el archivo JSON
 * @returns {Object} Objeto con los datos de la base de datos
 */
function readDB() {
  return JSON.parse(fs.readFileSync(dbFile));
}

/**
 * Escribe en la base de datos JSON
 * @param {Object} db - Objeto con los datos a guardar
 */
function writeDB(db) {
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
}

/**
 * Obtiene el historial de mensajes de chat
 * 
 * @param {Object} req - Objeto de solicitud HTTP Express
 * @param {Object} res - Objeto de respuesta HTTP Express
 * @returns {Object} Respuesta JSON con el historial de mensajes enriquecido con nombres de usuario
 */
exports.viewHistory = (req, res) => {
  const db = readDB();
  // Enriquecer cada mensaje histórico con username
  const enriched = db.mensajes
    .filter((m) => m.salaId === "s1")
    .map((m) => {
      const user = db.usuarios.find((u) => u.id === m.emisorId);
      return {
        ...m,
        username: user ? user.username : m.emisorId,
      };
    });
  res.json(enriched);
};

/**
 * Guarda un nuevo mensaje en el json
 * 
 * @param {Object} req - Objeto de solicitud HTTP Express
 * @param {Object} res - Objeto de respuesta HTTP Express
 * @returns {Object} Respuesta JSON con los datos del mensaje creado
 */
exports.sendMessage = (req, res) => {
  const { emisorId, contenido } = req.body;
  const db = readDB();
 
  const msg = {
    id: `m${db.mensajes.length + 1}`,
    salaId: "s1",
    emisorId,
    contenido,
    username, // Este valor no está definido correctamente en el código original
    timestamp: new Date().toISOString(),
  };
  db.mensajes.push(msg);
  writeDB(db);
  res.json(msg);
};

/**
 * Exporta la conversación de chat en diferentes formatos
 * 
 * @param {Object} req - Objeto de solicitud HTTP Express
 * @param {Object} res - Objeto de respuesta HTTP Express
 * @returns {Object} Archivo de chat en el formato solicitado (JSON o TXT)
 */
exports.exportChat = (req, res) => {
  const format = req.params.format;
  const db = readDB();
  
  // Obtener todos los mensajes de la sala 's1' y enriquecerlos con los nombres de usuario
  const msgs = db.mensajes
    .filter((m) => m.salaId === "s1")
    .map((m) => {
      const u = db.usuarios.find((u) => u.id === m.emisorId);
      return { ...m, username: u ? u.username : m.emisorId };
    });

  // Exportar en formato JSON
  if (format === "json") {
    res.setHeader("Content-Disposition", "attachment; filename=chat.json");
    res.type("application/json");
    return res.send(JSON.stringify(msgs, null, 2));
  }

  // Exportar en formato TXT (agrupado por días)
  if (format === "txt") {
    // Agrupar mensajes por día
    const groups = msgs.reduce((acc, m) => {
      const date = new Date(m.timestamp);
      const dayKey = date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!acc[dayKey]) acc[dayKey] = [];
      acc[dayKey].push(m);
      return acc;
    }, {});

    let textOutput = "";
    for (const day of Object.keys(groups)) {
      textOutput += `=== ${day} ===\n`;
      for (const m of groups[day]) {
        const time = new Date(m.timestamp).toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        });
        textOutput += `[${time}] ${m.username}: ${m.contenido}\n`;
      }
      textOutput += "\n";
    }

    res.setHeader("Content-Disposition", "attachment; filename=chat.txt");
    res.type("text/plain");
    return res.send(textOutput);
  }

  // Si el formato no es válido
  res.status(400).send("Formato no soportado");
};