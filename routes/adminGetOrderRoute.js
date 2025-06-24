const express = require('express')
const router = express.Router()

const { adminGetAllProceedOrder, adminGetAllConfirmedOrdersPrice, getMonthlyOrders, getWeeklyGrowth } = require('../controller/orderController')

router.get('/adminGetAllProceedOrder', adminGetAllProceedOrder)
router.get('/adminGetAllConfirmedOrdersPrice', adminGetAllConfirmedOrdersPrice)
router.get('/getMonthlyOrders', getMonthlyOrders)
router.get('/getWeeklyGrowth', getWeeklyGrowth)

module.exports = router