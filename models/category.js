const mongoose = require('mongoose');
const Book = require('./book')
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: String,
    books: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Book'
        }
    ]
})
CategorySchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Book.remove({
            _id: {
                $in: doc.books
            }
        })
    }
})
module.exports = mongoose.model('Category', CategorySchema);