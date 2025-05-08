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
  res.json(db.mensajes.filter((m) => m.salaId === "s1"));
};

exports.sendMessage = (req, res) => {
  const { emisorId, contenido } = req.body;
  const db = readDB();
  const newMsg = {
    id: `m${db.mensajes.length + 1}`,
    salaId: "s1",
    emisorId,
    contenido,
    timestamp: new Date().toISOString(),
  };
  db.mensajes.push(newMsg);
  writeDB(db);
  res.json(newMsg);
};
