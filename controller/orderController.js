const orderModel = require('../model/orderModel')
const userSchema = require('../model/userModel')

const getAllProceedOrder = async (req, res) => {
    try {
        const orderProceed = await orderModel.find({createdBy: req.user.userId}).sort('createdAt')

        res.status(201).json({orderProceed, count: orderProceed.length})
    } catch (error) {
        res.status(500).json(error)
    }
}

const createProceedOrder = async (req, res) => {
    try {
        req.body.createdBy = req.user.userId
        const orderProceed = await orderModel.create({...req.body})

        console.log(orderModel);
        

        res.status(201).json({orderProceed, message: 'Order Processed Successfully'})

    } catch (error) {
        res.status(500).json(error)
    }
}

const adminGetAllProceedOrder = async (req, res) => {
    try {
        const orderProceed = await orderModel.find().sort('createdAt')

        res.status(201).json({orderProceed, count: orderProceed.length})
    } catch (error) {
        res.status(500).json(error)
    }
}

const adminCancleOrder = async (req, res) => {
    try {

        const {id:orderId} = req.params
        const orderProceed = await orderModel.findOneAndDelete({createdBy: req.user.userId, _id:orderId})

        res.status(201).json({message: 'Item Cancled Successfully'})

    } catch (error) {
        res.status(500).json(error)
    }
}

const adminConfirmOrder = async (req, res) => {
    try {
        const {id:orderId} = req.params
        const orderProceed = await orderModel.findOne({createdBy: req.user.userId, _id:orderId})

        orderProceed.menuProductOrderStatus = 'Confirmed'
        await orderProceed.save()

        res.status(201).json({message: 'Item Confirmed'})
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {createProceedOrder, getAllProceedOrder, adminGetAllProceedOrder, adminCancleOrder, adminConfirmOrder}