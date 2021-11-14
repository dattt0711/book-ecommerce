const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Category = require('../models/category');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn} = require('../middleware');


router.get('/', catchAsync(async(req,res)=>{
    const current = Number(req.params.page) || 1;
    const perPage = 12;
    const books = await Book.find({}).skip(perPage*(current-1)).limit(perPage);
    const allBook = await Book.find({});
    const categories = await Category.find({});
    res.render('books/index',{
        cat: "all",
        categories,
        books,
        pages: Math.ceil(allBook.length/perPage),
        current
    })
}))

router.get('/category/:cat', catchAsync(async(req,res)=>{
    const current = Number(req.params.page) || 1;
    const perPage = 12;
    const categories = await Category.find({});
    const cat = await Category.findOne({name: req.params.cat});
    const books = await Book.find({category: cat._id}).skip(perPage*(current-1)).limit(perPage); 
    const allBook = await Book.find({category: cat._id});
    res.render('books/index',{
        cat: req.params.cat,
        categories,
        books,
        pages: Math.ceil(allBook.length/perPage),
        current
    })
}))

router.get('/category/:cat/page/:page', catchAsync(async(req,res)=>{
    const current = Number(req.params.page) || 1;
    const perPage = 12;
    const cat = await Category.findOne({name: req.params.cat});
    const categories = await Category.find({});
    let books;
    if(req.params.cat === 'all'){
        books = await Book.find({}).skip(perPage*(current-1)).limit(perPage);  
    }
    else {
        books = await Book.find({category: cat._id}).skip(perPage*(current-1)).limit(perPage);
    }

    const allBook = await Book.find({});
    res.render('books/index',{
        cat: req.params.cat,
        categories,
        books,
        pages: Math.ceil(allBook.length/perPage),
        current
    })
}));





router.get('/:id', catchAsync(async(req,res)=>{
    const {id} = req.params;
    const getBook = await Book.findById(id);
    res.render('books/show', {getBook})
}))






module.exports = router;