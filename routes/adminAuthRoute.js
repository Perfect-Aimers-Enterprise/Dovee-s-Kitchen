const express = require('express');
const router = express.Router();

const { authenticateAdmin } = require('../controller/adminAuthController')

router.post('/authenticateAdmin', authenticateAdmin)

module.exports = router