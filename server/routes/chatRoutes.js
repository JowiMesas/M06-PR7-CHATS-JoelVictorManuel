const router = require('express').Router();
const { viewHistory, sendMessage } = require('../controllers/chatController');
router.get('/view_hist', viewHistory);
router.post('/send_message', sendMessage);
module.exports = router;