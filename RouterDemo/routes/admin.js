const express = require('express')
const router = express.Router()


router.use((req, res, next) => {
    if (req.query.isAdmin) {
        next()
    }
    res.send('Not Admin')
})

router.get('/topsecret', (req, res) => {
    res.send('This is the secret')
})
router.get('/deleteeverything', (req, res) => {
    res.send('Everything is deleted')
})



module.exports = router