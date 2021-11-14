const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
router.get('/register', (req, res) => {
    res.render('authentication/register')
})

router.post('/register', catchAsync(async (req, res,next) => {
    try{
    const {email, username, numberPhone, password, address, fullName} = req.body;
    const user = new User({email, numberPhone, username, fullName, address});
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err=>{
        if(err) return next(err);
        res.redirect('/books')
    })
    }
    catch(e){
        console.log(e);
        res.redirect('/register')
    }
}))

router.get('/login',(req, res) => {
    res.render('authentication/login');
})

router.post('/login',passport.authenticate('local', {failureFlash: true, failureRedirect:'/login'}), (req, res)=>{
    const redirectUrl = req.session.returnTo || '/books';
    delete req.session.returnTo;
    res.redirect(redirectUrl)
})

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/books');
})


module.exports = router