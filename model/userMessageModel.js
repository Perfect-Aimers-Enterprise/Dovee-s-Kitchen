const mongoose = require('mongoose')

const userMessageSchema = new mongoose.Schema({
    userMessageTitle: {type: String},
    userMessage: {type: String},
    userName: {type: String},
    userEmail: {type: String},
    userPhone: {type: Number},
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
    
}, {timestamps: true})

module.exports = mongoose.model('userMessageSchema', userMessageSchema)