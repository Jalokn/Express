const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/relationshipDemo', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connection open')
    })
    .catch((err) => {
        console.log(err)
    })


const farmSchema = new mongoose.Schema({
    name: String,
    city: String,
    products: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Product' }]
})


const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    season: {
        type: String,
        enum: ['Spring', 'Summer', 'Fall', 'Winter']

    }
})
const Product = mongoose.model('Product', productSchema)
const Farm = mongoose.model('Farm', farmSchema)



// Product.insertMany([
//     { name: 'Goddess Melon', price: 4.99, season: 'Summer' },
//     { name: 'Surgar Baby Watermleon', price: 43.99, season: 'Summer' }

// ])


// const makeFarm = async () => {
//     const farm = new Farm({ name: 'Full Belly Farms', city: 'Guinda, CA' })
//     const melon = await Product.findOne({ name: 'Goddess Melon' })
//     farm.products.push(melon)
//     await farm.save()
//     console.log(farm)
// }

// makeFarm()

const addProduct = async () => {
    const farm = await Farm.findOne({ name: 'Full Belly Farms' })
    const Watermleon = await Product.findOne({ name: 'Surgar Baby Watermleon' })
    farm.products.push(Watermleon)
    await farm.save()
    console.log(farm)
}


Farm.findOne({ name: 'Full Belly Farms' }).populate('products').then(farm => console.log(farm))