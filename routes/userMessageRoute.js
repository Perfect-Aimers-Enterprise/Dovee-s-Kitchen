const express = require('express')
const router = express.Router()

const {sendUserMessage, getAllUserMessage,
    getSingleUserMessage} = require('../controller/userMessageController')

router.post('/sendUserMessage', sendUserMessage)
router.get('/getAllUserMessage', getAllUserMessage)
router.get('/getSingleUserMessage/:id', getSingleUserMessage)





module.exports = router