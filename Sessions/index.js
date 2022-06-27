const express = require('express')
const app = express()
const session = require('express-session')


app.use(session({ secret: 'thisisnotagoodsecret', resave: false, saveUninitialized: false, }))

app.get('/viewcount', (req, res) => {
    if (req.session.count) {
        req.session.count++
    } else {
        req.session.count = 1
    }
    res.send(`you have veiwed this page ${req.session.count} times`)
})

app.get('/register', (req, res) => {
    const { username = 'anon' } = req.query
    req.session.username = username
    res.redirect('/greet')
})
app.get('/greet', (req, res) => {
    res.send(`Hello ${req.session.username}`)
})

app.listen(3000, (req, res) => {
    console.log('listening')
})