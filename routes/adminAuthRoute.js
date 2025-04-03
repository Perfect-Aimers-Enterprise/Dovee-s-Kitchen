const express = require('express');
const router = express.Router();

const { authenticateAdmin, getAdminVerification } = require('../controller/adminAuthController')
const cookieJwtAuth = require('../middleWare/cookieJwtAuth')

router.post('/authenticateAdmin', authenticateAdmin)
router.get('/verifyAdmin', cookieJwtAuth, getAdminVerification)



// app.get('/doveeysKitchen/safezone/verifyAdmin'

module.exports = router