const express   = require('express');
const http      = require('http');
const WebSocket = require('ws');
const cors      = require('cors');
const fs        = require('fs');
const path      = require('path');

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const docRoutes  = require('./routes/documentRoutes');

const app  = express();
const port = 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas REST
app.use('/api/login', authRoutes);
app.use('/api/chat',  chatRoutes);
app.use('/api/doc',   docRoutes);

// Helpers base de datos
const dbFile = path.join(__dirname, 'data/data.json');
function readDB()  { return JSON.parse(fs.readFileSync(dbFile, 'utf-8')); }
function writeDB(db){ fs.writeFileSync(dbFile, JSON.stringify(db, null, 2), 'utf-8'); }

// Servidor HTTP
const server = http.createServer(app);

// Un único WebSocket Server para chat y documento
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  console.log('WebSocket conectado');

  ws.on('message', data => {
    let msg;
    try {
      msg = JSON.parse(data);
    } catch {
      return;
    }

    // Mensaje de chat
    if (msg.type === 'chat') {
      const db = readDB();
      const u  = db.usuarios.find(u => u.id === msg.emisorId);
      const newMsg = {
        id:        `m${db.mensajes.length + 1}`,
        salaId:    's1',
        emisorId:  msg.emisorId,
        username:  u ? u.username : msg.emisorId,
        contenido: msg.contenido,
        timestamp: new Date().toISOString(),
      };
      db.mensajes.push(newMsg);
      writeDB(db);

      // Reenviar a todos
      const payload = JSON.stringify({ type: 'chat', ...newMsg });
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(payload);
        }
      });
      return;
    }

    // Mensaje de documento (sync o autosave)
    if (msg.type === 'sync' || msg.type === 'autosave') {
      const db  = readDB();
      const doc = db.documentos.find(d => d.id === msg.docId);
      if (!doc) return;

      if (msg.type === 'autosave') {
        doc.contenido    = msg.contenido;
        doc.lastModified = new Date().toISOString();
        writeDB(db);
      }

      // Reenviar a todos los demás clientes
      const payload = JSON.stringify(msg);
      wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(payload);
        }
      });
    }
  });

  ws.on('close', () => console.log('WebSocket desconectado'));
});

// Iniciar servidor
server.listen(port, () => console.log(`Servidor escuchando en http://localhost:${port}`));
