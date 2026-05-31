const express = require("express");
const upload = require("../middleware/upload");
const { handleTransform } = require("../controllers/transformController");

const { protect } = require("../middleware/auth");

const router = express.Router();

// POST /transform — upload image + prompt, get transformed image back
router.post("/", protect, upload.single("image"), handleTransform);

module.exports = router;
