const mongoose = require('mongoose')

const orderProceedSchema = new mongoose.Schema({
    menuProductOrderImage: {type: String},
    menuProductOrderName: {type: String},
    menuProductOrderPrice: {type: Number},
    menuTotalProductOrderPrice: {type: Number},
    menuProductOrderAddress: {type: String},
    menuProductOrderContact: {type: Number},
    menuProductOrderQuantity: {type: Number},
    userName: {type: String},
    userEmail: {type: String},
    userPhone: {type: Number},
    menuProductOrderVariation: {
            size: { type: String}, // Size (e.g., 1L, 2L)
            price: { type: Number} // Price for the size
        },
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