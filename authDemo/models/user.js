const bcrypt = require('bcrypt')
const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username cannot be blank'],
    },
    password: {
        type: String,
        required: [true, 'Password cannot be blank'],
    }
})

userSchema.statics.findAndValidate = async function (username, password) {
    const foundUser = await this.findOne({ username })
    const validPassword = await bcrypt.compare(password, foundUser.password)
    return validPassword ? foundUser : false
}

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12)
    next()
})

module.exports = mongoose.model('User', userSchema)