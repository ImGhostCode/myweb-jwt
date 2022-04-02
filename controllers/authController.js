const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const Account = require('../models/Account')

const refreshTokens = []

function generateAccessToken(account) {
    return jsonwebtoken.sign({
        id: account.id,
        isAdmin: account.isAdmin
    }, process.env.ACCESS_SECRET, {
        expiresIn: '150s'
    })
}

function generateRefreshToken(account) {
    return jsonwebtoken.sign({
        id: account.id,
        isAdmin: account.isAdmin
    }, process.env.REFRESH_SECRET, {
        expiresIn: '365d'
    })
}

const login = async (req, res) => {
    try {
        
        const account = await Account.findOne({username: req.body.username})
        if (!account) return res.status(404).json('Username invalid')
        const validPassword = await bcrypt.compareSync(req.body.password, account.password )

        if (!validPassword) return res.status(404).json('Password invalid')

        const accessToken = generateAccessToken(account)
        const refreshToken = generateRefreshToken(account)
        refreshTokens.push(refreshToken)
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure:false,
            path: "/",
            sameSite: "strict",
          });
          res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure:false,
            path: "/",
            sameSite: "strict",
          });

          //const {password, ...others} = account._doc
          //res.status(200).json({...others, accessToken, refreshToken})
          res.redirect('/')
    } catch (error) {
        res.status(500).json(error)
    }
  
}

const registerUser = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashed = await bcrypt.hash(req.body.password, salt)

        const newAccount = await new Account({
            username: req.body.username,
            email: req.body.email,
            password: hashed
        })

        const account = await newAccount.save()
        res.status(201).redirect('/login')
        
    } catch (error) {
        res.status(500).json(error)
    }
}

const logout = (req, res) => {
    let refreshToken = req.cookies.refreshToken
    refreshTokens.filter(token => token !== refreshToken)
    res.clearCookie('refreshToken')
    res.clearCookie('accessToken')
    res.status(200).redirect('/login')
    //res.status(200).json('Logout successfully!')
    
}

const refreshToken = (req, res) => {

    const refreshToken = req.cookies.refreshToken
    //console.log(refreshToken)

    if (!refreshToken) return res.status(401).json("You're not authenticated")

    if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).json("Refresh token is not valid")
    }
    jsonwebtoken.verify(refreshToken, process.env.REFRESH_SECRET, (err, data) => {
        if (err) console.log(err)
        refreshTokens.filter(token => token !== refreshToken)
        const newAccessToken = generateAccessToken(data)
        const newRefreshToken = generateRefreshToken(data)
        refreshTokens.push(newRefreshToken)
          res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure:false,
            path: "/",
            sameSite: "strict",
          }); 
          res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure:false,
            path: "/",
            sameSite: "strict",
          });  
          res.status(200).json('Refresh Token')
          
    })
}

module.exports = {
    login,
    refreshToken,
    logout,
    registerUser
}



