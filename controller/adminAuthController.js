const bcrypt = require('bcryptjs');
const adminAuth = require('../model/adminAuthModel');

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

        res.status(200).json({message: 'Login successful! Redirecting...', adminauth});
    } catch (error) {
        console.error(error); // Log the error to see details
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

module.exports = { authenticateAdmin };
