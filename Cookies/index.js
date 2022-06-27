const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')

app.use(cookieParser('thisismysecret'))

app.get('/greet', (req, res) => {
    const { name = 'anon' } = req.cookies
    res.send(`Hey there ${name}`)
})


app.get('/setname', (req, res) => {
    res.cookie('name', 'Jacob')
    res.cookie('animal', 'shrimp')
    res.send('added a cookie')
})
app.get('/getsignedcookie', (req, res) => {
    res.cookie('fruit', 'grape', { signed: true })
    res.send('Signed!')
})

app.get('/verifyfruit', (req, res) => {
    const { fruit } = req.signedCookies
    res.send(`recived your signed cookie: ${fruit}`)
})

app.listen(3000, () => {
    console.log('Listening')
})