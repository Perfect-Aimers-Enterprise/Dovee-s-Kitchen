const express = require('express')
const router = express.Router()

const {adminGetAllProceedOrder} = require('../controller/orderController')

router.get('/adminGetAllProceedOrder', adminGetAllProceedOrder)

module.exports = router