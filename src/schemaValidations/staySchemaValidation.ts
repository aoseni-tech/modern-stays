import express, {Request, Response, NextFunction} from 'express';
const{schema,Stay} = require('../models/staySchema');
let errMessages: string[]  = []; //array to store the error messages from the stayschema
let data_values: string[]  = []; //values stored from input after form submission if any validation fails
let dataKeys:any[] = []; //array to store object keys from req.body in order to retrieve validate messages from schema validate method;

const clearErrors = ()=>{
  errMessages = [];
  data_values = []; 
  dataKeys = [];
}

const createNewStay = (req:Request, res: Response)=>{
  const title = 'Add new.MS';
  const page = 'new';
  res.render('pages/new',{title,page,errMessages,data_values})
  clearErrors(); 
}

const updateStay = async(req:Request, res: Response)=>{
  const stay = await Stay.findById(req.params.id);
  const{title} = stay;
  const page = 'update';  
  res.render('pages/update',{title:`Update ${title}.MS`,stay,page,errMessages,data_values});
  clearErrors(); 
}

const checkStayValidity = (req:Request,res:Response,next:NextFunction)=>{   
  const stay = new Stay(req.body);
  let id = req.params.id;
  let schema_error  = stay.validateSync();
  
  if(schema_error){
    errMessages.push('form-validated');
    for(let data in req.body) {
      let message  = schema_error.errors[`${data}`]?.message;
      errMessages.push(message)
      dataKeys.push(data)
      data_values.push(req.body[data].trim())
   }    
   if(data_values[4].length<10) data_values[4] = "";
   for(let i = 0; i < dataKeys.length; i++) {
     if(!errMessages[i+1]) errMessages[i+1] = schema.obj[dataKeys[i]].validate.message();
    }
    
   if(req.method === 'PUT') res.redirect(`/stays/${id}/update`)
   else res.redirect(`/stays/new`);
  } else {
    res.locals.stay = stay;
    next();
  }
}

module.exports = {checkStayValidity,createNewStay,updateStay}