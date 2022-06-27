const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose');
const methodOveride = require('method-override')
const AppError = require('./AppError')
const Product = require('./models/product');
const { ppid } = require('process');
const Farm = require('./models/farm');
const { findById } = require('./models/product');
const { response } = require('express');
const flash = require('connect-flash')
const session = require('express-session')

app.use(session({ secret: 'this is not a good secret', resave: false, saveUninitialized: false }))
app.use(flash())

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

//Farm Routes

app.use((req, res, next) => {
    res.locals.messages = req.flash('success')
    next()
})

app.get('/farms', async (req, res) => {
    const farms = await Farm.find({})
    res.render('farms/index', { farms })
})

app.get('/farms/new', (req, res) => {
    res.render('farms/new')
})

app.post('/farms', async (req, res) => {
    const newFarm = new Farm(req.body)
    newFarm.save()
    req.flash('success', 'New farm added')
    res.redirect('/farms')
})

app.get('/farms/:id', async (req, res) => {
    const { id } = req.params
    const farm = await Farm.findById(id).populate('products')
    res.render('farms/show', { farm })
})

app.delete('/farms/:id', async (req, res) => {
    await Farm.findByIdAndDelete(req.params.id)
    res.redirect('/farms')
})

app.get('/farms/:id/products/new', async (req, res) => {
    const { id } = req.params
    const farm = await Farm.findById(id)
    res.render('products/new', { categories, farm })
})

app.post('/farms/:id/products', async (req, res) => {
    const { id } = req.params
    const farm = await Farm.findById(id)
    const product = new Product(req.body)
    farm.products.push(product)
    product.farm = farm;
    await farm.save()
    await product.save()
    res.redirect(`/farms/${id}`)
})


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
    const product = await Product.findById(id).populate('farm', 'name')
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

