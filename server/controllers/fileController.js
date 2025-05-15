/**
 * Controlador para gestionar operaciones con archivos
 * 
 * @file FileController.js
 * @description Maneja la subida, listado y descarga de archivos
 */

const fs = require('fs');
const path = require('path');

// Define el directorio donde se guardarán los archivos subidos
const UPLOAD_DIR = path.join(__dirname, '../uploads');

// Crea el directorio de uploads si no existe
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

/**
 * Maneja la subida de archivos * 
 * @param {Object} req - Objeto de solicitud HTTP Express
 * @param {Object} res - Objeto de respuesta HTTP Express
 * @returns {Object} Respuesta JSON con información sobre el archivo subido
 */
exports.uploadFile = (req, res) => {
  // multer ya ha guardado el fichero en el directorio de uploads
  if (!req.file) return res.status(400).json({ error: 'Sin archivo' });
  
  // Devuelve información sobre el archivo subido
  res.json({ 
    filename: req.file.filename,    // Nombre generado por multer (normalmente único)
    original: req.file.originalname // Nombre original del archivo
  });
};

/**
 * Obtiene la lista de todos los archivos subidos
 * 
 * @param {Object} req - Objeto de solicitud HTTP Express
 * @param {Object} res - Objeto de respuesta HTTP Express
 * @returns {Object} Respuesta JSON con la lista de nombres de archivos
 */
exports.listFiles = (req, res) => {
  const files = fs.readdirSync(UPLOAD_DIR);
  res.json(files);
};

/**
 * Descarga un archivo específico
 * 
 * @param {Object} req - Objeto de solicitud HTTP Express
 * @param {Object} res - Objeto de respuesta HTTP Express
 * @returns {Object} Archivo solicitado para descarga
 */
exports.downloadFile = (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(UPLOAD_DIR, filename);
  
  // Verifica si el archivo existe
  if (!fs.existsSync(filePath)) return res.status(404).send('No existe');
  
  // Envía el archivo para descarga
  res.download(filePath);
};