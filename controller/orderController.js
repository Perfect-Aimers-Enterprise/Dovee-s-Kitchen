const orderModel = require('../model/orderModel')
const userSchema = require('../model/userModel')

const getAllProceedOrder = async (req, res) => {
    try {
        const orderProceed = await orderModel.find({createdBy: req.user.userId}).sort({ createdAt: -1 })

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
        const orderProceed = await orderModel.find({ menuProductOrderStatus: 'Pending' }).sort({ createdAt: -1 })

        res.status(201).json({orderProceed, count: orderProceed.length})
    } catch (error) {
        res.status(500).json(error)
    }
}

const adminGetAllConfirmedOrdersPrice = async (req, res) => {
    try {
        // Fetch all orders with status "Confirmed"
        const confirmedOrders = await orderModel.find({ menuProductOrderStatus: 'Confirmed' }).sort({ createdAt: -1 });

        // Calculate the total price
        const totalConfirmedPrice = confirmedOrders.reduce((total, order) => {
            return total + parseFloat(order.menuTotalProductOrderPrice || 0); // Convert to number and ensure no undefined values
        }, 0);

        // Send the response
        res.status(201).json({
            confirmedOrders,
            count: confirmedOrders.length,
            totalPrice: totalConfirmedPrice
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


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

const getMonthlyOrders = async (req, res) => {
    const { month, year } = req.query; // e.g., month=1 (January), year=2024
    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0); // End of the month

        const orders = await orderModel.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },
            {
                $group: {
                    _id: { $week: "$createdAt" },
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: "$menuTotalProductOrderPrice" },
                },
            },
            {
                $sort: { "_id": 1 }, // Sort by week
            },
        ]);

        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getWeeklyGrowth = async (req, res) => {
    try {
      const today = new Date();
  
      // Start of current week (Sunday)
      const currentWeekStart = new Date(today.setDate(today.getDate() - today.getDay()));
      currentWeekStart.setHours(0, 0, 0, 0); // Set to midnight
  
      // Start of previous week (Sunday)
      const previousWeekStart = new Date(currentWeekStart);
      previousWeekStart.setDate(previousWeekStart.getDate() - 7);
  
      // End of previous week (Saturday)
      const previousWeekEnd = new Date(currentWeekStart);
      previousWeekEnd.setSeconds(-1); // Just before the current week starts
  
      // Aggregate orders for the current and previous weeks
      const currentWeekOrders = await orderModel.countDocuments({
        createdAt: { $gte: currentWeekStart },
      });
  
      const previousWeekOrders = await orderModel.countDocuments({
        createdAt: {
          $gte: previousWeekStart,
          $lt: previousWeekEnd,
        },
      });
  
      console.log({
        currentWeekStart,
        previousWeekStart,
        previousWeekEnd,
        currentWeekOrders,
        previousWeekOrders,
      });
  
      // Calculate growth percentage
      let growthPercentage = 0;
      if (previousWeekOrders === 0) {
        growthPercentage = currentWeekOrders > 0 ? 100 : 0; // Assume 100% growth for first-time orders
      } else {
        growthPercentage = ((currentWeekOrders - previousWeekOrders) / previousWeekOrders) * 100;
      }
  
      res.status(200).json({
        currentWeekOrders,
        previousWeekOrders,
        growthPercentage: growthPercentage.toFixed(2), // Limit to two decimal places
      });
    } catch (error) {
      console.error('Error calculating weekly growth:', error);
      res.status(500).json({ error: error.message });
    }
  };
  

module.exports = {createProceedOrder, getAllProceedOrder, adminGetAllProceedOrder, adminCancleOrder, adminConfirmOrder, adminGetAllConfirmedOrdersPrice, getMonthlyOrders, getWeeklyGrowth}