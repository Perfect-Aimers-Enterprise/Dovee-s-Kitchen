const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const adminSchema = new mongoose.Schema({
    adminEmail: {
        type: String, 
        required: true,
        unique: true, 
        match: [/(([a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*)|(".+"))@(([0-9]{1,3}\.([0-9]{1,3})){2,}|([a-zA-Z_]+(\.[a-zA-Z_]+)+))/, 'Please Provide a valid email']
    },
    adminPhone: {type: Number},
    adminPassword: {type: String, required: true}
})


module.exports = mongoose.model('adminAuth', adminSchema)