const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Book = require('./models/book');
const Category = require('./models/category');
const bodyParser = require('body-parser') 
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync')
const passport = require('passport')
const LocalStrategy = require('passport-local');
const User = require('./models/user')
const session = require('express-session')
const flash = require('connect-flash')
const {isLoggedIn} = require('./middleware')
const Cart = require('./models/cart')
const ObjectId = mongoose.Types.ObjectId;
const cors = require('cors');


const booksRoute = require('./routes/books')
const userRoute = require('./routes/user')
const adminRoute = require('./routes/admin')
const orderRoute = require('./routes/orders')
mongoose.connect('mongodb://localhost:27017/book-shop');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', ()=>{
    console.log('database connected');
})

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(methodOverride('_method'));
const sessionConfig = {
    secret: 'notbettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expries: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.succes = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', ejsMate);


app.get('/fake', async(req,res)=>{
    const user = new User({email:'test@gmail.com', numberPhone:'033412312', username:'colt'})
    const newUser = await User.register(user, 'chicken');
    res.send(newUser);
})

app.use('/', userRoute)
app.use('/books', booksRoute);
app.use('/', adminRoute)
app.use('/orders', orderRoute);
app.get('/cart', isLoggedIn, (req,res)=>{
    let name = req.user.username;
    if(!req.session[name]) {
        req.session[name] = {
        cart: [],
        totals: 0
    }
    }
    let bookCart = req.session[name].cart;
    res.render('books/cart', {bookCart, user: req.user, total: req.session[name].totals})
})

app.delete('/cart/deleteBook/:id', cors(), (req,res)=>{
    let {id} = req.params;
    let name = req.user.username;
    deleteBook(id, req.session[name].cart);
    res.json(req.session[name].cart)
})

app.post('/cart/changeQty/:id', cors(), (req,res)=>{
    let {id} = req.params;
    let {sign} = req.body;
    let name = req.user.username;
    changeQty(id, req.session[name].cart, sign);
    let updateBook = req.session[name].cart.filter(e=> e.id.toString()==id)[0];
    req.session[name].totals = calculateTotal(req.session[name].cart);
    res.json({updateBook, total: req.session[name].totals})
})



app.get('/addToCart/:id', isLoggedIn, async (req,res)=>{
    let name = req.user.username;
    if(!req.session[name]) {
        req.session[name] = {
        cart: [],
        totals: 0
    }
    }
    
    let book = await Book.findById(req.params.id);
        if(isInCart(req.session[name].cart, book._id)){
            console.log('have book')
            updateCart(req.session[name].cart, book._id);
            req.session[name].totals = calculateTotal(req.session[name].cart);
        }
        else{
            console.log('cart empty')
            let b = {
                id: book._id,
                price: book.price,
                qty: 1,
                image: book.image,
                name: book.name,
            }
            req.session[name].cart.push(b);
            req.session[name].totals = calculateTotal(req.session[name].cart);
        }
    let bookCart = req.session[name].cart;
    res.render('books/cart', {bookCart, user: req.user, total: req.session[name].totals})
})

function isInCart(cart, bookId){
    let found = false;
    cart.forEach( e=>{
        if(e.id.toString() === bookId.toString()) found = true;
    })
    return found; 
}

function updateCart(cart,bookId){
    cart.forEach( e=>{
        if(e.id.toString()==bookId.toString()){
            e.qty++;
        }
    })
}

function calculateTotal(cart){
    let sum = 0;
    cart.forEach(e=>{
        sum+=e.price*e.qty;
    })
    return sum;
}

function changeQty(bookId, cart, sign) {
    cart.forEach(e => {
        if (e.id.toString() == bookId.toString()) {
            switch (sign) {
                case "plus":
                    e.qty++;
                    break;
                case "minus":
                    e.qty--;
                    break;
            }
        }
    })
}

function deleteBook(bookId, cart){
    cart.forEach(e => {
        if (e.id.toString() == bookId.toString()) {
            let index = cart.indexOf(e);
            cart.splice(index,1);    
        }
    console.log(cart.length)
})
}

app.get('/', (req,res) => {
    res.render('home');
})

app.listen(3000, ()=>{
    console.log('listen on port 3000')
})