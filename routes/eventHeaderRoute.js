const express = require('express');
const router = express.Router();

const { createEventHeader } = require('../controller/eventHeaderController')

router.post('/createEventHeader', createEventHeader)

module.exports = router