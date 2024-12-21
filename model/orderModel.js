const mongoose = require('mongoose')

const orderProceedSchema = new mongoose.Schema({
    menuProductOrderImage: {type: String},
    menuProductOrderName: {type: String},
    menuProductOrderPrice: {type: String},
    menuTotalProductOrderPrice: {type: String},
    menuProductOrderAddress: {type: String},
    menuProductOrderQuantity: {type: String},
    userName: {type: String},
    userEmail: {type: String},
    userPhone: {type: String},
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    menuProductOrderStatus: {
        type: String,
        default: 'Pending'
    }
    
}, {timestamps: true})

module.exports = mongoose.model('orderProceedSchema', orderProceedSchema)