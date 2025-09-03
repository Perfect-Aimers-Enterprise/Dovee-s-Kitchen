const orderModel = require('../model/orderModel')
const Subscription = require('../model/subscriptionModel'); // Assuming you have a subscription model for notifications
const { webPush } = require('../utils/webPushConfig');
const userSchema = require('../model/userModel')
const nodemailer = require('nodemailer')
const path = require('path')

const getAllProceedOrder = async (req, res) => {
    try {
        const orderProceed = await orderModel.find({ createdBy: req.user.userId }).sort({ createdAt: -1 })

        res.status(201).json({ orderProceed, count: orderProceed.length })
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' })
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
            subject: 'Doveeys Kitchen Order Placement',
            html: `
                          <body style="font-family: Arial, sans-serif; background-color: #ffffff; padding: 20px; color: #222;">

    <div style="max-width: 600px; margin: auto; border-radius: 8px; border: 1px solid #e0e0e0; box-shadow: 0 0 10px rgba(0,0,0,0.08);">
      <div style="background-color: #2e7d32; color: #fff; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
        <h1 style="margin: 0; font-size: 24px;">🍽️ Doveeys Kitchen</h1>
        <p style="margin: 5px 0 0;">Your Order Has Been Received!</p>
      </div>

      <div style="padding: 20px;">
        <p style="font-size: 16px;">Hi <strong>${orderProceed.userName}</strong>,</p>
        <p>Thank you for placing an order with <strong>Doveeys Kitchen</strong>! Here’s a summary of your order:</p>

        <div style="border-top: 1px solid #ddd; margin-top: 15px; padding-top: 15px; overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f6f6f6;">
                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Product</th>
                <th style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">Image</th>
                <th style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">Price</th>
                <th style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">Qty</th>
                <th style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              <!-- Repeat this TR for each product -->
              <tr>
                <td style="padding: 10px;">${orderProceed.menuProductOrderName}</td>
                <td style="padding: 10px; text-align: center;">
                  <img src="cid:email-image" alt="${orderProceed.menuProductOrderImage}" width="60" height="60" style="border-radius: 6px; object-fit: cover;" />
                </td>
                <td style="padding: 10px; text-align: center;">₦${orderProceed.menuProductOrderPrice}</td>
                <td style="padding: 10px; text-align: center;">${orderProceed.menuProductOrderQuantity}</td>
                <td style="padding: 10px; text-align: center;">₦${orderProceed?.menuTotalProductOrderPrice}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="margin-top: 20px;">
          <p><strong>Order Total: ₦${orderProceed?.menuTotalProductOrderPrice}</strong></p>
        </div>

        <div style="margin-top: 30px; font-size: 14px;">
          <p>If you have any questions or special requests, feel free to reply to this email. We’re always here to serve you with a smile 😊</p>
          <p style="margin-top: 10px;">Stay hungry, stay happy!<br/><strong style="color: #ff6f00;">– Doveeys Kitchen Team</strong></p>
        </div>
      </div>

      <div style="background-color: #000; color: #fff; text-align: center; padding: 15px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
        <p style="margin: 0; font-size: 12px;">© 2025 Doveeys Kitchen. All rights reserved.</p>
      </div>
    </div>

  </body>
                        `,
            attachments: [
                {
                    filename: 'electrical1.jpg', // Image filename
                    path: path.resolve(__dirname, `../public/htmlFolder/${orderProceed.menuProductOrderImage}`),// Image path
                    cid: 'email-image', // Content ID matches img src
                },
            ],
        }


        const mailOptionsAdmin = {
            from: process.env.DOVEEYS_EMAIL,
            to: "doveeyskitchen@gmail.com",
            subject: `📦 New Order Placed by ${orderProceed.userName}`,
            html: `
        <p><strong>New Order Received</strong></p>
        <p>Customer: ${orderProceed.userName}</p>
        <p>Email: ${req.body.userEmail}</p>
        <p>Product: ${orderProceed.menuProductOrderName}</p>
        <p>Qty: ${orderProceed.menuProductOrderQuantity}</p>
        <p>Total: ₦${orderProceed.menuTotalProductOrderPrice}</p>
      `,
        };

        // Send both emails
        await transporter.sendMail(mailOptions);
        await transporter.sendMail(mailOptionsAdmin);



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
        const orderProceed = await orderModel.findOneAndDelete({ _id: orderId })

        const transporter = nodemailer.createTransport({
            host: 'smtp.zoho.com',
            port: 465,
            auth: {
                user: process.env.DOVEEYS_EMAIL,
                pass: process.env.DOVEEYS_PASS
            }
        })

        const mailOptions = {
            from: process.env.DOVEEYS_EMAIL,
            to: orderProceed.userEmail,
            subject: 'Order Cancellation Doveeys Kitchen',
            html: `
                    <body style="font-family: Arial, sans-serif; background-color: #ffffff; padding: 20px; color: #222;">

                <div style="max-width: 600px; margin: auto; border-radius: 8px; border: 1px solid #e0e0e0; box-shadow: 0 0 10px rgba(0,0,0,0.08);">
                    
                    <div style="background-color: #2e7d32; color: #fff; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                    <h1 style="margin: 0; font-size: 24px;">🍽️ Doveeys Kitchen</h1>
                    <p style="margin: 5px 0 0;">Your Order Has Been Cancelled!</p>
                    </div>

            <div style="padding: 20px;">
            <p style="font-size: 16px;">Hi <strong>${orderProceed.userName}</strong>,</p>
            <p>Great news! Your order has been cancelled by <strong>Doveeys Kitchen</strong>. Here are the details:</p>

            <div style="border-top: 1px solid #ddd; margin-top: 15px; padding-top: 15px; overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: #f6f6f6;">
                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Product</th>
                <th style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">Price</th>
                <th style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">Qty</th>
                <th style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
              <td style="padding: 10px;">${orderProceed.menuProductOrderName}</td>
              <td style="padding: 10px; text-align: center;">₦${orderProceed.menuProductOrderPrice}</td>
              <td style="padding: 10px; text-align: center;">${orderProceed.menuProductOrderQuantity}</td>
              <td style="padding: 10px; text-align: center;">₦${orderProceed?.menuTotalProductOrderPrice}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="margin-top: 20px;">
        <p><strong>Order Total: ₦${orderProceed?.menuTotalProductOrderPrice}</strong></p>
      </div>

      <div style="margin-top: 30px; font-size: 14px;">
        <p>Your food is being prepared and will be with you shortly. Thank you for choosing us!</p>
        <p style="margin-top: 10px;">Stay hungry, stay happy!<br/><strong style="color: #ff6f00;">– Doveeys Kitchen Team</strong></p>
      </div>
    </div>

    <div style="background-color: #000; color: #fff; text-align: center; padding: 15px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
      <p style="margin: 0; font-size: 12px;">© 2025 Doveeys Kitchen. All rights reserved.</p>
    </div>

  </div>

</body>
            `
        }

        await transporter.sendMail(mailOptions)

        res.status(201).json({ message: 'Item Cancled Successfully' })

    } catch (error) {
        res.status(500).json(error)
    }
}

const adminConfirmOrder = async (req, res) => {
    try {
        const { id: orderId } = req.params

        const orderProceed = await orderModel.findOne({ _id: orderId })

        orderProceed.menuProductOrderStatus = 'Confirmed'
        await orderProceed.save()

        const transporter = nodemailer.createTransport({
            host: 'smtp.zoho.com',
            port: 465,
            auth: {
                user: process.env.DOVEEYS_EMAIL,
                pass: process.env.DOVEEYS_PASS
            }
        })

        const mailOptions = {
            from: process.env.DOVEEYS_EMAIL,
            to: orderProceed.userEmail,
            subject: 'Order Confirmation Doveeys Kitchen',
            html: `
                    <body style="font-family: Arial, sans-serif; background-color: #ffffff; padding: 20px; color: #222;">

                <div style="max-width: 600px; margin: auto; border-radius: 8px; border: 1px solid #e0e0e0; box-shadow: 0 0 10px rgba(0,0,0,0.08);">
                    
                    <div style="background-color: #2e7d32; color: #fff; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                    <h1 style="margin: 0; font-size: 24px;">🍽️ Doveeys Kitchen</h1>
                    <p style="margin: 5px 0 0;">Your Order Has Been Confirmed!</p>
                    </div>

            <div style="padding: 20px;">
            <p style="font-size: 16px;">Hi <strong>${orderProceed.userName}</strong>,</p>
            <p>Great news! Your order has been confirmed by <strong>Doveeys Kitchen</strong>. Here are the details:</p>

            <div style="border-top: 1px solid #ddd; margin-top: 15px; padding-top: 15px; overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: #f6f6f6;">
                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Product</th>
                <th style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">Price</th>
                <th style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">Qty</th>
                <th style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
              <td style="padding: 10px;">${orderProceed.menuProductOrderName}</td>
              <td style="padding: 10px; text-align: center;">₦${orderProceed.menuProductOrderPrice}</td>
              <td style="padding: 10px; text-align: center;">${orderProceed.menuProductOrderQuantity}</td>
              <td style="padding: 10px; text-align: center;">₦${orderProceed?.menuTotalProductOrderPrice}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="margin-top: 20px;">
        <p><strong>Order Total: ₦${orderProceed?.menuTotalProductOrderPrice}</strong></p>
      </div>

      <div style="margin-top: 30px; font-size: 14px;">
        <p>Your food is being prepared and will be with you shortly. Thank you for choosing us!</p>
        <p style="margin-top: 10px;">Stay hungry, stay happy!<br/><strong style="color: #ff6f00;">– Doveeys Kitchen Team</strong></p>
      </div>
    </div>

    <div style="background-color: #000; color: #fff; text-align: center; padding: 15px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
      <p style="margin: 0; font-size: 12px;">© 2025 Doveeys Kitchen. All rights reserved.</p>
    </div>

  </div>

</body>
            `
        }

        await transporter.sendMail(mailOptions)

        res.status(201).json({ message: 'Item Confirmed' })
    } catch (error) {
        console.log(error);

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