const mongoose = require('mongoose')

async function connect() {
    try {
        await mongoose.connect(process.env.MONGOOSE_URL)
        console.log('Connected successfully')
    } catch (error) {
        console.log(error)
    }
}

module.exports = {connect}