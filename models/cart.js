const Book = require('../models/book');
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

class Cart {
    constructor(){
    this.data = {};
    this.data.items = [];
    this.data.totals = 0;
    }
    isInCart(id){
        let found = false;
        this.data.items.forEach(item=>{
            console.log(item)
            if(ObjectId.toString(item.id)==ObjectId.toString(id)) found = true;
        })
        return found;
    }
    addToCart(b){
        let found = this.isInCart(b._id);
        if(!found){
            let newBook = {
                id : b._id,
                price: b.price,
                qty: 1,
                image: b.image,
                name: b.name,
                amount: this.qty*this.price
            }
            this.data.items.push(newBook);
        }
        else{
            console.log('helo2')
            this.data.items.map(item=>{
                if(item.id==b._id){
                 item.qty+=1;
                 item.amout = item.qty * item.price;
                }
            })
        }
    }
}

module.exports = Cart;