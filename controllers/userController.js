const AccountModel = require("../models/Account")


const loginPage = (req, res) => {
    res.render('login')
}

const registerPage = (req, res) => {
    res.render('register')
}

const homePage = async (req, res) => {
    let account, currUser
    try {
        currUser = await AccountModel.findById(req.user.id)
        account = await AccountModel.find({})
    } catch (error) {
        res.status(500).json(error)
    }
    res.render('home', {dataUser: account, User: currUser}) 
}


const deleteUser = async (req, res) => {
    try {
        const account = await AccountModel.findOne({_id: req.params.id})
        account.remove()
        res.status(200).redirect('/')
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {
    deleteUser,
    loginPage,
    registerPage,
    homePage
}