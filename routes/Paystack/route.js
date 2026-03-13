const express = require("express");
const { initializePaystack, verifyPaystack } = require("../../controller/Paystack/route");
const router = express.Router();

router.post("/init", initializePaystack);
router.post("/verify", verifyPaystack);

module.exports = router;
