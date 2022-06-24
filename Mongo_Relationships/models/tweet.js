const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/relationshipDemo', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connection open')
    })
    .catch((err) => {
        console.log(err)
    })



const userSchema = new mongoose.Schema({
    username: String,
    age: Number,

})
const tweetSchema = new mongoose.Schema({
    text: String,
    likes: Number,
    user: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' }
})

const User = mongoose.model('User', userSchema)
const Tweet = mongoose.model('Tweet', tweetSchema)


// const makeTweets = async () => {
//     const user = await User.findOne({ username: 'ChickenFan99' })
//     const tweet1 = new Tweet({ text: 'Chicken R life', likes: 2 })
//     tweet1.user = user
//     user.save()
//     tweet1.save()
// }
// makeTweets()
const findTweet = async () => {
    const t = await Tweet.find().populate('user', 'username')
    console.log(t)
}
findTweet()