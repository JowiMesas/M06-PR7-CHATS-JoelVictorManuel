const fs   = require('fs');
const path = require('path');

const UPLOAD_DIR = path.join(__dirname, '../uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

exports.uploadFile = (req, res) => {
  // multer ya ha guardado el fichero en uploads/
  if (!req.file) return res.status(400).json({ error: 'Sin archivo' });
  res.json({ filename: req.file.filename, original: req.file.originalname });
};

exports.listFiles = (req, res) => {
  const files = fs.readdirSync(UPLOAD_DIR);
  res.json(files);
};

exports.downloadFile = (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(UPLOAD_DIR, filename);
  if (!fs.existsSync(filePath)) return res.status(404).send('No existe');
  res.download(filePath);
};