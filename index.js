const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const db = require('./configs/connectDB')
const AuthRoute = require('./routes/AuthRoute')
const UserRoute = require('./routes/UserRoute')

const PORT = process.env.PORT || 5500

// Use middleware
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({extended: true}))

// Connect database
db.connect()

app.set("view engine", "ejs")
app.set("views", "./views")

app.use('/auth', AuthRoute)
app.use('/', UserRoute)

app.use((req, res) => {
    res.status(404).json('404 NOT FOUND')
})

// const ngrok = require('ngrok');
// (async function() {
//   const url = await ngrok.connect(5500);
// })();

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`)
})