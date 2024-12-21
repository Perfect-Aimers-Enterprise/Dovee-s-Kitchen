const express = require('express')
const router = express.Router()


const {createProceedOrder, getAllProceedOrder, adminCancleOrder, adminConfirmOrder} = require('../controller/orderController')

router.get('/getAllProceedOrder', getAllProceedOrder)
router.post('/createProceedOrder', createProceedOrder)
router.delete('/adminCancleOrder/:id', adminCancleOrder)
router.post('/adminConfirmOrder/:id', adminConfirmOrder)


module.exports = router