const fs = require("fs");
const path = require("path");
const dbFile = path.join(__dirname, "../data/data.json");
function readDB() {
  return JSON.parse(fs.readFileSync(dbFile));
}
function writeDB(db) {
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
}

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

exports.sendMessage = (req, res) => {
  const { emisorId, contenido } = req.body;
  const db = readDB();
  const msg = {
    id: `m${db.mensajes.length + 1}`,
    salaId: "s1",
    emisorId,
    contenido,
    username,
    timestamp: new Date().toISOString(),
  };
  db.mensajes.push(msg);
  writeDB(db);
  res.json(msg);
};
exports.exportChat = (req, res) => {
  const format = req.params.format;
  const db = readDB();
  const msgs = db.mensajes
    .filter((m) => m.salaId === "s1")
    .map((m) => {
      const u = db.usuarios.find((u) => u.id === m.emisorId);
      return { ...m, username: u ? u.username : m.emisorId };
    });

  if (format === "json") {
    res.setHeader("Content-Disposition", "attachment; filename=chat.json");
    res.type("application/json");
    return res.send(JSON.stringify(msgs, null, 2));
  }

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
      textOutput += `=== ${day} ===
`;
      for (const m of groups[day]) {
        const time = new Date(m.timestamp).toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        });
        textOutput += `[${time}] ${m.username}: ${m.contenido}
`;
      }
      textOutput += "";
    }

    res.setHeader("Content-Disposition", "attachment; filename=chat.txt");
    res.type("text/plain");
    return res.send(textOutput);
  }

  res.status(400).send("Formato no soportado");
};
