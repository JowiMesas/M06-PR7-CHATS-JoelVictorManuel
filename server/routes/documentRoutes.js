const router = require('express').Router();
const { openDocument, exportDocument,listDocuments, getDocument, createDocument } = require('../controllers/documentController')
router.get('/open/:docId', openDocument);
router.get('/',    listDocuments);
router.get('/:id', getDocument);       
router.post('/',   createDocument);
router.get('/export/:format/:docId', exportDocument);
module.exports = router;