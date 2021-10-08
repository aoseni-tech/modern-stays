import {Request, Response, NextFunction} from 'express';
import { UserModel } from '../models/userSchema';
let errMessages: string[]  = []; //array to store the error messages from the stayschema

const clearErrors = ()=>{
  errMessages = [];
}

const registerUser = (req:Request, res: Response)=>{
  const title = 'Register';
  const page = 'register';
  res.render('pages/register',{title,page,errMessages})
  clearErrors(); 
}

const validate = (req:Request,res:Response,next:NextFunction)=>{
  const {username,password} =  req.body;
  let validUsername = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/
  let validPassword = /.{5,}/   
  let user = new UserModel(req.body);
  let schema_error  = user.validateSync();

  if (!username || !username.match(validUsername)) {
    errMessages.push('username can only use letters(a-z,A-Z),numbers,underscores and periods below 30 characters')
  }
  
  if(schema_error){
      let message  = schema_error.errors['email']?.message;
      errMessages.push(message)
  }

   if (!password || !password.match(validPassword)) {
    errMessages.push('password must contain at least five(5) characters')
  }
  next();
}

const showErrors =  (req:Request,res:Response,next:NextFunction)=>{  
    if(errMessages.length) {
        errMessages.unshift('form-validated')
        res.redirect(`/register`);
    }  else {
      next();
    }
  }

const checkuserValidity = [validate,showErrors]

module.exports = {checkuserValidity,registerUser}