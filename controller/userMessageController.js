const userMessageSchema = require('../model/userMessageModel')

const sendUserMessage = async (req, res) => {
    try {
        const {userMessageTitle, userMessage, userName, userEmail, userPhone} = req.body
        const userMessages = await userMessageSchema.create({ ...req.body })

        res.status(201).json(userMessages)
    } catch (error) {
        console.log(error);
        
    }
}

const getAllUserMessage = async (req, res) => {
    try {
        const userMessages = await userMessageSchema.find().sort({ createdAt: -1 })
        res.status(201).json(userMessages)
    } catch (error) {
        console.log(error);
        
    }
}

const getSingleUserMessage = async (req, res) => {
    try {
        const {id:messageId} = req.params
        const userMessages = await userMessageSchema.findById({_id:messageId})

        res.status(201).json(userMessages)
    } catch (error) {
        console.log(error);
        
    }
}

module.exports = {
    sendUserMessage,
    getAllUserMessage,
    getSingleUserMessage
}