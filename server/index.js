const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());
app.use('/api/login', authRoutes);
app.use('/api/chat', chatRoutes);

// Funciones para leer y escribir en data.json
const dbFile = path.resolve(__dirname, 'data/data.json');
function readDB() {
  return JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
}
function writeDB(db) {
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2), 'utf-8');
}

// Crear servidor HTTP
const server = http.createServer(app);
// Inicializar WebSocket en el mismo servidor
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  console.log('Cliente WebSocket conectado');

  ws.on('message', data => {
    // Reenviar a todos los clientes conectados
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });

    // Persistir mensaje en JSON
    try {
      const msg = JSON.parse(data);
      const db = readDB();
      const newMsg = {
        id: `m${db.mensajes.length + 1}`,
        salaId: 's1',
        emisorId: msg.emisorId,
        contenido: msg.contenido,
        timestamp: new Date().toISOString(),
      };
      db.mensajes.push(newMsg);
      writeDB(db);
    } catch (err) {
      console.error('Error al guardar mensaje:', err);
    }
  });

  ws.on('close', () => {
    console.log('Cliente WebSocket desconectado');
  });
});

// Iniciar servidor
server.listen(port, () => console.log(`Servidor escuchando en http://localhost:${port}`));