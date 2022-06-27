const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('all dogs')
})
router.post('/', (req, res) => {
    res.send('adding shelter')
})
router.get('/:id', (req, res) => {
    res.send('one dog')
})

router.get('/:id/edit', (req, res) => {
    res.send('Editing one dog')
})

module.exports = router