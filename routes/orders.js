const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn} = require('../middleware');


router.post('/', catchAsync(async(req,res)=>{
    let {user, total, bookCart} = req.body;
    let order = {
        fullName: user.username,
        phoneNumber: user.numberPhone,
        address: user.address,
        cart: bookCart,
        total
    }
    let newOrder = new Order(order);
    await newOrder.save();
    console.log(newOrder);
}))

router.get('/', catchAsync(async(req,res)=>{
    let orders = await Order.find({});
    res.render('admin/orders', {orders, page:'order'});
}))

router.get('/:id', catchAsync(async(req,res)=>{
    let {id} = req.params;
    let order = await Order.findById(id);
    res.json(order);
}))

router.post('/:id/changeStatus', catchAsync(async(req,res)=>{
    let {id} = req.params;
    let updateOrder = await Order.findByIdAndUpdate(id,req.body);
    console.log(updateOrder);
}))
module.exports = router;