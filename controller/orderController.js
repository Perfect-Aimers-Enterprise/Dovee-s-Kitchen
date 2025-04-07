const orderModel = require('../model/orderModel')
const Subscription = require('../model/subscriptionModel'); // Assuming you have a subscription model for notifications
const { webPush } = require('../utils/webPushConfig');
const userSchema = require('../model/userModel')
const nodemailer = require('nodemailer')

const getAllProceedOrder = async (req, res) => {
    try {
        const orderProceed = await orderModel.find({ createdBy: req.user.userId }).sort({ createdAt: -1 })

        res.status(201).json({ orderProceed, count: orderProceed.length })
    } catch (error) {
        res.status(500).json(error)
    }
}

const subscribe = async (req, res) => {
    try {
        const subscription = req.body;

        // Check if subscription already exists
        const existingSub = await Subscription.findOne({ endpoint: subscription.endpoint });
        if (!existingSub) {
            await Subscription.create(subscription); // Save subscription
        }

        res.status(201).json({ message: 'Subscription successful!' });
    } catch (error) {
        console.error('Subscription error:', error);
        res.status(500).json({ message: 'Subscription failed.' });
    }
};


const createProceedOrder = async (req, res) => {
    try {
        // Attach the user ID to the order
        req.body.createdBy = req.user.userId;

        // Save the order to the database
        const orderProceed = await orderModel.create({ ...req.body });

        console.log('Order Created:', orderProceed);

        const transporter = nodemailer.createTransport({
            host: "smtp.zoho.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.DOVEEYS_EMAIL,
                pass: process.env.DOVEEYS_PASS
            }
        })

        const mailOptions = {
            from: process.env.DOVEEYS_EMAIL,
            to: req.body.userEmail,
            subject: 'Your Order from Doveeys Kitchen',
            html: `
                          <table
        style="width: 100%; font-family: Arial, sans-serif; color: #333; text-align: center; background-color: #f9f9f9; padding: 20px;">
        <tr>
            <td style="padding: 10px;">
                <h1 style="font-size: 24px; margin: 0; color: #333;">Doveeys Kitchen Product Order!</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 10px;">
                <p style="font-size: 16px; margin: 0;">Dear ${orderProceed.userName},

                    Thank you for shopping with Doveey's Kitchen family! 🎉 We’re thrilled to have serve you always, and
                    we promise to treat your taste buds to something extraordinary.

                </p>
                <p style="font-weight: bold; margin-top: 10px;">Your Order Details</p>
                <div>
        <tr>
            <td style="padding: 10px;">
                <!-- Embedded image -->
                <img src="cid:email-image" alt="Verification Banner"
                    style="width: 300px; height: auto; border: none; margin: 10px auto;">
            </td>
        </tr>
        <tr>
            <td>Product Name: ${req.body.menuProductOrderName}</td>
        </tr>
        <tr>
            <td>Product Quantity: ${req.body.menuProductOrderQuantity}</td>
        </tr>
        <tr>
            <td>Total Price: ${req.body.menuTotalProductOrderPrice}</td>
        </tr>
        <tr>
            <td>Variation: ${req.body.menuProductOrderVariation.size} ${req.body.menuProductOrderVariation.price}</td>
        </tr>
        <tr>
            <td>Product Price: ${req.body.menuProductOrderPrice}</td>
        </tr>

        </div>
        </td>
        </tr>

        <tr>
            <td style="padding: 20px;">For more delivery info, contact our admin <span
                    style="font-weight: bold;">doveeyskitchen@gmail.com</span></td>
        </tr>

        <tr>

            <td style="padding: 10px;">
                <p style="font-size: 14px; margin: 0;">
                    Click <a href="https://doveeyskitchen.org/"
                        style="font-weight: bold; color: #007bff; text-decoration: none;">here</a> to shop again with
                    us.
                </p>
            </td>
        </tr>
        <tr>
            <td style="padding: 10px;">
                <p style="font-size: 12px; color: #666; margin: 0;">
                    If you did not request this, please ignore this email or contact our support.
                </p>
            </td>
        </tr>
    </table>
                        `,
            attachments: [
                {
                    filename: 'electrical1.jpg', // Image filename
                    path: path.resolve(__dirname, `../public/image/menuImage/${req.body.menuProductOrderImage}`),// Image path
                    cid: 'email-image', // Content ID matches img src
                },
            ],
        }

       await transporter.sendMail(mailOptions)


        res.status(201).json({
            orderProceed,
            message: 'Order Processed Successfully and Notification Sent!'
        });

    } catch (error) {
        console.error('Error processing order:', error);
        res.status(500).json({ message: 'Error placing order.', error });
    }
};

const adminGetAllProceedOrder = async (req, res) => {
    try {
        const orderProceed = await orderModel.find({ menuProductOrderStatus: 'Pending' }).sort({ createdAt: -1 })

        res.status(201).json({ orderProceed, count: orderProceed.length })
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

        const { id: orderId } = req.params
        const orderProceed = await orderModel.findOneAndDelete({ createdBy: req.user.userId, _id: orderId })

        res.status(201).json({ message: 'Item Cancled Successfully' })

    } catch (error) {
        res.status(500).json(error)
    }
}

const adminConfirmOrder = async (req, res) => {
    try {
        const { id: orderId } = req.params
        const orderProceed = await orderModel.findOne({ createdBy: req.user.userId, _id: orderId })

        orderProceed.menuProductOrderStatus = 'Confirmed'
        await orderProceed.save()

        res.status(201).json({ message: 'Item Confirmed' })
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


module.exports = { createProceedOrder, getAllProceedOrder, adminGetAllProceedOrder, adminCancleOrder, adminConfirmOrder, adminGetAllConfirmedOrdersPrice, getMonthlyOrders, getWeeklyGrowth, subscribe }