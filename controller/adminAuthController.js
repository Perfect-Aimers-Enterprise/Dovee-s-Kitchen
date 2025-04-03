const bcrypt = require('bcryptjs');
const adminAuth = require('../model/adminAuthModel');
const jwt = require('jsonwebtoken');

const authenticateAdmin = async (req, res) => {
    try {
        const { adminEmail, adminPassword } = req.body;

        console.log(adminEmail, adminPassword);

        if (!adminEmail) {
            return res.status(403).json({ error: 'Email required' });
        }

        if (!adminPassword) {
            return res.status(403).json({ error: 'Password required' });
        }

        // Find an admin by email
        const adminauth = await adminAuth.findOne({ adminEmail });

        if (!adminauth) {
            // Check if another admin already exists
            const checkEmail = await adminAuth.find();

            if (checkEmail.length >= 1) {
                return res.status(403).json({ error: 'Maximum Email Exceeded' });
            }

            const token = jwt.sign({ adminEmail }, process.env.JWT_SECRET, { expiresIn: '7h' });

            console.log(token);

            // res.cookie('hello', 'world')
            
            res.cookie('adminToken', token, {
                httpOnly: true, // Prevents JavaScript access
                // secure: process.env.NODE_ENV === 'production', // Only use 'secure: true' in production
                secure: true, // Use HTTPS in production
                sameSite: 'Strict', // Prevent CSRF attacks
                maxAge: 60 * 60 * 24 * 7 * 1000  // 7 days in milliseconds

            });

            // res.cookie('adminToken', token, {
            //     httpOnly: true,
            //     secure: process.env.NODE_ENV === 'production',  // Ensure Secure flag in production (only over HTTPS)
            //     sameSite: 'None',  // For cross-site requests, if using localhost in development
            //     maxAge: 60 * 60 * 24 * 7,  // Set the cookie to expire after 1 week
            //     path: '/'  // The cookie should be available throughout the site
            // });

            // Hash the password before storing
            const salt = await bcrypt.genSalt(10);
            const tempAdminPass = await bcrypt.hash(adminPassword, salt);

            // Create new admin
            const newAdmin = await adminAuth.create({
                adminEmail,
                adminPassword: tempAdminPass,
            });

           

            return res.status(201).json({ message: 'Admin Security Access Created Successfully', adminauth: newAdmin });
        }

        // Check if the password matches
        const passwordisMatch = await bcrypt.compare(adminPassword, adminauth.adminPassword);

        if (!passwordisMatch) {
            return res.status(403).json({
                error: 'Password does not match',
                message: 'Please put in the correct password'
            });
        }


        const token = jwt.sign({ adminEmail }, process.env.JWT_SECRET, { expiresIn: '7h' });

        console.log(token);
        
        res.cookie('adminToken', token, {
            httpOnly: true, // Prevents JavaScript access
            // secure: process.env.NODE_ENV === 'production', // Only use 'secure: true' in productions
            secure: true, // Use HTTPS in production
            sameSite: 'Strict', // Prevent CSRF attacks
            maxAge: 60 * 60 * 24 * 7 * 1000  // 7 days in milliseconds
        });

        // res.cookie('adminToken', token, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',  // Ensure Secure flag in production (only over HTTPS)
        //     sameSite: 'None',  // For cross-site requests, if using localhost in development
        //     maxAge: 60 * 60 * 24 * 7,  // Set the cookie to expire after 1 week
        //     path: '/'  // The cookie should be available throughout the site
        // });

        res.status(200).json({ message: 'Login successful! Redirecting...', adminauth });
    } catch (error) {
        console.error(error); // Log the error to see details
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};


const getAdminVerification = (req, res) => {
    res.send('Hello World')
}

module.exports = { authenticateAdmin, getAdminVerification };
