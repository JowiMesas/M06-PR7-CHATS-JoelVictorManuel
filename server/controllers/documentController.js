/**
 * Controlador para gestionar operaciones con documentos
 * 
 * @file DocumentController.js
 * @description Maneja las operaciones CRUD para documentos y su exportación
 */

const fs = require('fs');
const path = require('path');
const dbFile = path.join(__dirname, '../data/data.json');

/**
 * Lee la base de datos desde el archivo JSON
 * @returns {Object} Objeto con los datos de la base de datos
 */
function readDB() {
  return JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
}

/**
 * Escribe en la base de datos JSON
 * @param {Object} db - Objeto con los datos a guardar
 */
function writeDB(db) {
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2), 'utf-8');
}

/**
 * Abre un documento existente o crea uno nuevo si no existe
 * 
 * @param {Object} req - Objeto de solicitud HTTP Express
 * @param {Object} res - Objeto de respuesta HTTP Express
 * @returns {Object} Respuesta JSON con los datos del documento
 */
exports.openDocument = (req, res) => {
  const { docId } = req.params;
  const db = readDB();
  let doc = db.documentos.find(d => d.id === docId);
  
  // Si el documento no existe, crea uno nuevo
  if (!doc) {
    doc = {
      id: docId,
      salaId: 's1',
      titulo: `Documento ${docId}`,
      contenido: '',
      lastModified: new Date().toISOString()
    };
    db.documentos.push(doc);
    writeDB(db);
  }
  
  res.json(doc);
};

/**
 * Obtiene la lista de todos los documentos
 * 
 * @param {Object} req - Objeto de solicitud HTTP Express
 * @param {Object} res - Objeto de respuesta HTTP Express
 * @returns {Object} Respuesta JSON con la lista de documentos
 */
exports.listDocuments = (req, res) => {
  const db = readDB();
  res.json(db.documentos);
};

/**
 * Obtiene un documento específico por su ID
 * 
 * @param {Object} req - Objeto de solicitud HTTP Express
 * @param {Object} res - Objeto de respuesta HTTP Express
 * @returns {Object} Respuesta JSON con los datos del documento o error 404
 */
exports.getDocument = (req, res) => {
  const db = readDB();
  const doc = db.documentos.find(d => d.id === req.params.id);
  if (!doc) return res.status(404).json({ error: 'No existe' });
  res.json(doc);
};

/**
 * Crea un nuevo documento
 * 
 * @param {Object} req - Objeto de solicitud HTTP Express
 * @param {Object} res - Objeto de respuesta HTTP Express
 * @returns {Object} Respuesta JSON con los datos del nuevo documento
 */
exports.createDocument = (req, res) => {
  const { titulo } = req.body;
  const db = readDB();
  const newDoc = {
    id: `d${db.documentos.length + 1}`,
    titulo: titulo || `Documento ${db.documentos.length + 1}`,
    contenido: '',
    lastModified: new Date().toISOString(),
  };
  db.documentos.push(newDoc);
  writeDB(db);
  res.status(201).json(newDoc);
};

/**
 * Exporta un documento en diferentes formatos
 * 
 * @param {Object} req - Objeto de solicitud HTTP Express
 * @param {Object} res - Objeto de respuesta HTTP Express
 * @returns {Object} Archivo del documento en el formato solicitado
 */
exports.exportDocument = (req, res) => {
  const { format, docId } = req.params;
  const db = readDB();
  const doc = db.documentos.find(d => d.id === docId);
  
  // Verifica si el documento existe
  if (!doc) return res.status(404).send('No existe');
  
  // Exportación en formato TXT
  if (format === 'txt') {
    res.setHeader('Content-Disposition', `attachment; filename=${doc.titulo}.txt`);
    return res.type('text/plain').send(doc.contenido);
  }
  
  // Exportación en formato PDF (conversión simple)
  if (format === 'pdf') {
    res.setHeader('Content-Disposition', `attachment; filename=${doc.titulo}.pdf`);
    return res.type('application/pdf').send(Buffer.from(doc.contenido));
  }
  
  // Formato no soportado
  return res.status(400).send('Formato no soportado');
};