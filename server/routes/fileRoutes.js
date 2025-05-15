const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const {
  uploadFile,
  listFiles,
  downloadFile,
} = require("../controllers/fileController");

// Configuración multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${file.originalname}`;
    cb(null, unique);
  },
});
const fileFilter = (req, file, cb) => {
  // Aceptamos sólo PDF, imágenes y .txt
  const allowed = ["application/pdf", "text/plain", "image/png", "image/jpeg"];
  cb(null, allowed.includes(file.mimetype));
};
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // máx 5MB
  fileFilter,
});

router.post("/upload", upload.single("file"), uploadFile); // ENVIAR_DOC
router.get("/list", listFiles); // LIST_DOC
router.get("/download/:filename", downloadFile); // DOWN_DOC

module.exports = router;
