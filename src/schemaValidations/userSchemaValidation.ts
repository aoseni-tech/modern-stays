import {Request, Response, NextFunction} from 'express';
import { UserModel } from '../models/userSchema';
let errMessages:{username:string;email:string;password:string;form:string;} = {
  username: '',
  email: '',
  password: '',
  form:''
}; //array to store the error messages from the stayschema

const clearErrors = ()=>{
  errMessages = {
    username: '',
    email: '',
    password: '',
    form:''
  };
}

const validateUser = (req:Request,res:Response,next:NextFunction)=>{
  const {username,password} =  req.body;
  let validUsername = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/
  let validPassword = /.{5,}/   
  let user = new UserModel(req.body);
  let schema_error  = user.validateSync();

  if (!username || !username.match(validUsername)) {
    errMessages.username = 'username can only use letters(a-z,A-Z),numbers,underscores and periods below 30 characters'
    errMessages.form = 'form-validated'
  }
  
  if(schema_error){
      let message  = schema_error.errors['email']?.message;
      errMessages.email = message;
      errMessages.form = 'form-validated'
  }

   if (!password || !password.match(validPassword)) {
    errMessages.password = 'password must contain at least five(5) characters'
    errMessages.form = 'form-validated'
  }
  if(errMessages.form){return res.redirect(`/register`);}
  next();
}

const showUserValidationErrors =  (req:Request,res:Response,next:NextFunction)=>{  
  res.locals.errMessages = errMessages;
  next()
  clearErrors()
}

module.exports = {validateUser,showUserValidationErrors}