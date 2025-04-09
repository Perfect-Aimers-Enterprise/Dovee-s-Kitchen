const userSchema = require('../model/userModel')
const nodemailer = require('nodemailer')
const cron = require('node-cron');
const path = require('path')

const registerUser = async (req, res) => {
    try {
        const user = await userSchema.create({ ...req.body })
        console.log(user);
        const token = user.createJwt()
        console.log(token);
        
        // We use service when it's normal GMail and we use HOST, PORT & SECURE when it's other provider

        const transporter = nodemailer.createTransport({
            // service: 'gmail',
            host: "smtp.zoho.com",
            port: 465,
            secure: true,
            auth: {
              user: process.env.DOVEEYS_EMAIL,
              pass: process.env.DOVEEYS_PASS,
            },
          });
          

          
        console.log('After transporter');
        
        const mailOptions = {
            from: process.env.DOVEEYS_EMAIL,
            to: user.userEmail,
            subject: 'Welcome to Doveeys Kitchen',
            html: `
                <table style="width: 100%; font-family: Arial, sans-serif; color: #333; text-align: center; background-color: #f9f9f9; padding: 20px;">
                    <tr>
                        <td style="padding: 10px;">
                            <h1 style="font-size: 24px; margin: 0; color: #333;">Get ready for a delightful culinary journey!</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 10px;">
                            <p style="font-size: 16px; margin: 0;">Dear ${user.userName},

                            Thank you for joining the Doveey's Kitchen family! 🎉 We’re thrilled to have you on board, and we promise to treat your taste buds to something extraordinary.
                            
                            We pride ourselves on serving freshly prepared meals made with love, passion, and the finest ingredients—because you deserve nothing less!
                            
                            As a token of appreciation, we’ve prepared a special surprise just for you:
                            
                            </p>
                            <p>👉 Get [10%-15% off] your first order!</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 10px;">
                            <!-- Embedded image -->
                            <img src="cid:email-image" alt="Verification Banner" style="width: 300px; height: auto; border: none; margin: 10px auto;">
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 10px;">
                            <p style="font-size: 14px; margin: 0;">
                                Click <a href="https://doveeyskitchen.org/" style="font-weight: bold; color: #007bff; text-decoration: none;">here</a> to place your first order.
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
                    path: path.resolve(__dirname, '../public/image/valentineCombo.jpg'),// Image path
                    cid: 'email-image', // Content ID matches img src
                },
            ],
        }

        console.log('after mail Options');
        
        try {
            await transporter.sendMail(mailOptions);
            console.log("Email sent successfully");
        } catch (emailError) {
            console.error("Nodemailer Error:", emailError);
            // return res.status(500).json({ message: "Failed to send confirmation email." });
        }

        res.status(201).json({
            user: {
                userName: user.userName,
                userEmail: user.userEmail,
                userPhone: user.userPhone
            },
            token
        })

        
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            return res.status(400).json({message: "Email already exist, Please try another email"})
        }
        res.status(500).json({error, message: "This wasn't a successful Registration"})
    }
}

const loginUser = async (req, res) => {
    try {
        const {userEmail, userPassword} = req.body
        const user = await userSchema.findOne({userEmail})

        if (!user) {
            return res.status(403).json({ error: 'Invalid credentials (Email does not exist)' });
        }

        const isPasswordMatched = await user.comparePassword(userPassword)

        if (!isPasswordMatched) {
            return res.status(403).json({ error: 'Invalid credentials (Wrong Password)' });
        }

        const token = user.createJwt()
        res.status(201).json({
            user: {
                userName: user.userName,
                userEmail: user.userEmail,
                userPhone: user.userPhone
            },
            token
        })
    } catch (error) {
        
    }
}

const getRegisteredUser = async (req, res) => {
    try {
        const user = await userSchema.find()

        res.status(201).json({user, count: user.length})
    } catch (error) {
        res.status(500).json(error)
    }
}





// Create a transporter using Nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    auth: {
        user: process.env.DOVEEYS_EMAIL,  // Gmail email address
        pass: process.env.DOVEEYS_PASS,   // Gmail password or App Password
    },
});

// Function to send the reminder email
const sendReminderEmail = async () => {
    try {
        // Fetch users from the database who should receive the email
        const users = await userSchema.find() // Adjust this query to suit your needs (e.g., filtering active users)
        
        users.forEach(user => {
            const mailOptions = {
                from: process.env.DOVEEYS_EMAIL,
                to: user.userEmail,
                subject: 'Reminder: Don\'t Forget to Make Your Weekend Order!',
                html: `
                    <table style="width: 100%; font-family: Arial, sans-serif; color: #333; text-align: center; background-color: #f9f9f9; padding: 20px;">
                        <tr>
                            <td style="padding: 10px;">
                                <h1 style="font-size: 24px; margin: 0; color: #333;">Weekend is Coming! Place Your Order Today!</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 10px;">
                                <p style="font-size: 16px; margin: 0;">Dear ${user.userName},

                                We hope you’ve had a wonderful week so far! 🌟

                                Don’t forget to place your order with Doveey’s Kitchen and treat yourself to some delicious meals this weekend!

                                <br><br> 
                                We’ve got a variety of mouthwatering dishes, prepared just for you! 😋

                                Click <a href="https://doveeyskitchen.com/htmlFolder/orderPage.html" style="font-weight: bold; color: #007bff; text-decoration: none;">here</a> to make your weekend order now!
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
            };

            // Send the email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error sending reminder email:', error);
                } else {
                    console.log('Reminder email sent to:', user.userEmail);
                }
            });
        });
    } catch (error) {
        console.log('Error fetching users from database:', error);
    }
};

// Schedule the email to send every Friday at 10:00 AM
cron.schedule('0 10 * * 5', sendReminderEmail, {
    scheduled: true,
    timezone: "Africa/Lagos", // Use your local timezone here
});

console.log('Reminder email service is running...');


module.exports = {
    registerUser, loginUser, getRegisteredUser
}