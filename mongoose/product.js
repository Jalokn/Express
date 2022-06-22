const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopApp')
    .then(() => {
        console.log('connection open')
    })
    .catch((err) => {
        console.log(err)
    })

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 20,
    },
    price: {
        type: Number,
        required: true,
        min: [0, " price must be positive"],
    },
    onSale: {
        type: Boolean,
        default: false,
    },
    categories: {
        type: [String],
        default: ['Biking']
    },
    qty: {
        online: {
            type: Number,
            default: 0,
        },
        inStore: {
            type: Number,
            default: 0,
        },
    },
    size: {
        type: String,
        enum: ['S', 'M', 'L']
    }
})



productSchema.methods.greet = function () {
    console.log('Hello')
    console.log(`- from ${this.name}`)
}

productSchema.methods.toggleOnSale = function () {
    this.onSale = !this.onSale
    return this.save()
}

productSchema.methods.addCategory = function (newCat) {
    this.categories.push(newCat)
    return this.save
}

productSchema.statics.fireSale = function () {
    return this.updateMany({}, { onSale: true, price: 0 })
}

const Product = mongoose.model('Product', productSchema)



const findProduct = async () => {

    const foundProduct = await Product.findOne({ name: "Mountain Bike" })
    console.log(foundProduct)
    await foundProduct.addCategory('Outdoor')
    console.log(foundProduct)

}



Product.fireSale().then(res => console.log(res))

// findProduct()