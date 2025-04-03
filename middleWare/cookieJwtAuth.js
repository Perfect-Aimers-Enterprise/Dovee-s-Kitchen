const jwt = require('jsonwebtoken');

const cookieJwtAuth = (req, res, next) => {
    // console.log(req);
    
    console.log('Cookies:', req.cookies);  // Logs cookies from the request
    console.log('Header Cookie:', req.headers.cookie);  // Logs cookies from the request headers
    console.log('Signed Cookies:', req.signedCookies);  // Logs signed cookies (if you're using them)

    // Corrected cookie name
    const adminToken = req.cookies.adminToken;  // Use the correct cookie name
    console.log('Verify Admin Token:', adminToken);  // Log the token

    if (!adminToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);  // Verify the token using the same secret
        console.log('Decoded Admin Token:', decoded);  // Log the decoded token

        // If token is valid, add admin info to the request object
        req.adminEmail = decoded.adminEmail;
        next();  // Proceed to the next middleware or route handler
    } catch (error) {
        console.log('Token verification failed:', error);  // Log the error
        res.clearCookie('adminToken');  // Clear the invalid token
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = cookieJwtAuth;