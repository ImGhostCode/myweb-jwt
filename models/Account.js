const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 7,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        max: 20,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 7
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

const AccountModel = mongoose.model('account2', accountSchema)

module.exports = AccountModel