import express, {Request, Response} from 'express';
const router = express.Router({mergeParams:true});
import passport from 'passport';
const wrapAsync = require('../utils/wrapAsync');
const {validateUser,showUserValidationErrors}= require('../schemaValidations/userSchemaValidation');
const {isAuthenticated} = require('../middlewares/isAuthenticated');
import {authenticatePost}  from '../middlewares/authenticatePost';
const users = require('../controllers/users');

router.route('/register')
.get(showUserValidationErrors,users.renderSignUpForm)
.post(validateUser,wrapAsync(users.registerUser))

router.route('/login')
.get(users.renderLoginPage)
.post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),users.login)

router.get('/logout', users.logout);

router.get('/user',isAuthenticated,wrapAsync(users.profilePage)) 

router.delete('/user/:userId',authenticatePost,wrapAsync(users.deleteUserAccount)) 
  
module.exports = router