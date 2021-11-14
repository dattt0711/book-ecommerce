const { unique } = require('faker');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    numberPhone: {
        type: Number,
        required: true,
        unique: true
    },
    address:{
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['ADMIN', 'USER', 'SALE'],
        default: 'USER'
    }
})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);