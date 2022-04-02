const jwt = require('jsonwebtoken')

const authToken = (req, res, next) =>  {
    //const token = req.headers['authorization']
    const accessToken = req.cookies.accessToken
    if (accessToken){
        //const accessToken = token.split(' ')[1]
        jwt.verify(accessToken, process.env.ACCESS_SECRET, (err, data) => {
            if (err) {
                
                return res.status(403).json('Token is invalid')
                
            }
           
            req.user = data
            next()
        })
    } else {
        //res.status(401).json('You are not authenticated')
        res.redirect('/login')
    }
}

const authTokenAdmin = (req, res, next) =>  {
    authToken(req, res, () => {
        if (req.user.isAdmin){
            next()
        } else {
            res.status(403).json("You're not allowed to do that!")
        }
    })
}

module.exports = {
    authToken,
    authTokenAdmin
}

