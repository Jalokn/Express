const express = require('express')
const app = express()
const morgan = require('morgan')



app.use(morgan('dev'))

app.use((req, res, next) => {
    req.requestTime = Date.now()
    console.log(req.method, req.path, req.requestTime)
    next()
})

app.use('/dogs', (req, res, next) => {
    console.log("I LOVE DOGS")
    next()
})

const verifyPassword = ((req, res, next) => {
    const { password } = req.query
    if (password === 'chicken') {
        next()
    }
    res.send('Sorry you need the password')
})

app.get('/', (req, res) => {
    res.send('Home')
})
app.get('/dogs', (req, res) => {
    res.send('woof woof')
})

app.get('/secret', verifyPassword, (req, res) => {
    res.send('This is my secret')
})

app.use((req, res) => {
    res.status(404).send('NOT FOUND')
})

app.listen(3000, () => console.log('App is running '))