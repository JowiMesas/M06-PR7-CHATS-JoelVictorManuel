const router = require('express').Router();
const { openDocument, exportDocument } = require('../controllers/documentController')
router.get('/open/:docId', openDocument);

router.get('/export/:format/:docId', exportDocument);
module.exports = router;