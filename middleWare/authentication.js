const userSchema = require('../model/userModel')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {

    // console.log(req.headers);

    // console.log(req);

    const authHeader = req.headers.authorization
    // console.log('authenTicationHeaderConsole', authHeader);

    // console.log(authHeader);


    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(403).json({ error: 'Invalid Authentication' })
    }

    const token = authHeader.split(' ')[1]
    // console.log(token);


    try {
        const payLoad = jwt.verify(token, process.env.JWT_SECRET)
        req.user = { userId: payLoad.userId, userName: payLoad.userName }

        next()
    } catch (error) {
        return res.status(403).json({ error: 'Invalid Authentication' })

    }
}

module.exports = auth