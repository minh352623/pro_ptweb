const express = require("express");
const { getPaganition } = require("../controllers/user.controller");
const { isAdmin, isAuthentication } = require("../middleware/AuthMiddleware");

const router = express.Router();
router.get("/pagination", [isAuthentication, isAdmin], getPaganition);

module.exports = router;
