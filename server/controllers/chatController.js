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
