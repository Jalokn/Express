const express = require('express')
const app = express()
const morgan = require('morgan')
const AppError = require('./AppError')



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
    throw new AppError('Password Required', 401)
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

app.get('/admin', (req, res) => {
    throw new AppError('You are not an Admin', 403)
})

app.get('/error', (req, res) => {
    chicken.fly()
})

app.use((req, res) => {
    res.status(404).send('NOT FOUND')
})

app.use((err, req, res, next) => {
    const { status = 500, message = 'Something Went Wrong' } = err
    res.status(status).send(message)
})

app.listen(3000, () => console.log('App is running '))