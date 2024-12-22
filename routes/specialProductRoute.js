const express = require('express')
const router = express.Router()

const {getMenuProducts, getSingleMenuProduct, deleteMenuProduct, createSpecialProduct, updateSpecialProduct} = require('../controller/sepcialProductController')

const {specialStorage} = require('../configuration/productConfiguration')

router.post('/createSpecialProduct', specialStorage, createSpecialProduct)
router.get('/getSpecialProducts', getMenuProducts)
router.get('/getSingleSpecialProduct/:id', getSingleMenuProduct)
router.delete('/deleteSpecialProduct/:id', deleteMenuProduct)
router.patch('/updateSpecialProduct/:id', updateSpecialProduct)

module.exports = router