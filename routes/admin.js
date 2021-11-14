const express = require('express');
const router = express.Router();
const {isLoggedIn, isAdmin} = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const Book = require("../models/book");
const Category = require('../models/category');


// router.use(isLoggedIn, isAdmin, (req,res, next) => {
//     next();
// });

router.get('/admin', catchAsync(async (req,res) => {
    let books = await Book.find({}).populate('category');
    let category = await Category.find({});
    res.render('admin/index',{books, category, page:'book'})
}))

router.get('/admin/books/new', async (req, res)=>{
    let cat = await Category.find({});
    res.render('admin/createBook', {category:cat});
})

router.post('/admin/category',catchAsync(async(req, res)=>{
    const {name} = req.body;
    const newCategory = new Category({name});
    await newCategory.save();
    res.redirect("/admin");
}))

router.patch('/admin/category/:id', async (req, res)=>{
    const id = req.params.id;
    const obj = JSON.parse(JSON.stringify(req.body));
    const updateCat = await Category.findByIdAndUpdate(id, obj);
    res.redirect('/admin')
})

router.delete('/admin/category/:id', async (req, res)=>{
    const {id} = req.params;
    await Category.findByIdAndDelete(id);
    res.redirect('/admin')
})

router.post('/admin/books', catchAsync(async (req, res)=>{
    const {name,price,author, category, description,image} = req.body;
    let cat = await Category.findOne({name: category});
    const newBook = new Book({name, price, author, description, image});
    newBook.category = cat._id;
    cat.books.push(newBook);
    await newBook.save();
    await cat.save();
    res.redirect("/admin");
}));

router.get('/admin/books/:id/edit', catchAsync(async(req,res)=>{
    const book = await Book.findById(req.params.id).populate('category');
    let cat = await Category.find({});
    res.render('admin/editBook',{book,cat})
}))
router.patch('/admin/books/:id', catchAsync(async(req,res)=>{
    const {id} = req.params;
    console.log(req.body.category)
    if(req.body.category){
        let cat = await Category.findOne({name: req.body.category});
        req.body.category = cat._id;
    }
    const updateBook = await Book.findByIdAndUpdate(id, req.body);
    res.redirect('/admin')
}))


router.delete('/admin/books/:id', async(req,res)=>{
    let book = await Book.findById(req.params.id);
    await Category.findByIdAndUpdate(book.category, {$pull:{books: book._id}});
    await Book.findByIdAndDelete(req.params.id);
    res.redirect('/admin')
})

module.exports = router;