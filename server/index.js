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

app.use(cors());
app.use(express.json());

app.use('/api/login', authRoutes);
app.use('/api/chat',  chatRoutes);
app.use('/api/doc',   docRoutes);

const dbFile = path.join(__dirname, 'data/data.json');
const readDB  = () => JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
const writeDB = db => fs.writeFileSync(dbFile, JSON.stringify(db, null, 2), 'utf-8');

const server = http.createServer(app);
const wss    = new WebSocket.Server({ server });

wss.on('connection', ws => {
  console.log('WebSocket conectado');

  ws.on('message', data => {
    let msg;
    try { msg = JSON.parse(data); } catch { return; }

    // Chat
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
      const payload = JSON.stringify({ type: 'chat', ...newMsg });
      wss.clients.forEach(c => {
        if (c.readyState === WebSocket.OPEN) c.send(payload);
      });
      return;
    }

    // Documentos: sync, autosave, create-doc
    if (['sync', 'autosave', 'create-doc'].includes(msg.type)) {
      const db = readDB();

      if (msg.type === 'create-doc') {
        const newDoc = {
          id: `d${Date.now()}`,
          titulo: msg.titulo,
          contenido: '',
          lastModified: new Date().toISOString()
        };
        db.documentos.push(newDoc);
        writeDB(db);
        ws.send(JSON.stringify({ type:'doc-created', doc: newDoc }));
        return;
      }

      const doc = db.documentos.find(d => d.id === msg.docId);
      if (!doc) return;
      if (msg.type === 'autosave') {
        doc.contenido = msg.contenido;
        doc.lastModified = new Date().toISOString();
        writeDB(db);
      }
      const pl = JSON.stringify(msg);
      wss.clients.forEach(c => {
        if (c !== ws && c.readyState === WebSocket.OPEN) c.send(pl);
      });
    }
  });

  ws.on('close', () => console.log('WebSocket desconectado'));
});

server.listen(port, () => console.log(`Servidor escuchando en http://localhost:${port}`));