const express = require('express')
const router = express.Router()

const {registerUser, loginUser, getRegisteredUser} = require('../controller/userController')

router.post('/registerUser', registerUser)
router.post('/loginUser', loginUser)
router.get('/getRegisteredUser', getRegisteredUser)

module.exports = router