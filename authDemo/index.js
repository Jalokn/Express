const express = require('express')
const mongoose = require('mongoose')
const app = express()
const bcrypt = require('bcrypt')
const User = require('./models/user')
const session = require('express-session')
const user = require('./models/user')

mongoose.connect('mongodb://localhost:27017/authDemo')

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: 'notagoodsecret', resave: false, saveUninitialized: false, }))

const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/login')
    }
    next()
}

app.get('/', (req, res) => {
    res.send('This is Home')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body
    const user = new User({ username, password })
    await user.save()
    req.session.user_id = user._id
    res.redirect('/')
})

app.get('/login', async (req, res) => {
    res.render('login')
})
app.post('/login', async (req, res) => {
    const { username, password } = req.body
    const foundUser = await User.findAndValidate(username, password)
    if (foundUser) {
        req.session.user_id = foundUser._id
        res.redirect('/secret')
    } else {
        res.send('incorrect Username or Password')
    }
})

app.post('/logout', (req, res) => {
    req.session.user_id = null
    res.redirect('/login')
})

app.get('/secret', requireLogin, (req, res) => {

    res.render('secret')
})

app.listen(3000, () => {
    console.log('Listening')
})