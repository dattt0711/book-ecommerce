const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Book = require('../models/book');
const Category = require('../models/category');
const listBook = require('../books')
const faker = require('faker');
mongoose.connect('mongodb://localhost:27017/book-shop');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', ()=>{
    console.log('database connected');
});


const seedDB = async ()=>{
    await Book.deleteMany({});
    for(let i=0;i<100;i++){
        let b = new Book();
        let c = await Category.findOne({name: 'self-help'})
        b.name = faker.commerce.product();
        b.price = faker.commerce.price();
        b.description = faker.commerce.productDescription();
        b.image = faker.image.nature();
        b.author = "Keigo";
        c.books.push(b);
        b.category = c;
        await b.save();
        await c.save();
    }
}

seedDB();