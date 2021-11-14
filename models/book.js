const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const BookSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    author: String,
    price: Number,
    description: String,
    image: String,
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }
})

module.exports = mongoose.model('Book', BookSchema);