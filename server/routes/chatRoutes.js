const router = require("express").Router();
const {
  viewHistory,
  sendMessage,
  exportChat,
} = require("../controllers/chatController");
router.get("/view_hist", viewHistory);
router.post("/send_message", sendMessage);
router.get("/export/:format", exportChat);
module.exports = router;
