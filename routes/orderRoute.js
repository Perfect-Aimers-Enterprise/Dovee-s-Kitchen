const express = require('express')
const router = express.Router()
const authentication = require('../middleWare/authentication')


const { createProceedOrder, getAllProceedOrder, adminCancleOrder, adminConfirmOrder } = require('../controller/orderController')

router.get('/getAllProceedOrder', authentication, getAllProceedOrder)
router.post('/createProceedOrder', authentication, createProceedOrder)
router.delete('/adminCancleOrder/:id', adminCancleOrder)
router.post('/adminConfirmOrder/:id', adminConfirmOrder)



module.exports = router