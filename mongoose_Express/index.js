const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose');
const methodOveride = require('method-override')
const AppError = require('./AppError')


const Product = require('./models/product')
mongoose.connect('mongodb://localhost:27017/farmStand')
    .then(() => {
        console.log('Mongo connection open')
    })
    .catch((err) => {
        console.log('mongo error', err)
    })

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOveride('_method'))


const categories = ['fruit', 'vegetable', 'dairy',]

app.get('/products/new', (req, res) => {

    res.render('products/new', { categories })
})

app.post('/products', wrapAsync(async (req, res, next) => {
    const newProduct = new Product(req.body)

    await newProduct.save()

    res.redirect(`/products/${newProduct._id}`)

}))

app.get('/products', async (req, res, next) => {
    try {
        const { category } = req.query;
        if (category) {
            const products = await Product.find({ category: category })
            res.render('products/index', { products, category })

        } else {
            const products = await Product.find({})
            res.render('products/index', { products, category: 'All' })
        }

    } catch (err) {
        next(err)
    }

})

function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e))
    }


}

app.get('/products/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params
    const product = await Product.findById(id).catch((err) => {
        next(new AppError(`Product not found: ${err}`, 404))
    })
    res.render('products/show', { product })

}))

app.get('/products/:id/edit', async (req, res, next) => {
    const { id } = req.params
    const product = await Product.findById(id).catch((err) => {
        next(err)
    })
    res.render('products/edit', { product, categories })
})

app.put('/products/:id', async (req, res, next) => {
    const { id } = req.params
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true }).catch((err) => {
        next(err)
    })
    await product.save()
    console.log(req.body)
    res.redirect(`/products/${product._id}`)
})

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params
    const deletedProduct = await Product.findByIdAndDelete(id).catch(err => {
        next(err)
    })
    res.redirect('/products')
})



app.use((err, req, res, next) => {
    const { status = 500, message = 'Seomthing went wrong' } = err
    res.status(status).send(message)
}
)

app.listen(3000, () =>
    console.log('Listening on port 3000'))

