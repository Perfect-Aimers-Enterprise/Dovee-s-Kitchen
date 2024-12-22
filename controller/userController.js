const userSchema = require('../model/userModel')

const registerUser = async (req, res) => {
    try {
        const user = await userSchema.create({ ...req.body })
        console.log(user);
        const token = user.createJwt()
        res.status(201).json({
            user: {
                userName: user.userName,
                userEmail: user.userEmail,
                userPhone: user.userPhone
            },
            token
        })

        console.log(token);
        
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


module.exports = {
    registerUser, loginUser
}