import { profile } from 'console';
import express, {Request, Response, NextFunction} from 'express';
import {Document,Schema} from 'mongoose';
const router = express.Router({mergeParams:true});
import passport from 'passport';
const wrapAsync = require('../utils/wrapAsync');
const{User} = require('../models/userSchema');
const {checkuserValidity,registerUser}= require('../schemaValidations/userSchemaValidation');
const {isAuthenticated} = require('../middlewares/isAuthenticated');

router.route('/register')
.get(registerUser)
.post(checkuserValidity,wrapAsync(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', `Welcome to Modern Stays, ${username}`);
            let redirectUrl = req.session.returnTo || '/'
            res.redirect(redirectUrl);
            delete  res.locals.returnTo
        })
    } catch (e:any) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}))

router.route('/login')
.get((req:Request, res: Response)=>{
      const title = 'LogIn';
      const page = 'Login';
      res.render('pages/login',{title,page})
    })
.post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),(req:Request,res:Response)=>{
    let username = req.user?.username
    req.flash('success', `Welcome back,  ${username}`);
    let redirectUrl = req.session.returnTo || '/'
    res.redirect(redirectUrl);
})

router.get('/logout', function(req, res){
    req.logout();
    req.flash('info','You have been logged out')
    res.redirect('/');
  });

 router.get('/user',isAuthenticated,(req,res,next) =>{
    let title,page = 'profile'
    res.render('pages/user',{title,page})
 }) 
  
module.exports = router