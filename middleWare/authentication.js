const userSchema = require('../model/userModel')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {

    // console.log(req.headers);

    // console.log(req);
    
    const authHeader = req.headers.authorization
    // console.log('authenTicationHeaderConsole', authHeader);

    // console.log(authHeader);
    
    
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new Error('Authentication Invalid 1')
    }

    const token = authHeader.split(' ')[1]
    // console.log(token);
    

    try {
        const payLoad = jwt.verify(token, process.env.JWT_SECRET)
        req.user = {userId:payLoad.userId, userName:payLoad.userName}

        next()
    } catch (error) {
        throw new Error('Authentication Invalid 2')
        
    }
}

module.exports = auth