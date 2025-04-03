const express = require('express');
const router = express.Router();

const { initiateToggle, getToggleStatus } = require('../controller/toggleEventController')

router.post('/initiateToggle', initiateToggle)
router.get('/getToggleStatus', getToggleStatus)

module.exports = router