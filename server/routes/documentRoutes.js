const router = require('express').Router();
const { openDocument, saveDocument, exportDocument } = require('../controllers/documentController')
router.get('/open/:docId', openDocument);
router.post('/save', saveDocument);
router.get('/export/:format/:docId', exportDocument);
module.exports = router;