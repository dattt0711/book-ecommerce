const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const OrderSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    address: {
       type: String,
       required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    cart:{
         type: Array,
         required: true
    },
    total: {
        type: Number,
        required: true
    },
    status:{
        type: String,
        enum: ['PENDING', 'COMPLETED', 'CANCELED'],
        default: 'PENDING'
    }
})

module.exports = mongoose.model('Order', OrderSchema);