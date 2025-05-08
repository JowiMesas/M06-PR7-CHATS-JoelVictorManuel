const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

// Rutas REST
app.use("/api/login", authRoutes);
app.use("/api/chat", chatRoutes);

// Helpers de DB
const dbFile = path.join(__dirname, "data/data.json");
function readDB() {
  return JSON.parse(fs.readFileSync(dbFile, "utf-8"));
}
function writeDB(db) {
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2), "utf-8");
}

// Servidor HTTP + WebSocket
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("WS connected");
  ws.on("message", (data) => {
    
    // Persistir y enriquecer mensaje
    let newMsg;
    try {
      const msg = JSON.parse(data);
      const db = readDB();
      newMsg = {
        id: `m${db.mensajes.length + 1}`,
        salaId: "s1",
        emisorId: msg.emisorId,
        username: (() => {
          const u = db.usuarios.find((u) => u.id === msg.emisorId);
          return u ? u.username : msg.emisorId;
        })(),
        contenido: msg.contenido,
        timestamp: new Date().toISOString(),
      };
      db.mensajes.push(newMsg);
      writeDB(db);
    } catch (e) {
      console.error("Error al guardar mensaje:", e);
      return;
    }
    // Broadcast único
    const payload = JSON.stringify(newMsg);
    wss.clients.forEach((c) => {
      if (c.readyState === WebSocket.OPEN) {
        c.send(payload);
      }
    });
  });
  ws.on("close", () => console.log("WS disconnected"));
});

server.listen(port, () =>
  console.log(`Escuchando al servidor  http://localhost:${port}`)
);
